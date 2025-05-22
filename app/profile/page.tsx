import type { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { ok } from 'assert'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserProfileEditor } from '@/components/UserProfileEditor'
import { PreferencesEditor } from '@/components/PreferencesEditor'

export const metadata: Metadata = {
  title: 'Profil | Love Hotel Rencontre',
  description: 'Gérez votre profil Love Hotel Rencontre'
}

// Add this server action for handling profile image uploads
async function uploadProfileImage (formData: FormData) {
  'use server'

  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  const file = formData.get('profileImage') as File

  if (!file || file.size === 0) {
    return { error: 'Aucun fichier sélectionné' }
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(
      `user-photos/${user.id}-${Date.now()}.${file.name.split('.').pop()}`,
      file,
      {
        access: 'public'
      }
    )

    // Update the database with the new photo URL
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')

    // Update the photo column in the users table
    await sql`
      UPDATE users
      SET avatar = ${blob.url}
      WHERE id = ${user.id}
    `

    revalidatePath('/profile')
    return { success: true, url: blob.url }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { error: "Échec du téléchargement de l'image" }
  }
}

async function updateUserProfile (userData: any) {
  'use server'

  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')

  // Update user table
  await sql`
    UPDATE users
    SET name = ${userData.name}
    WHERE id = ${user.id}
  `

  // Update or insert user_profile
  const existingProfile = await sql`
    SELECT * FROM user_profiles WHERE user_id = ${user.id}
  `

  if (existingProfile.length > 0) {
    await sql`
      UPDATE user_profiles
      SET
        age = ${userData.age || null},
        location = ${userData.location || null},
        orientation = ${userData.orientation || null},
        bio = ${userData.bio || null},
        gender = ${userData.gender || null},
        birthday = ${userData.birthday ? userData.birthday : null},
        interests = ${JSON.stringify(userData.interests || [])}
      WHERE user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO user_profiles (id, user_id, age, orientation, location, bio, gender, birthday, interests, status, featured)
      VALUES (gen_random_uuid(), ${user.id}, ${userData.age || null}, ${
      userData.orientation || null
    }, ${userData.location || null}, ${userData.bio || null}, ${
      userData.gender || null
    }, ${userData.birthday ? userData.birthday : null}, ${JSON.stringify(
      userData.interests || []
    )}, 'active', false)
    `
  }
}

async function updateUserPreferences (preferencesData: any) {
  'use server'

  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')

  // Update or insert user_preferences
  const existingPreferences = await sql`
    SELECT * FROM user_preferences WHERE user_id = ${user.id}
  `

  if (existingPreferences.length > 0) {
    await sql`
      UPDATE user_preferences
      SET
        interested_in_restaurant = ${preferencesData.preferences.interested_in_restaurant},
        interested_in_events = ${preferencesData.preferences.interested_in_events},
        interested_in_dating = ${preferencesData.preferences.interested_in_dating},
        prefer_curtain_open = ${preferencesData.preferences.prefer_curtain_open},
        interested_in_lolib = ${preferencesData.preferences.interested_in_lolib},
        suggestions = ${preferencesData.preferences.suggestions}
      WHERE user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO user_preferences (
        id, user_id, interested_in_restaurant, interested_in_events, interested_in_dating, prefer_curtain_open, interested_in_lolib, suggestions
      ) VALUES (
        gen_random_uuid(), ${user.id}, ${preferencesData.preferences.interested_in_restaurant}, ${preferencesData.preferences.interested_in_events}, ${preferencesData.preferences.interested_in_dating}, ${preferencesData.preferences.prefer_curtain_open}, ${preferencesData.preferences.interested_in_lolib}, ${preferencesData.preferences.suggestions}
      )
    `
  }

  // Update or insert user_meeting_types
  const existingMeetingTypes = await sql`
    SELECT * FROM user_meeting_types WHERE user_id = ${user.id}
  `

  if (existingMeetingTypes.length > 0) {
    await sql`
      UPDATE user_meeting_types
      SET
        friendly = ${preferencesData.meetingTypes.friendly},
        romantic = ${preferencesData.meetingTypes.romantic},
        playful = ${preferencesData.meetingTypes.playful},
        open_curtains = ${preferencesData.meetingTypes.open_curtains},
        libertine = ${preferencesData.meetingTypes.libertine},
        open_to_other_couples = ${preferencesData.meetingTypes.open_to_other_couples},
        specific_preferences = ${preferencesData.meetingTypes.specific_preferences}
      WHERE user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO user_meeting_types (
        id, user_id, friendly, romantic, playful, open_curtains, libertine, open_to_other_couples, specific_preferences
      ) VALUES (
        gen_random_uuid(), ${user.id}, ${preferencesData.meetingTypes.friendly}, ${preferencesData.meetingTypes.romantic}, ${preferencesData.meetingTypes.playful}, ${preferencesData.meetingTypes.open_curtains}, ${preferencesData.meetingTypes.libertine}, ${preferencesData.meetingTypes.open_to_other_couples}, ${preferencesData.meetingTypes.specific_preferences}
      )
    `
  }

  // Update or insert user_additional_options
  const existingAdditionalOptions = await sql`
    SELECT * FROM user_additional_options WHERE user_id = ${user.id}
  `

  if (existingAdditionalOptions.length > 0) {
    await sql`
      UPDATE user_additional_options
      SET
        join_exclusive_events = ${preferencesData.additionalOptions.join_exclusive_events},
        premium_access = ${preferencesData.additionalOptions.premium_access}
      WHERE user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO user_additional_options (
        id, user_id, join_exclusive_events, premium_access
      ) VALUES (
        gen_random_uuid(), ${user.id}, ${preferencesData.additionalOptions.join_exclusive_events}, ${preferencesData.additionalOptions.premium_access}
      )
    `
  }
}

export default async function ProfilePage () {
  const session = await getServerSession(authOptions)
  const sessionUser = session?.user // Renamed to avoid conflict
  if (!sessionUser) {
    redirect('/login')
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '')

  // Fetch the latest user data directly from the database
  const dbUserResult = await sql`
    SELECT id, name, email, avatar
    FROM users
    WHERE id = ${sessionUser.id}
  `
  const dbUser = dbUserResult.length > 0 ? dbUserResult[0] : null

  if (!dbUser) {
    // This case should ideally not happen if the user has a valid session
    console.error('User from session not found in database for profile page.')
    redirect('/login') // Or an error page
    return null // Return null to stop execution if redirecting
  }

  // Get user profile data from user_profiles table
  const profiles = await sql`
    SELECT up.*
    FROM user_profiles up
    WHERE up.user_id = ${dbUser.id} -- Use dbUser.id for consistency
  `

  const profile = profiles.length > 0 ? profiles[0] : {}

  let formattedBirthday = ''
  if (profile.birthday) {
    try {
      // Assuming profile.birthday might be a Date object or an ISO string like YYYY-MM-DDTHH:mm:ss.sssZ
      const date = new Date(profile.birthday)
      if (!isNaN(date.getTime())) {
        // Check if date is valid
        formattedBirthday = date.toISOString().split('T')[0]
      } else if (
        typeof profile.birthday === 'string' &&
        profile.birthday.match(/^\d{4}-\d{2}-\d{2}$/)
      ) {
        // If it's already a YYYY-MM-DD string from the DB (less common for DATE type, but possible)
        formattedBirthday = profile.birthday
      }
    } catch (error) {
      console.error('Error formatting birthday for display:', error)
      // Keep formattedBirthday as "" or handle error appropriately
    }
  }

  // Helper to ensure all fields are present
  function normalizePreferences (obj) {
    return {
      interested_in_restaurant: obj?.interested_in_restaurant ?? false,
      interested_in_events: obj?.interested_in_events ?? false,
      interested_in_dating: obj?.interested_in_dating ?? false,
      prefer_curtain_open: obj?.prefer_curtain_open ?? false,
      interested_in_lolib: obj?.interested_in_lolib ?? false,
      suggestions: obj?.suggestions ?? ''
    }
  }
  function normalizeMeetingTypes (obj) {
    return {
      friendly: obj?.friendly ?? false,
      romantic: obj?.romantic ?? false,
      playful: obj?.playful ?? false,
      open_curtains: obj?.open_curtains ?? false,
      libertine: obj?.libertine ?? false,
      open_to_other_couples: obj?.open_to_other_couples ?? false,
      specific_preferences: obj?.specific_preferences ?? ''
    }
  }
  function normalizeAdditionalOptions (obj) {
    return {
      join_exclusive_events: obj?.join_exclusive_events ?? false,
      premium_access: obj?.premium_access ?? false
    }
  }

  const userData = {
    id: dbUser.id, // Use id from dbUser
    name: dbUser.name, // Use name from dbUser
    email: dbUser.email, // Use email from dbUser
    avatar: dbUser.avatar, // CRITICAL: Use avatar from dbUser
    bio: profile.bio,
    age: profile.age,
    location: profile.location,
    orientation: profile.orientation,
    gender: profile.gender,
    birthday: formattedBirthday, // Use the formatted birthday string
    interests:
      typeof profile.interests === 'string'
        ? JSON.parse(profile.interests)
        : profile.interests || []
  }

  // Fetch user preferences
  const preferencesResult = await sql`
    SELECT * FROM user_preferences WHERE user_id = ${dbUser.id}
  `
  const preferences = normalizePreferences(
    preferencesResult.length > 0 ? preferencesResult[0] : {}
  )

  // Fetch user meeting types
  const meetingTypesResult = await sql`
    SELECT * FROM user_meeting_types WHERE user_id = ${dbUser.id}
  `
  const meetingTypes = normalizeMeetingTypes(
    meetingTypesResult.length > 0 ? meetingTypesResult[0] : {}
  )

  // Fetch user additional options
  const additionalOptionsResult = await sql`
    SELECT * FROM user_additional_options WHERE user_id = ${dbUser.id}
  `
  const additionalOptions = normalizeAdditionalOptions(
    additionalOptionsResult.length > 0 ? additionalOptionsResult[0] : {}
  )

  return (
    <MainLayout user={dbUser}>
      <div className='container max-w-screen-xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Mon Profil</h1>
        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='profile'>Profil</TabsTrigger>
            <TabsTrigger value='preferences'>Préférences</TabsTrigger>
          </TabsList>
          <TabsContent value='profile'>
            <div className='space-y-6'>
              <UserProfileEditor
                user={userData}
                onSave={updateUserProfile}
                onUploadImage={uploadProfileImage}
              />
            </div>
          </TabsContent>
          <TabsContent value='preferences'>
            <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
              <h3 className='text-lg font-medium'>Préférences de rencontre</h3>
              {/* PreferencesEditor will handle the form for preferences and meeting types */}
              <PreferencesEditor
                preferences={preferences}
                meetingTypes={meetingTypes}
                additionalOptions={additionalOptions}
                onSave={updateUserPreferences}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className='mt-8 text-center'>
        <a
          href='/unsubscribe'
          className='text-red-600 underline hover:text-red-800'
        >
          Se désinscrire / Supprimer mon compte
        </a>
      </div>
    </MainLayout>
  )
}

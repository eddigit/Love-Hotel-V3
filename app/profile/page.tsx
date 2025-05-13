import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import MainLayout from "@/ui/src/layout/MainLayout"
import { neon } from "@neondatabase/serverless"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { ok } from "assert"

export const metadata: Metadata = {
  title: "Profil | Love Hotel Rencontre",
  description: "Gérez votre profil Love Hotel Rencontre",
}

// Add this server action for handling profile image uploads
async function uploadProfileImage(formData: FormData) {
  "use server"

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const file = formData.get("profileImage") as File

  if (!file || file.size === 0) {
    return { error: "Aucun fichier sélectionné" }
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`user-photos/${user.id}-${Date.now()}.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    // Update the database with the new photo URL
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "")

    // Update the photo column in the users table
    await sql`
      UPDATE users
      SET avatar = ${blob.url}
      WHERE id = ${user.id}
    `

    revalidatePath("/profile")
    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { error: "Échec du téléchargement de l'image" }
  }
}

async function updateUserProfile(userData: any) {
  "use server"

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "")

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
        bio = ${userData.bio || null}
      WHERE user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO user_profiles (id, user_id, age, orientation, location, bio, status, featured)
      VALUES (gen_random_uuid(), ${user.id}, ${userData.age || null}, ${userData.orientation || null}, ${userData.location || null}, ${userData.bio || null}, 'active', false)
    `
  }
}

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || "")

  // Get user profile data
  const profiles = await sql`
    SELECT up.* 
    FROM user_profiles up
    WHERE up.user_id = ${user.id}
  `

  const profile = profiles.length > 0 ? profiles[0] : {}

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: profile.bio,
    age: profile.age,
    location: profile.location,
    orientation: profile.orientation,
  }

  return (
    <MainLayout>
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Photo de profil</h3>

                <div className="flex items-center space-x-6 mb-4">
                  {user.avatar && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!user.avatar && (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-500">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </div>

                <form action={uploadProfileImage} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <label htmlFor="profileImage" className="text-sm font-medium">
                      Télécharger une nouvelle photo de profil
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Enregistrer la photo
                  </button>
                </form>
              </div>

              <UserProfileEditor user={userData} onSave={updateUserProfile} />
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-medium">Préférences de rencontre</h3>
              <p className="text-sm text-muted-foreground mt-2">Cette section sera bientôt disponible.</p>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-medium">Sécurité du compte</h3>
              <p className="text-sm text-muted-foreground mt-2">Cette section sera bientôt disponible.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}




const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!message.trim()) return

  // 1) POST vers l’API
  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId: params.id,
      content: message,
      senderId: /* ton userId depuis le contexte */,
    }),
  })

  // 2) remettre à zéro l’input
  setMessage('')

Je ne sais pas s'il faut coder tout ce que je sais c'est qu'il a aujourd'hui y a l'applicatio

tu peux me donner un Island_Moments, je vais regarder ce qui est deja fait et ce qu'il reste a faire ok
dis moi juste ce que tu veux de fonctionnel

login register preferences c est ok
tu veux => pouvoir avoir son profil et ses infos 
            envoyer des messages
            participer à des evenements
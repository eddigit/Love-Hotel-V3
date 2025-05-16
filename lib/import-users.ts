import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { executeQuery } from './db';
import { download_old_avatar_store_it_and_return_its_new_url } from './utils';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define types for profiles and preferences
interface Profile {
  user_id: string;
  full_name?: string;
  status?: string;
  sexual_orientation?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  age?: number; // Added age field
}

interface Preference {
  user_id: string;
  interests?: string;
  speed_dating_interest?: boolean;
  open_curtains_interest?: boolean;
  libertine_party_interest?: boolean;
}

// Add detailed logging in test mode
const log = (message: string, data?: any) => {
  if (isTestMode) {
    console.log(message, data);
  }
};

async function importUsers(testMode = false) {
  // Determine the source file based on test mode
  const usersFileName = testMode ? 'auth.users.test.json' : 'auth.users.json';
  const usersPath = path.join(__dirname, `../docs/${usersFileName}`);
  const profilesPath = path.join(__dirname, '../docs/profiles.json');
  const preferencesPath = path.join(__dirname, '../docs/preferences.json');

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const profiles: Profile[] = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
  const preferences: Preference[] = JSON.parse(fs.readFileSync(preferencesPath, 'utf8'));

  for (const supabaseUser of users) {
    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT * FROM users WHERE email = $1',
      [supabaseUser.email]
    );
    if (existingUser.length > 0) continue;

    // Find related profile and preferences
    const supabaseProfile = profiles.find((p: Profile) => p.user_id === supabaseUser.id);
    const supabasePreferences = preferences.find((p: Preference) => p.user_id === supabaseUser.id);

    // Log SQL query and parameters
    log('Executing SQL query:', {
      query: `INSERT INTO users (id, email, password_hash, name, role, avatar, onboarding_completed)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      params: [
        supabaseUser.id,
        supabaseUser.email,
        supabaseUser.encrypted_password,
        supabaseProfile?.full_name || null,
        'user',
        await download_old_avatar_store_it_and_return_its_new_url(supabaseProfile?.avatar_url ?? null),
        true,
      ],
    });

    // Log result of user creation
    const userResult = await executeQuery(
      `INSERT INTO users (id, email, password_hash, name, role, avatar, onboarding_completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        supabaseUser.id,
        supabaseUser.email,
        supabaseUser.encrypted_password,
        supabaseProfile?.full_name || null,
        'user',
        await download_old_avatar_store_it_and_return_its_new_url(supabaseProfile?.avatar_url ?? null),
        true,
      ]
    );
    log('User creation result:', userResult);

    // Log other table insertions
    log('Inserting into user_profiles:', {
      user_id: supabaseUser.id,
      status: supabaseProfile?.status || null,
      orientation: supabaseProfile?.sexual_orientation || null,
      location: supabaseProfile?.location || null,
      bio: supabaseProfile?.bio || null,
      gender: supabaseProfile?.status || null,
      age: supabaseProfile?.age || null, // Added age field
      interests: supabasePreferences?.interests || null,
    });

    await executeQuery(
      `INSERT INTO user_profiles (user_id, status, orientation, location, bio, gender, age, interests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        supabaseUser.id,
        supabaseProfile?.status || null,
        supabaseProfile?.sexual_orientation || null,
        supabaseProfile?.location || null,
        supabaseProfile?.bio || null,
        supabaseProfile?.status || null,
        supabaseProfile?.age || null, // Added age field
        supabasePreferences?.interests || null,
      ]
    );

    log('Inserting into user_preferences:', {
      user_id: supabaseUser.id,
      interested_in_dating: supabasePreferences?.speed_dating_interest || false,
      prefer_curtain_open: supabasePreferences?.open_curtains_interest || false,
    });

    await executeQuery(
      `INSERT INTO user_preferences (user_id, interested_in_dating, prefer_curtain_open)
       VALUES ($1, $2, $3)`,
      [
        supabaseUser.id,
        supabasePreferences?.speed_dating_interest || false,
        supabasePreferences?.open_curtains_interest || false,
      ]
    );

    log('Inserting into user_meeting_types:', {
      user_id: supabaseUser.id,
      open_curtains: supabasePreferences?.open_curtains_interest || false,
    });

    await executeQuery(
      `INSERT INTO user_meeting_types (user_id, open_curtains)
       VALUES ($1, $2)`,
      [
        supabaseUser.id,
        supabasePreferences?.open_curtains_interest || false,
      ]
    );

    log('Inserting into user_additional_options:', {
      user_id: supabaseUser.id,
      join_exclusive_events: supabasePreferences?.libertine_party_interest || false,
    });

    await executeQuery(
      `INSERT INTO user_additional_options (user_id, join_exclusive_events)
       VALUES ($1, $2)`,
      [
        supabaseUser.id,
        supabasePreferences?.libertine_party_interest || false,
      ]
    );
  }

  console.log(`User import completed successfully in ${testMode ? 'test' : 'full'} mode.`);
}

// Run the script in test mode or full mode based on an environment variable or argument
const isTestMode = process.argv.includes('--test');
importUsers(isTestMode).catch(error => {
  console.error('Error importing users:', error);
});

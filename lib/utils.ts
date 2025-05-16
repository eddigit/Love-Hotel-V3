import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { put } from '@vercel/blob';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Downloads an avatar from the old URL, stores it in the new storage, and returns the new URL.
 * If the download or storage fails, it returns the old URL or null if invalid.
 *
 * @param oldUrl - The URL of the old avatar.
 * @returns The new URL of the stored avatar, the old URL on failure, or null if invalid.
 */
export async function download_old_avatar_store_it_and_return_its_new_url(oldUrl: string | null): Promise<string | null> {
  // Handle empty or invalid URLs
  if (!oldUrl || !oldUrl.trim() || !oldUrl.startsWith('http')) {
    return null;
  }

  try {
    // Download image from old storage using native fetch
    const response = await fetch(oldUrl);
    if (!response.ok) {
      console.warn(`Failed to download avatar from ${oldUrl}: ${response.status}`);
      return oldUrl; // Return original URL on failure
    }

    // Get file data and extension
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const fileExtension = oldUrl.split('.').pop()?.split('?')[0] || 'jpg';
    const contentType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

    // Upload to Vercel Blob
    const fileName = `user-avatar-${Date.now()}.${fileExtension}`;
    const { url } = await put(fileName, imageBuffer, {
      contentType,
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return url;
  } catch (error) {
    console.error(`Error processing avatar ${oldUrl}:`, error);
    return oldUrl; // Return original URL on failure
  }
}

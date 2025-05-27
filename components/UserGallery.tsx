'use client'
import React, { useEffect, useState } from 'react'

interface UserPhoto {
  id: string
  url: string
  is_primary: boolean
}

export function UserGallery ({ userId }: { userId: string }) {
  const [photos, setPhotos] = useState<UserPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos () {
      setLoading(true)
      const res = await fetch(`/api/photos/list?userId=${userId}`)
      const data = await res.json()
      setPhotos(data.photos || [])
      setLoading(false)
    }
    fetchPhotos()
  }, [userId])

  if (loading) return <div>Chargement de la galerie...</div>
  if (!photos.length) return <div>Aucune photo dans la galerie.</div>

  return (
    <div className='flex flex-wrap gap-4'>
      {photos.map(photo => (
        <div
          key={photo.id}
          className='w-32 h-32 border rounded overflow-hidden'
        >
          <img
            src={photo.url}
            alt='Photo galerie utilisateur'
            className='object-cover w-full h-full'
          />
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MapPin, Calendar, Heart, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'

interface ParticipantProfilePopupProps {
  participant: {
    id: string
    name: string
    avatar: string
    joined_at: string
  }
  children: React.ReactNode
}

interface UserProfile {
  id: string
  name: string
  avatar: string
  bio?: string
  age?: number
  location?: string
  orientation?: string
  gender?: string
  interests?: string[]
}

export function ParticipantProfilePopup({ participant, children }: ParticipantProfilePopupProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchProfile = async () => {
    if (profile || loading) return // Ne pas refetch si déjà chargé

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${participant.id}/profile`)
      if (response.ok) {
        const data = await response.json()
        setProfile({
          id: data.user_id || participant.id,
          name: data.name || participant.name,
          avatar: data.avatar || participant.avatar,
          bio: data.bio,
          age: data.age,
          location: data.location,
          orientation: data.orientation,
          gender: data.gender,
          interests: typeof data.interests === 'string' 
            ? JSON.parse(data.interests || '[]') 
            : data.interests || []
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && !profile && !loading) {
      fetchProfile()
    }
  }

  const formatAge = (age: number) => {
    return age ? `${age} ans` : ''
  }

  const getGenderIcon = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'homme':
      case 'male':
        return '♂'
      case 'femme':
      case 'female':
        return '♀'
      default:
        return '●'
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="start">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.avatar || participant.avatar} />
                <AvatarFallback>
                  {(profile?.name || participant.name).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {profile?.name || participant.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  {profile?.age && (
                    <span>{formatAge(profile.age)}</span>
                  )}
                  {profile?.gender && (
                    <span className="flex items-center gap-1">
                      <span>{getGenderIcon(profile.gender)}</span>
                      {profile.gender}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Chargement du profil...</p>
              </div>
            ) : profile ? (
              <>
                {/* Bio */}
                {profile.bio && (
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {profile.bio.length > 100 
                        ? `${profile.bio.substring(0, 100)}...` 
                        : profile.bio
                      }
                    </p>
                  </div>
                )}

                {/* Localisation */}
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {/* Orientation */}
                {profile.orientation && (
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span>{profile.orientation}</span>
                  </div>
                )}

                {/* Intérêts */}
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Intérêts</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.slice(0, 4).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.interests.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Date d'inscription à l'événement */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Inscrit le {new Date(participant.joined_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/profile/${profile.id}`}>
                      <User className="w-4 h-4 mr-1" />
                      Voir profil
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/messages?user=${profile.id}`}>
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Impossible de charger le profil</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

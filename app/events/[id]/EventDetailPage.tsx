'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import MainLayout from '@/components/layout/main-layout'
import { ParticipantProfilePopup } from '@/components/participant-profile-popup'

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  price: number
  payment_mode: 'sur_place' | 'online'
  conditions: string
  max_participants: number
  participant_count: number
  image: string
  category: string
  creator_name: string
  participants: Array<{
    id: string
    name: string
    avatar: string
    joined_at: string
  }>
}

interface EventDetailPageProps {
  event: Event
}

export default function EventDetailPage({ event }: EventDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isParticipating, setIsParticipating] = useState(false)
  const [participantCount, setParticipantCount] = useState(event.participant_count)
  const [loading, setLoading] = useState(false)

  // Vérifier si l'utilisateur participe déjà
  useEffect(() => {
    if (user && event.participants) {
      const participating = event.participants.some(p => p.id === user.id)
      setIsParticipating(participating)
    }
  }, [user, event.participants])

  // Rediriger si non connecté
  useEffect(() => {
    if (!user?.id) {
      router.replace('/login')
      return
    }
  }, [user, router])

  const handleParticipation = async () => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour participer",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/events/${event.id}/participate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          action: isParticipating ? 'leave' : 'join'
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setIsParticipating(!isParticipating)
        setParticipantCount(prev => isParticipating ? prev - 1 : prev + 1)
        
        toast({
          title: "Succès",
          description: result.message,
          variant: "default"
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Erreur lors de la participation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description?.substring(0, 100) + '...',
          url: window.location.href
        })
      } catch (error) {
        // L'utilisateur a annulé le partage
      }
    } else {
      // Fallback : copier l'URL
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Lien copié",
        description: "Le lien de l'événement a été copié dans le presse-papiers"
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isEventFull = participantCount >= event.max_participants
  const isEventPast = new Date(event.event_date) < new Date()

  if (!user) {
    return null // Évite le flash avant la redirection
  }
  return (
    <MainLayout user={user}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link href="/events">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux événements
            </Button>
          </Link>
        </div>

        {/* Image de l'événement */}
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img 
            src={event.image || '/placeholder-event.jpg'} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Actions flottantes */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Badge catégorie */}
          {event.category && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-black">
                {event.category}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et informations principales */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{formatTime(event.event_time)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{participantCount}/{event.max_participants} participants</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">À propos de cet événement</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>            </div>

            <Separator />

            {/* Conditions */}
            {event.conditions && (
              <>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Conditions et informations importantes</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {event.conditions}
                    </p>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Organisateur */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Organisé par</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {event.creator_name?.charAt(0).toUpperCase() || 'LH'}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{event.creator_name || 'Love Hotel'}</span>
              </div>
            </div>
          </div>
          
          {/* Sidebar avec participation */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Participation
                  {isEventPast && (
                    <Badge variant="secondary">Terminé</Badge>
                  )}
                </CardTitle>
              </CardHeader>              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{event.price}€</div>
                  <div className="text-sm text-gray-500">par personne</div>
                  <div className="text-xs text-gray-400">
                    Paiement {event.payment_mode === 'sur_place' ? 'sur place' : 'en ligne'}
                  </div>
                </div>
                
                <Button 
                  onClick={handleParticipation}
                  className="w-full"
                  variant={isParticipating ? "outline" : "default"}
                  disabled={loading || isEventPast || (isEventFull && !isParticipating)}
                  size="lg"
                >
                  {loading ? (
                    "Chargement..."
                  ) : isEventPast ? (
                    "Événement terminé"
                  ) : isParticipating ? (
                    "Ne plus participer"
                  ) : isEventFull ? (
                    "Complet"
                  ) : (
                    "Participer"
                  )}
                </Button>
                
                {isEventFull && !isParticipating && !isEventPast && (
                  <Badge variant="destructive" className="w-full justify-center">
                    Événement complet
                  </Badge>
                )}

                {isParticipating && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    ✓ Vous participez à cet événement
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Liste des participants */}
            {event.participants && event.participants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Participants ({participantCount})</CardTitle>
                </CardHeader>                <CardContent>
                  <div className="space-y-3">
                    {event.participants.slice(0, 10).map((participant) => (
                      <ParticipantProfilePopup key={participant.id} participant={participant}>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate hover:text-primary transition-colors">
                              {participant.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Inscrit le {new Date(participant.joined_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </ParticipantProfilePopup>
                    ))}
                    {event.participants.length > 10 && (
                      <div className="text-sm text-gray-500 text-center">
                        et {event.participants.length - 10} autres participants...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

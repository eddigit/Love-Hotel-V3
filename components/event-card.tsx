import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface EventCardProps {
  title: string
  location: string
  date: string
  image: string
  attendees: number
  prix_personne_seule?: number
  prix_couple?: number
  price?: number
  isParticipating?: boolean
  onSubscribeToggle?: () => void
  id?: string
  creatorId?: string
  currentUserId?: string
  isAdmin?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function EventCard ({
  title,
  location,
  date,
  image,
  attendees,
  prix_personne_seule,
  prix_couple,
  price,
  isParticipating,
  onSubscribeToggle,
  id,
  creatorId,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete
}: EventCardProps) {
  const canEdit =
    isAdmin || (creatorId && currentUserId && creatorId === currentUserId)
  return (
    <Card className='overflow-hidden card-hover border-0 shadow-lg shadow-purple-900/20'>
      <div className='relative h-48 sm:h-56'>
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#1a0d2e] via-[#3d1155]/50 to-transparent flex items-end p-4'>
          <div className='text-white'>
            <h3 className='font-bold text-lg line-clamp-1'>{title}</h3>
            <div className='flex items-center gap-1 text-sm'>
              <MapPin className='h-3 w-3 flex-shrink-0' />
              <span className='line-clamp-1'>{location}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className='p-4 space-y-4 bg-gradient-to-br from-[#2d1155]/90 to-[#3d1155]/80'>
        <div className='flex items-center justify-between flex-wrap gap-y-2'>
          <div className='flex items-center gap-1 text-sm text-gray-300'>
            <Calendar className='h-3 w-3 flex-shrink-0' />
            <span>{date}</span>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-300'>
            <Users className='h-3 w-3 flex-shrink-0' />
            <span>{attendees} participants</span>
          </div>
        </div>
        {(prix_personne_seule > 0 || prix_couple > 0) && (
          <div className='flex flex-col gap-1 text-pink-300 font-semibold'>
            {prix_personne_seule > 0 && <span>Pers. seule : {prix_personne_seule}€</span>}
            {prix_couple > 0 && <span>Couple : {prix_couple}€</span>}
          </div>
        )}
        {((!prix_personne_seule || prix_personne_seule === 0) && (!prix_couple || prix_couple === 0) && price) && (
          <div className='text-pink-300 font-semibold'>{price}€</div>
        )}
        <Button
          className={`w-full bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90`}
          variant={isParticipating ? 'secondary' : 'default'}
          onClick={onSubscribeToggle}
        >
          {isParticipating ? 'Se désinscrire' : 'Participer'}
        </Button>
        
        {/* Bouton pour voir les détails */}
        <Link href={`/events/${id}`}>
          <Button variant="outline" className="w-full mt-2">
            Voir les détails
          </Button>
        </Link>
        {canEdit && (
          <div className='flex gap-2 mt-2'>
            <Button
              size='sm'
              variant='outline'
              className='w-full'
              onClick={onEdit}
            >
              Modifier
            </Button>
            {onDelete && (
              <Button
                size='sm'
                variant='destructive'
                className='w-full'
                onClick={onDelete}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

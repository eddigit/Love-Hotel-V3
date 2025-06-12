import { notFound } from 'next/navigation'
import EventDetailPage from '@/app/events/[id]/EventDetailPage'
import { getEventById } from '@/actions/event-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetail({ params }: PageProps) {
  const { id } = await params
  console.log('Récupération de l\'événement avec ID:', id)
  
  try {
    const event = await getEventById(id) as any
    
    if (!event) {
      console.log('Événement non trouvé pour ID:', id)
      notFound()
    }
    
    console.log('Événement trouvé:', event.title)
    return <EventDetailPage event={event} />
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  
  try {
    const event = await getEventById(id) as any
    
    if (!event) {
      return {
        title: 'Événement non trouvé'
      }
    }
    
    return {
      title: `${event.title} - Love Hotel`,
      description: event.description?.substring(0, 160) || 'Découvrez cet événement exclusif chez Love Hotel'
    }
  } catch (error) {
    return {
      title: 'Événement non trouvé'
    }
  }
}

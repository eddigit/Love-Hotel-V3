'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MobileNavigation } from '@/components/mobile-navigation'
import { useNotifications } from '@/contexts/notification-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EventCard } from '@/components/event-card'
import MainLayout from '@/components/layout/main-layout'
import {
  getUpcomingEvents,
  subscribeToEvent,
  unsubscribeFromEvent,
  deleteEvent
} from '@/actions/event-actions'
import { getOption } from '@/actions/user-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EventsPage () {
  const { markAsRead } = useNotifications()
  const { user: authUser } = useAuth()
  const router = useRouter()

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([])
  const [activeTab, setActiveTab] = useState('all')

  // Compute the correct Tailwind grid-cols class for the TabsList
  const gridColsClass =
    {
      1: 'grid-cols-2',
      2: 'grid-cols-3',
      3: 'grid-cols-4',
      4: 'grid-cols-5',
      5: 'grid-cols-6',
      6: 'grid-cols-7',
      7: 'grid-cols-8',
      8: 'grid-cols-9',
      9: 'grid-cols-10'
    }[categories.length + 1] || 'grid-cols-2'

  // Redirect if not logged in
  useEffect(() => {
    if (!authUser?.id) {
      router.replace('/login')
      return
    }

    async function fetchEventsAndCategories () {
      if (!authUser?.id) return
      setLoading(true)
      const [result, rawCategories] = await Promise.all([
        getUpcomingEvents(authUser.id),
        getOption('event_categories')
      ])
      setEvents(result)
      const lines = (
        rawCategories ||
        'speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant'
      ).split('\n')
      setCategories(
        lines
          .map((line: string) => line.trim())
          .filter(Boolean)
          .map((line: string) => {
            const [value, label] = line.split('|')
            return value && label
              ? { value: value.trim(), label: label.trim() }
              : null
          })
          .filter(Boolean) as { value: string; label: string }[]
      )
      setLoading(false)
    }

    fetchEventsAndCategories()

    const eventNotifications: string[] = [
      // Only push real notification UUIDs here if available
    ]
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    eventNotifications.forEach((id: string) => {
      if (uuidRegex.test(id)) markAsRead(id)
    })
  }, [markAsRead, authUser, router])

  const handleSubscribeToggle = async (event: any) => {
    if (!authUser?.id) return
    if (event.is_participating) {
      await unsubscribeFromEvent(event.id, authUser.id)
      setEvents(
        events.map(e =>
          e.id === event.id
            ? { ...e, is_participating: false, attendees: e.attendees - 1 }
            : e
        )
      )
    } else {
      await subscribeToEvent(event.id, authUser.id)
      setEvents(
        events.map(e =>
          e.id === event.id
            ? { ...e, is_participating: true, attendees: e.attendees + 1 }
            : e
        )
      )
    }
  }

  const handleEdit = (eventId: string) => {
    router.push(`/events/edit?id=${eventId}`)
  }
  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Supprimer cet événement ?')) return
    await deleteEvent(eventId)
    setEvents(events.filter(e => e.id !== eventId))
  }

  return (
    <MainLayout user={authUser}>
      <div className='min-h-screen flex flex-col pb-16 md:pb-0'>
        <div className='container py-4 md:py-6 flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold mb-4 md:mb-6'>
            Événements
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className={`grid w-full ${gridColsClass} mb-4 md:mb-6`}>
              <TabsTrigger value='all'>Tous</TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
              <TabsTrigger value='planning-rideaux-ouverts'>Agenda Rideaux ouverts</TabsTrigger>
            </TabsList>
            <TabsContent value='all' className='space-y-4 md:space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {loading ? (
                  <div>Chargement...</div>
                ) : (
                  events.map(event => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      location={event.location}
                      date={
                        event.event_date
                          ? typeof event.event_date === 'string'
                            ? event.event_date
                            : new Date(event.event_date).toLocaleString('fr-FR')
                          : ''
                      }
                      image={event.image}
                      attendees={
                        event.attendees || event.participant_count || 0
                      }
                      isParticipating={!!event.is_participating}
                      onSubscribeToggle={() => handleSubscribeToggle(event)}
                      creatorId={event.creator_id}
                      currentUserId={authUser?.id}
                      isAdmin={authUser?.role === 'admin'}
                      onEdit={() => handleEdit(event.id)}
                      onDelete={
                        authUser?.role === 'admin' ||
                        event.creator_id === authUser?.id
                          ? () => handleDelete(event.id)
                          : undefined
                      }
                    />
                  ))
                )}
              </div>
            </TabsContent>
            {categories.map(cat => (
              <TabsContent
                key={cat.value}
                value={cat.value}
                className='space-y-4 md:space-y-6'
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {loading ? (
                    <div>Chargement...</div>
                  ) : (
                    events
                      .filter(event => event.category === cat.value)
                      .map(event => (
                        <EventCard
                          key={event.id}
                          id={event.id}
                          title={event.title}
                          location={event.location}
                          date={
                            event.event_date
                              ? typeof event.event_date === 'string'
                                ? event.event_date
                                : new Date(event.event_date).toLocaleString(
                                    'fr-FR'
                                  )
                              : ''
                          }
                          image={event.image}
                          attendees={
                            event.attendees || event.participant_count || 0
                          }
                          isParticipating={!!event.is_participating}
                          onSubscribeToggle={() => handleSubscribeToggle(event)}
                          creatorId={event.creator_id}
                          currentUserId={authUser?.id}
                          isAdmin={authUser?.role === 'admin'}
                          onEdit={() => handleEdit(event.id)}
                          onDelete={
                            authUser?.role === 'admin' ||
                            event.creator_id === authUser?.id
                              ? () => handleDelete(event.id)
                              : undefined
                          }
                        />
                      ))
                  )}
                </div>
              </TabsContent>
            ))}
            <TabsContent
              value='planning-rideaux-ouverts'
              className='space-y-4 md:space-y-6'
            >
              <div className='grid grid-cols-1'>
                <iframe
                  src='https://lovehotelaparis.fr/wp-json/zlhu_api/v3/rideaux_ouverts/'
                  title='Rideaux Ouverts'
                  className='w-full h-[1600px] border-0'
                  frameBorder='0'
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className='fixed bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none z-40'>
          <Link href='/events/new' className='pointer-events-auto'>
            <Button className='bg-[#ff3b8b] hover:bg-[#ff3b8b]/90 text-white rounded-full px-8 py-3 shadow-lg text-lg font-bold'>
              Créer un évènement
            </Button>
          </Link>
        </div>
        <MobileNavigation />
      </div>
    </MainLayout>
  )
}

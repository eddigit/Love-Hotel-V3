'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MobileNavigation } from '@/components/mobile-navigation'
import { useNotifications } from '@/contexts/notification-context'
import { useEffect, useState } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { getUserConversations } from '@/actions/conversation-actions'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

// Define a type for our conversation data for better type safety
interface Conversation {
  id: string
  other_user_name: string
  last_message: string | null
  last_message_date: string | null
  other_user_avatar: string | null
}

export default function MessagesPage () {
  const { user: authUser } = useAuth()
  const router = useRouter()
  const { data: session } = useSession()
  const { markAsRead } = useNotifications()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  if (!authUser?.id) {
    if (typeof window !== 'undefined') {
      router.replace('/login')
    }
    return null
  }

  useEffect(() => {
    async function fetchConversations () {
      if (session?.user?.id) {
        try {
          setLoading(true)
          const fetchedConversations = await getUserConversations(
            session.user.id
          )
          const mappedConversations = fetchedConversations.map(conv => ({
            id: conv.id,
            other_user_name: conv.other_user_name,
            last_message: conv.last_message,
            last_message_date: conv.last_message_date
              ? formatMessageDate(new Date(conv.last_message_date))
              : '',
            other_user_avatar: conv.other_user_avatar
          }))
          setConversations(mappedConversations as Conversation[])
        } catch (error) {
          console.error('Failed to fetch conversations:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (session) {
      fetchConversations()
    }
  }, [session, markAsRead])

  // Format dates in a user-friendly way
  function formatMessageDate (date: Date): string {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const twoDaysAgo = new Date(today)
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const timeString = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    if (date >= today) {
      // Today: just show the time
      return timeString
    } else if (date >= yesterday) {
      // Yesterday: show "Hier à HH:MM"
      return `Hier à ${timeString}`
    } else if (date >= twoDaysAgo) {
      // Two days ago: show "Avant-hier à HH:MM"
      return `Avant-hier à ${timeString}`
    } else {
      // Calculate difference in days, months, and years
      const daysDiff = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      )
      const monthsDiff =
        (today.getFullYear() - date.getFullYear()) * 12 +
        today.getMonth() -
        date.getMonth()
      const yearsDiff = today.getFullYear() - date.getFullYear()

      if (yearsDiff >= 1) {
        // More than a year ago: "Il y a # ans"
        return yearsDiff === 1 ? `Il y a 1 an` : `Il y a ${yearsDiff} ans`
      } else if (monthsDiff >= 1) {
        // More than a month ago: "Il y a # mois"
        return monthsDiff === 1 ? `Il y a 1 mois` : `Il y a ${monthsDiff} mois`
      } else {
        // Less than a month ago: "Il y a # jours"
        return daysDiff === 1 ? `Il y a 1 jour` : `Il y a ${daysDiff} jours`
      }
    }
  }

  if (loading && !conversations.length) {
    return (
      <MainLayout user={authUser}>
        <div className='min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]'>
          <div className='container py-4 md:py-6 flex-1'>
            <h1 className='text-2xl md:text-3xl font-bold mb-4'>Messages</h1>
            <p>Loading conversations...</p>
          </div>
          <MobileNavigation />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout user={authUser}>
      <div className='min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]'>
        <div className='container py-4 md:py-6 flex-1'>
          <h1 className='text-2xl md:text-3xl font-bold mb-4'>Messages</h1>

          <div className='relative mb-4 md:mb-6'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Rechercher dans les messages'
              className='pl-10 bg-[#2d1155]/50 border-purple-800/30 focus:border-[#ff3b8b]'
            />
          </div>

          <div className='space-y-2'>
            {conversations.map(conversation => (
              <Link href={`/messages/${conversation.id}`} key={conversation.id}>
                <Card className='hover:bg-[#2d1155]/70 transition-colors card-hover border-0 bg-[#2d1155]/50 backdrop-blur-sm shadow-lg shadow-purple-900/20'>
                  <CardContent className='p-3 md:p-4 flex items-center gap-3 md:gap-4'>
                    <div className='relative flex-shrink-0'>
                      <Image
                        src={
                          conversation.other_user_avatar || '/placeholder.svg'
                        }
                        alt={conversation.other_user_name || 'User'}
                        width={50}
                        height={50}
                        className='rounded-full object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-semibold truncate'>
                          {conversation.other_user_name}
                        </h3>
                        <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>
                          {conversation.last_message_date}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm text-muted-foreground truncate'>
                          {conversation.last_message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}

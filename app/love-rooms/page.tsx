'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { MobileNavigation } from '@/components/mobile-navigation'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

// Ajouter l'import du widget de réservation en haut du fichier
import { LoveHotelBookingWidget } from '@/components/love-hotel-booking'

export default function LoveRoomsPage () {
  const [activeTab, setActiveTab] = useState('reserve')
  const { user: authUser } = useAuth()
  const router = useRouter()

  // Redirect if not logged in (move to useEffect)
  useEffect(() => {
    if (!authUser?.id) {
      router.replace('/login')
    }
  }, [authUser, router])

  if (!authUser?.id) {
    return null
  }

  return (
    <MainLayout user={authUser}>
      <div className='min-h-screen flex flex-col pb-16 md:pb-0'>
        <div className='container py-4 md:py-6 flex-1'>
          <div className='mb-4 md:mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold mb-2'>
              Escapades Love Hôtel
            </h1>
            <p className='text-muted-foreground text-sm md:text-base'>
              Réservez une Love Room pour un moment inoubliable dans l'un de nos
              établissements.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-4 md:mb-6'>
              <TabsTrigger value='reserve' className='text-xs sm:text-sm'>
                Réserver une Love-Room
              </TabsTrigger>
              <TabsTrigger
                value='my-reservations'
                className='text-xs sm:text-sm'
              >
                Conciergerie
              </TabsTrigger>
            </TabsList>

            {/* Remplacer le contenu de l'onglet "reserve" par le widget de réservation */}
            <TabsContent value='reserve'>
              <div className='p-4 md:p-6 bg-gradient-to-br from-[#2d1155]/70 to-[#3d1155]/50 backdrop-blur-sm rounded-lg shadow-lg shadow-purple-900/20 border border-purple-800/20'>
                <h3 className='text-xl font-bold mb-4'>
                  Réserver une Love Room
                </h3>
                <p className='text-muted-foreground mb-6'>
                  Utilisez notre système de réservation en ligne pour réserver
                  votre Love Room préférée. Sélectionnez la date, l'heure et la
                  durée de votre séjour.
                </p>
                <div className='bg-[#1a0d2e]/50 rounded-lg shadow-lg overflow-hidden'>
                  <LoveHotelBookingWidget />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='my-reservations'
              className='space-y-4 md:space-y-6'
            >
              <div className='text-center py-8 md:py-12'>
                <p className='text-lg font-semibold'>Bientôt disponible...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}

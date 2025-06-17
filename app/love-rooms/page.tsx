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
import ConciergerieForm from '@/components/ConciergerieForm'

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

          <div className="flex justify-center mb-6">
            <div className="flex flex-col md:flex-row items-center gap-2 px-6 py-4 rounded-xl bg-pink-600/90 shadow-lg">
              <span className="text-white text-lg md:text-xl font-semibold">
                Pour toute aide à la réservation ou informations complémentaires :
              </span>
              <a
                href="tel:+33144826305"
                className="text-white text-xl md:text-2xl font-bold underline ml-2"
                style={{ letterSpacing: '1px' }}
              >
                +33 1 44 82 63 05
              </a>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 mb-4 md:mb-6'>
              <TabsTrigger value='reserve' className='text-xs sm:text-sm'>
                Réserver une Love-Room
              </TabsTrigger>
              <TabsTrigger
                value='my-reservations'
                className='text-xs sm:text-sm'
              >
                Conciergerie
              </TabsTrigger>
              <TabsTrigger value='offers' className='text-xs sm:text-sm'>
                Nos Offres
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
              <ConciergerieForm />
            </TabsContent>
            <TabsContent value='offers'>
              <div className='p-4 md:p-6'>
                <h3 className='text-xl font-bold mb-4'>Nos Offres</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <img
                    src='https://lovehotelaparis.fr/wp-content/uploads/2025/01/petit-dejeuner-et-love-room-V2-1.webp'
                    alt='Petit-déjeuner & Love Room'
                    className='w-full h-auto rounded-lg'
                  />
                  <img
                    src='https://lovehotelaparis.fr/wp-content/uploads/2025/01/lunch-et-love-room-v2.jpg'
                    alt='Lunch & Love Room'
                    className='w-full h-auto rounded-lg'
                  />
                  <img
                    src='https://lovehotelaparis.fr/wp-content/uploads/2025/01/drink-et-love-room-v2-1.webp'
                    alt='Drink & Love Room'
                    className='w-full h-auto rounded-lg'
                  />
                  <img
                    src='https://lovehotelaparis.fr/wp-content/uploads/2025/01/eat-et-love-room-v2-1.webp'
                    alt='Eat & Love Room'
                    className='w-full h-auto rounded-lg'
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}

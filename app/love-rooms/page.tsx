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
  const [activeTab, setActiveTab] = useState('available')
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

  // Simuler des données de Love Rooms
  const loveRooms = [
    {
      id: 1,
      name: 'Suite Romantique',
      location: 'Love Hotel - Paris',
      price: 120,
      currency: '€',
      timeSlots: ['14:00 - 17:00', '18:00 - 21:00', '22:00 - 01:00'],
      image: '/purple-jacuzzi-retreat.png',
      features: ['Jacuzzi', 'Champagne', "Musique d'ambiance"],
      available: true
    },
    {
      id: 2,
      name: 'Love Room Deluxe',
      location: 'Love Hotel - Lyon',
      price: 150,
      currency: '€',
      timeSlots: ['15:00 - 18:00', '19:00 - 22:00', '23:00 - 02:00'],
      image: '/pink-jacuzzi-night.png',
      features: ['Lit king-size', 'Bar privé', 'Système audio'],
      available: true
    },
    {
      id: 3,
      name: 'Suite Passion',
      location: 'Love Hotel - Marseille',
      price: 180,
      currency: '€',
      timeSlots: ['14:00 - 17:00', '18:00 - 21:00', '22:00 - 01:00'],
      image: '/twilight-tryst.png',
      features: ['Jacuzzi', 'Champagne', 'Vue panoramique'],
      available: true
    }
  ]

  // Simuler des réservations
  const myReservations = [
    {
      id: 101,
      roomName: 'Suite Romantique',
      location: 'Love Hotel - Paris',
      date: '15 Mai 2025',
      timeSlot: '18:00 - 21:00',
      price: 120,
      currency: '€',
      image: '/purple-jacuzzi-retreat.png',
      status: 'confirmed'
    },
    {
      id: 102,
      roomName: 'Love Room Deluxe',
      location: 'Love Hotel - Lyon',
      date: '22 Mai 2025',
      timeSlot: '19:00 - 22:00',
      price: 150,
      currency: '€',
      image: '/pink-jacuzzi-night.png',
      status: 'pending'
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
            <TabsList className='grid w-full grid-cols-3 mb-4 md:mb-6'>
              <TabsTrigger value='available' className='text-xs sm:text-sm'>
                Nos offres
              </TabsTrigger>
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

            <TabsContent value='available' className='space-y-8'>
              <div className='space-y-12'>
                {/* Section: Jacuzzi à plusieurs & Champagne */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>
                      Jacuzzi à plusieurs & Champagne{' '}
                      <span className='text-yellow-400'>(réserve Premium)</span>
                    </h2>
                    <p className='text-lg'>
                      Une parenthèse luxueuse pour vos moments coquins à
                      plusieurs.
                    </p>
                    <ul className='list-disc pl-5 space-y-2'>
                      <li>
                        <span className='font-semibold'>
                          Expérience intime :
                        </span>{' '}
                        Jacuzzi privatif de 21h à 23h dans un cadre somptueux et
                        discret et accès aux Love Room
                      </li>
                      <li>
                        <span className='font-semibold'>
                          Délices pétillants :
                        </span>{' '}
                        Coupes de champagne incluses pour chaque participant
                      </li>
                      <li>
                        <span className='font-semibold'>
                          Ambiance sensorielle :
                        </span>{' '}
                        Musique lounge via enceintes Bose et éclairage tamisé
                        personnalisable
                      </li>
                      <li>
                        <span className='font-semibold'>
                          Confort intégral :
                        </span>{' '}
                        Espace lounge, serviettes moelleuses et accessoires
                        fournis
                      </li>
                      <li>
                        <span className='font-semibold'>
                          Format convivial :
                        </span>{' '}
                        Capacité de 4-6 personnes pour 2h d'expérience à
                        200€/personne
                      </li>
                    </ul>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/jacuzzi-champagne.avif'
                      alt='Jacuzzi à plusieurs & Champagne'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>

                {/* Section: Speed Dating Glamour Love Room */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>
                      Speed Dating Glamour Love Room
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <h3 className='font-semibold'>Concept Unique</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>
                            Rencontres rapides dans nos Love Rooms thématiques
                            exclusives
                          </li>
                          <li>
                            Chaque échange dure 5 minutes, puis rotation des
                            participants
                          </li>
                          <li>6 tours dans 6 Love Rooms différentes</li>
                          <li>Thèmes variés: glamour, safari, métro...</li>
                          <li>Atmosphère séduisante et décontractée</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Expérience Premium</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>Cocktail de bienvenue raffiné</li>
                          <li>Coaching flirt express personnalisé</li>
                          <li>Accès privilégié au bar privé après-session</li>
                          <li>Ambiance musicale soigneusement sélectionnée</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Détails Pratiques</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>12 hommes × 12 femmes (équilibre parfait)</li>
                          <li>Durée totale: 1h30</li>
                          <li>Tarif: 50€ par personne</li>
                          <li>Réservation en ligne simple et rapide</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/events-offers.avif'
                      alt='Speed Dating Glamour Love Room'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>

                {/* Section: Speed Dating Rideaux Ouverts */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>
                      Speed Dating Rideaux Ouverts
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <h3 className='font-semibold'>Concept Audacieux</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>
                            Rencontres intimes deux à deux dans nos chambres
                            communicantes avec rideaux ouverts
                          </li>
                          <li>
                            Une séduction visuelle qui intensifie chaque échange
                            en préservant votre intimité
                          </li>
                          <li>5 rencontres de 6 minutes en duo</li>
                          <li>Chambres luxueuses avec vue entre elles</li>
                          <li>Éclairage tamisé personnalisable</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className='font-semibold'>
                          Expérience Sensorielle
                        </h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>Playlist privée immersive</li>
                          <li>Verre de prosecco offert</li>
                          <li>Parfums d'ambiance exclusifs</li>
                          <li>
                            Espace lounge pour socialiser après les rencontres
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Détails Pratiques</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>8 couples participants</li>
                          <li>Hommes/femmes solos acceptés (tirage au sort)</li>
                          <li>Durée: 1h d'expérience intense</li>
                          <li>Tarif: 70€ par personne</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/weekend-glamour.avif'
                      alt='Speed Dating Rideaux Ouverts'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>

                {/* Section: Session Rideaux Ouverts */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>
                      Session Rideaux Ouverts
                    </h2>
                    <p className='text-lg'>
                      Une expérience intime exceptionnelle en chambres
                      communicantes avec visibilité préservée.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='border border-yellow-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>Concept Exclusif</h3>
                        <p>
                          Moment privilégié de "jeux et confidences" en duo. Une
                          Love Room communicante où le rideau reste libre.
                        </p>
                      </div>
                      <div className='border border-pink-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>
                          Expérience Sensorielle
                        </h3>
                        <p>
                          Coffret découverte érotique avec accessoires raffinés.
                          Playlist immersive personnalisable selon vos désirs.
                        </p>
                      </div>
                      <div className='border border-blue-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>Détails Pratiques</h3>
                        <p>
                          1 heure d'intimité partagée. Tarif: 120€ par couple.
                          Idéal pour couples établis ou nouvelles rencontres.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/session-rideaux.avif'
                      alt='Session Rideaux Ouverts'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>

                {/* Section: Soirée Coquine */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>Soirée Coquine</h2>
                    <p className='text-lg'>
                      Une escapade envoûtante conçue pour les couples en quête
                      d'expériences audacieuses.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                      <div>
                        <h3 className='font-semibold'>
                          Expérience Gastronomique
                        </h3>
                        <p>
                          Dîner aphrodisiaque trois plats dans notre restaurant
                          partenaire près de Châtelet. Ambiance intime et menu
                          spécialement conçu pour éveiller les sens.
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Moment Privilégié</h3>
                        <p>
                          Spectacle libertin privé en Love Room pendant 30
                          minutes exclusives. Une performance sensuelle réservée
                          uniquement à votre couple.
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Accès VIP</h3>
                        <p>
                          Entrée privilégiée en club libertin partenaire avec
                          coupe de champagne offerte. Espace réservé et accueil
                          personnalisé pour prolonger votre soirée.
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Détails Pratiques</h3>
                        <p>
                          Durée: 4-6 heures (18h-minuit). Tarif: 350€ par
                          couple. Conciergerie dédiée pour l'organisation et les
                          transferts entre chaque lieu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Apéro Limousine Paris
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>
                      Apéro Limousine Paris
                    </h2>
                    <p className='text-lg'>
                      Pour les amateurs de luxe et d'expériences sensuelles
                      uniques.
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                      <div className='border border-yellow-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>
                          Balade Parisienne Exclusive
                        </h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>1 heure en limousine aux vitres teintées</li>
                          <li>Flûtes de champagne premium</li>
                          <li>Parcours romantique des monuments illuminés</li>
                        </ul>
                      </div>
                      <div className='border border-pink-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>Plaisir Gastronomique</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>Bouchées gourmandes pour deux personnes</li>
                          <li>Service en voiture ou Love Room</li>
                          <li>Coupes de champagne accompagnées</li>
                        </ul>
                      </div>
                      <div className='border border-blue-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>Intimité Privilégiée</h3>
                        <ul className='list-disc pl-5 space-y-2'>
                          <li>2 heures en Love Room thématique</li>
                          <li>Kit boutique érotique raffiné</li>
                          <li>Playlist personnalisable via Bluetooth</li>
                        </ul>
                      </div>
                      <div className='border border-green-500 p-4 rounded-lg'>
                        <h3 className='font-semibold'>Détails Pratiques</h3>
                        <p>
                          Durée totale: 3 heures d'expérience. Tarif: 600€ par
                          voiture (pour 2 personnes).
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/apero-limousine.avif'
                      alt='Apéro Limousine Paris'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>*/}

                {/* Section: Week-End Glamour */}
                <div className='flex flex-col md:flex-row items-center bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <div className='flex-1 space-y-4'>
                    <h2 className='text-2xl font-bold'>Week-End Glamour</h2>
                    <p className='text-lg'>
                      Immersion sensuelle complète pour couples premium • 2
                      jours/2 nuits • 1600€-2200€ selon options
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                      <div>
                        <h3 className='font-semibold'>
                          Hébergement d'Exception
                        </h3>
                        <p>
                          Première nuit en hôtel 4★ Châtelet, seconde en Suite
                          Premium avec Jacuzzi privé à Pigalle
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>
                          Expériences Sensuelles
                        </h3>
                        <p>
                          Dîner libertin, spectacle privatif et accès VIP en
                          club avec champagne
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Détente Absolue</h3>
                        <p>
                          Sauna privatif d'une heure et massage en duo pour une
                          relaxation complète
                        </p>
                      </div>
                      <div>
                        <h3 className='font-semibold'>Service Exclusif</h3>
                        <p>
                          Transferts privés en limousine et conciergerie premium
                          disponible 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex-shrink-0 mt-6 md:mt-0 md:ml-8'>
                    <Image
                      src='/weekend-glamour.avif'
                      alt='Week-End Glamour'
                      width={400}
                      height={300}
                      className='rounded-lg shadow-md'
                    />
                  </div>
                </div>

                {/* Section: Événements & Offres Sur-Mesure */}
                <div className='bg-[#1a0d2e] text-white rounded-lg shadow-lg p-6 md:p-8'>
                  <h2 className='text-2xl font-bold mb-6'>
                    Événements & Offres Sur-Mesure
                  </h2>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-left border-separate border-spacing-y-2'>
                      <thead>
                        <tr className='text-white/90'>
                          <th className='px-4 py-2 font-semibold'>Événement</th>
                          <th className='px-4 py-2 font-semibold'>Concept</th>
                          <th className='px-4 py-2 font-semibold'>Durée</th>
                          <th className='px-4 py-2 font-semibold'>Tarif</th>
                        </tr>
                      </thead>
                      <tbody className='text-white/80'>
                        <tr className='bg-white/5 rounded-lg'>
                          <td className='px-4 py-2'>Jacuzzi & Champagne</td>
                          <td className='px-4 py-2'>
                            Jacuzzi privatif, bulles et ambiance lounge
                          </td>
                          <td className='px-4 py-2'>2h</td>
                          <td className='px-4 py-2'>200€/pers.</td>
                        </tr>
                        <tr className='bg-white/10 rounded-lg'>
                          <td className='px-4 py-2'>Speed Dating Glamour</td>
                          <td className='px-4 py-2'>
                            Rencontres en Love Rooms thématiques
                          </td>
                          <td className='px-4 py-2'>1h30</td>
                          <td className='px-4 py-2'>50€/pers.</td>
                        </tr>
                        <tr className='bg-white/5 rounded-lg'>
                          <td className='px-4 py-2'>Rideaux Ouverts</td>
                          <td className='px-4 py-2'>
                            Chambres communicantes pour séduction rapprochée
                          </td>
                          <td className='px-4 py-2'>1h</td>
                          <td className='px-4 py-2'>70€/pers.</td>
                        </tr>
                        <tr className='bg-white/10 rounded-lg'>
                          <td className='px-4 py-2'>Soirée Coquine</td>
                          <td className='px-4 py-2'>
                            Dîner, spectacle privé et club VIP
                          </td>
                          <td className='px-4 py-2'>4-6h</td>
                          <td className='px-4 py-2'>350€/couple</td>
                        </tr>
                        <tr className='bg-white/5 rounded-lg'>
                          <td className='px-4 py-2'>Apéro Limousine</td>
                          <td className='px-4 py-2'>
                            Tour en limousine et Love Room
                          </td>
                          <td className='px-4 py-2'>3h</td>
                          <td className='px-4 py-2'>600€/voiture</td>
                        </tr>
                        <tr className='bg-white/10 rounded-lg'>
                          <td className='px-4 py-2'>Week-End Glamour</td>
                          <td className='px-4 py-2'>
                            Immersion totale: hôtel, spa, dîner libertin
                          </td>
                          <td className='px-4 py-2'>2j/2n</td>
                          <td className='px-4 py-2'>1600-2200€</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className='mt-6 text-white/80'>
                    Des expériences sensuelles à la carte pour tous les goûts.
                    Réservez directement via notre plateforme en quelques clics.
                  </div>
                </div>
              </div>
            </TabsContent>

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

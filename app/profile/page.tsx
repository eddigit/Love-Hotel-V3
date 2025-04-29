"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Calendar,
  CreditCard,
  Edit,
  Heart,
  HelpCircle,
  ImageIcon,
  MapPin,
  MessageCircle,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function ProfilePage() {
  // Simuler des données de profil utilisateur
  const profile = {
    name: "Alex Durand",
    username: "alexdurand",
    age: 32,
    location: "Paris",
    bio: "Passionné de voyages et de nouvelles rencontres. J'adore les soirées et les événements sociaux.",
    online: true,
    followers: 1245,
    following: 356,
    rating: 4.8,
    interests: ["Voyages", "Cuisine", "Danse", "Cinéma", "Musique"],
    photos: [
      "/mystical-forest-spirit.png",
      "/contemplative-portrait.png",
      "/contemplative-portrait.png",
      "/contemplative-portrait.png",
    ],
    events: [
      {
        title: "Speed Dating",
        date: "Vendredi, 20:00",
        location: "Love Hotel - Paris",
        image: "/purple-speed-dates.png",
      },
      {
        title: "Soirée Jacuzzi",
        date: "Samedi, 21:00",
        location: "Love Hotel - Lyon",
        image: "/pink-jacuzzi-night.png",
      },
    ],
    stats: {
      visits: 245,
      likes: 128,
      matches: 36,
    },
    recentActivity: [
      {
        type: "like",
        user: "Sophie",
        time: "Il y a 2h",
        image: "/serene-woman.png",
      },
      {
        type: "message",
        user: "Thomas",
        time: "Il y a 5h",
        image: "/contemplative-man.png",
      },
      {
        type: "match",
        user: "Julie",
        time: "Il y a 1j",
        image: "/vibrant-woman.png",
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <div className="relative">
        <div className="h-40 md:h-60 w-full gradient-bg"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-sm text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-sm text-white">
            <Edit className="h-5 w-5" />
          </Button>
        </div>
        <div className="container relative">
          <div className="absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden">
                <Image
                  src="/mystical-forest-spirit.png"
                  alt={profile.name}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              {profile.online && (
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-2 border-background"></div>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold">
              {profile.name}, {profile.age}
            </h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-24 md:mt-28 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{profile.stats.visits}</div>
                    <div className="text-sm text-muted-foreground">Visites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.stats.likes}</div>
                    <div className="text-sm text-muted-foreground">J'aime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.stats.matches}</div>
                    <div className="text-sm text-muted-foreground">Matchs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">À propos de moi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{profile.bio}</p>
                <div>
                  <h3 className="font-semibold mb-2">Intérêts</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.user}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.user}</span>
                          {activity.type === "like" && <Heart className="h-4 w-4 text-secondary" />}
                          {activity.type === "message" && <MessageCircle className="h-4 w-4 text-primary" />}
                          {activity.type === "match" && <Users className="h-4 w-4 text-secondary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne centrale et droite */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="events">Événements</TabsTrigger>
                <TabsTrigger value="rooms">Love Rooms</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="photos" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Mes photos</CardTitle>
                    <Button size="sm" variant="outline">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {profile.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                          <Image
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            width={300}
                            height={300}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Mes événements</CardTitle>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Explorer
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.events.map((event, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="relative h-40">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                              <div className="text-white">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{event.date}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">Découvrez nos Love Rooms</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Réservez une Love Room pour un moment inoubliable dans l'un de nos établissements. Jacuzzi
                        privatif, ambiance romantique, et bien plus encore.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/love-rooms">Explorer les Love Rooms</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du compte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres généraux
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Préférences de messagerie
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Confidentialité
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Abonnement et paiements
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Aide et support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, MapPin, MessageCircle, Share2, Star, Users } from "lucide-react"
import Image from "next/image"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function ProfilePage({ params }: { params: { username: string } }) {
  // Simuler des données de profil
  const profile = {
    name: "Sophie",
    username: params.username,
    age: 28,
    location: "Paris",
    bio: "Passionnée de voyages et de nouvelles rencontres. J'adore les soirées et les événements sociaux.",
    online: true,
    followers: 1245,
    following: 356,
    rating: 4.8,
    interests: ["Voyages", "Cuisine", "Danse", "Cinéma", "Musique"],
    photos: [
      "/placeholder.svg?key=zkiof",
      "/serene-woman-purple.png",
      "/serene-woman-purple.png",
      "/serene-woman-purple.png",
    ],
    events: [
      {
        title: "Speed Dating",
        date: "Vendredi, 20:00",
      },
      {
        title: "Soirée Jacuzzi",
        date: "Samedi, 21:00",
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <div className="relative">
        <div className="h-40 md:h-60 w-full bg-gradient-to-r from-[#1a0d2e] to-[#3d1155]"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-sm text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-sm text-white">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-black/20 backdrop-blur-sm text-white">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <div className="container relative">
          <div className="absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden shadow-lg shadow-purple-900/30">
                <Image
                  src="/amethyst-portrait.png"
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
        <div className="flex justify-center gap-4 mb-6">
          <Button className="gap-2 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" className="gap-2 border-purple-800/30 bg-[#2d1155]/50 hover:bg-[#2d1155]/70">
            <Calendar className="h-4 w-4" />
            Inviter
          </Button>
        </div>

        <Card className="mb-6 border-0 bg-gradient-to-br from-[#2d1155]/70 to-[#3d1155]/50 backdrop-blur-sm shadow-lg shadow-purple-900/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-2xl font-bold">{profile.followers}</div>
                <div className="text-sm text-muted-foreground">Abonnés</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.following}</div>
                <div className="text-sm text-muted-foreground">Abonnements</div>
              </div>
              <div>
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  {profile.rating}
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
                <div className="text-sm text-muted-foreground">Note</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">À propos de moi</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Intérêts</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-[#ff3b8b]/20 text-[#ff8cc8] hover:bg-[#ff3b8b]/30"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#2d1155]/50">
            <TabsTrigger value="photos" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              Photos
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              Événements
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              Love Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg shadow-purple-900/20">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {profile.events.map((event, index) => (
                <Card
                  key={index}
                  className="border-0 bg-gradient-to-br from-[#2d1155]/70 to-[#3d1155]/50 backdrop-blur-sm shadow-lg shadow-purple-900/20"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90"
                    >
                      Rejoindre
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card className="border-0 bg-gradient-to-br from-[#2d1155]/70 to-[#3d1155]/50 backdrop-blur-sm shadow-lg shadow-purple-900/20">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Rejoignez une Love Room</h3>
                  <p className="text-muted-foreground">
                    Participez à des discussions en groupe et rencontrez de nouvelles personnes
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90">
                  Découvrir les Love Rooms
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  )
}

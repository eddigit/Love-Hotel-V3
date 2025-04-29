"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ProfileCard } from "@/components/profile-card"
import { useState } from "react"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Simuler des données de profils
  const profiles = [
    {
      name: "Sophie",
      age: 28,
      location: "Paris",
      image: "/amethyst-portrait.png",
      online: true,
    },
    {
      name: "Thomas",
      age: 32,
      location: "Lyon",
      image: "/contemplative-man.png",
      online: false,
    },
    {
      name: "Julie",
      age: 26,
      location: "Marseille",
      image: "/vibrant-woman.png",
      online: true,
    },
    {
      name: "Marc",
      age: 30,
      location: "Bordeaux",
      image: "/thoughtful-man-pink.png",
      online: false,
    },
    {
      name: "Émilie",
      age: 27,
      location: "Paris",
      image: "/serene-woman.png",
      online: true,
    },
    {
      name: "Antoine",
      age: 33,
      location: "Nice",
      image: "/contemplative-portrait.png",
      online: true,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <div className="container py-6 flex-1">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Découvrir</h1>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 pr-4 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="nearby" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nearby">À proximité</TabsTrigger>
            <TabsTrigger value="online">En ligne</TabsTrigger>
            <TabsTrigger value="new">Nouveaux</TabsTrigger>
          </TabsList>
          <TabsContent value="nearby" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profiles.map((profile, index) => (
                <ProfileCard
                  key={index}
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  image={profile.image}
                  online={profile.online}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="online" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profiles
                .filter((profile) => profile.online)
                .map((profile, index) => (
                  <ProfileCard
                    key={index}
                    name={profile.name}
                    age={profile.age}
                    location={profile.location}
                    image={profile.image}
                    online={profile.online}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profiles.slice(0, 3).map((profile, index) => (
                <ProfileCard
                  key={index}
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  image={profile.image}
                  online={profile.online}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  )
}

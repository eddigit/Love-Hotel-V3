"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ProfileCard } from "@/components/profile-card"
import { useState, useEffect } from "react"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { generateMockProfiles, sortProfilesByCompatibility, type UserProfile } from "@/utils/matching-algorithm"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("nearby")
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([])
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Générer des profils fictifs et un profil utilisateur fictif
  useEffect(() => {
    const mockProfiles = generateMockProfiles(30)
    setProfiles(mockProfiles)

    // Créer un profil fictif pour l'utilisateur actuel
    if (user) {
      // Mettre à jour le profil utilisateur fictif pour utiliser une image plus réaliste
      const mockUserProfile: UserProfile = {
        id: user.id,
        name: user.name,
        age: 28, // Âge fictif
        location: "Paris",
        image: "/glamorous-portrait.png",
        online: true,
        preferences: {
          status: "single_male",
          age: 28,
          orientation: "hetero",

          interestedInRestaurant: true,
          interestedInEvents: true,
          interestedInDating: true,
          preferCurtainOpen: false,
          interestedInLolib: true,
          suggestions: "",

          meetingTypes: {
            friendly: true,
            romantic: true,
            playful: true,
            openCurtains: false,
            libertine: false,
          },

          openToOtherCouples: false,
          specificPreferences: "",

          joinExclusiveEvents: false,
          premiumAccess: false,
        },
      }
      setCurrentUserProfile(mockUserProfile)
    }

    // Simuler un temps de chargement
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [user])

  // Filtrer les profils en fonction des critères
  useEffect(() => {
    if (!profiles.length || !currentUserProfile) return

    let result = [...profiles]

    // Trier par compatibilité
    result = sortProfilesByCompatibility(currentUserProfile, result)

    // Appliquer le filtre de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (profile) => profile.name.toLowerCase().includes(query) || profile.location.toLowerCase().includes(query),
      )
    }

    // Appliquer les filtres avancés
    if (filterOptions) {
      // Filtre par âge
      result = result.filter(
        (profile) => profile.age >= filterOptions.ageRange[0] && profile.age <= filterOptions.ageRange[1],
      )

      // Filtre par statut en ligne
      if (filterOptions.onlineOnly) {
        result = result.filter((profile) => profile.online)
      }

      // Filtre par statut (couple/célibataire)
      if (filterOptions.status !== "all") {
        if (filterOptions.status === "couple") {
          result = result.filter((profile) => profile.preferences.status === "couple")
        } else if (filterOptions.status === "single") {
          result = result.filter(
            (profile) => profile.preferences.status === "single_male" || profile.preferences.status === "single_female",
          )
        }
      }

      // Filtre par orientation
      if (filterOptions.orientation !== "all") {
        result = result.filter(
          (profile) =>
            profile.preferences.orientation === filterOptions.orientation ||
            profile.preferences.orientation === "bi" ||
            filterOptions.orientation === "bi",
        )
      }

      // Filtre par types de rencontres
      const selectedTypes = Object.entries(filterOptions.meetingTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type)

      if (selectedTypes.length > 0) {
        result = result.filter((profile) => {
          const profileTypes = Object.entries(profile.preferences.meetingTypes)
            .filter(([_, selected]) => selected)
            .map(([type]) => type)

          return selectedTypes.some((type) => profileTypes.includes(type))
        })
      }

      // Filtre par préférence de rideau
      if (filterOptions.curtainPreference !== "all") {
        const wantsCurtainOpen = filterOptions.curtainPreference === "open"
        result = result.filter((profile) => profile.preferences.preferCurtainOpen === wantsCurtainOpen)
      }
    }

    // Filtrer par onglet actif
    if (activeTab === "online") {
      result = result.filter((profile) => profile.online)
    } else if (activeTab === "new") {
      // Simuler des profils récents (les 5 premiers après tri)
      result = result.slice(0, 5)
    }

    setFilteredProfiles(result)
  }, [profiles, currentUserProfile, searchQuery, filterOptions, activeTab])

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
        <div className="container py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff3b8b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Chargement des profils...</p>
          </div>
        </div>
        <MobileNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
      <div className="container py-4 md:py-6 flex-1">
        <div className="flex flex-col gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Découvrir</h1>
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 pr-4 w-full bg-[#2d1155]/50 border-purple-800/30 focus:border-[#ff3b8b] text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <AdvancedFilters onFilterChange={handleFilterChange} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 bg-[#2d1155]/50">
            <TabsTrigger value="nearby" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              À proximité
            </TabsTrigger>
            <TabsTrigger value="online" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              En ligne
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
              Nouveaux
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 md:space-y-6">
            {filteredProfiles.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              >
                {filteredProfiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ProfileCard
                      name={profile.name}
                      age={profile.age}
                      location={profile.location}
                      image={profile.image}
                      online={profile.online}
                      featured={profile.featured}
                      matchScore={currentUserProfile ? Math.round(profile.matchScore || 0) : undefined}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-[#2d1155]/70 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-[#ff3b8b]/70" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun profil trouvé</h3>
                <p className="text-purple-200/70 max-w-md">
                  Essayez de modifier vos filtres ou votre recherche pour voir plus de profils
                </p>
                {filterOptions && (
                  <Button
                    variant="outline"
                    className="mt-4 border-purple-800/30 bg-[#2d1155]/50 text-white hover:bg-[#2d1155]/70"
                    onClick={() => setFilterOptions(null)}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ProfileCard } from "@/components/profile-card"
import { useState, useEffect } from "react"
import { AdvancedFilters, type FilterOptions } from "@/components/advanced-filters"
import { sortProfilesByCompatibility, type UserProfile as AlgoUserProfile, type OnboardingData } from "@/utils/matching-algorithm"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/main-layout"
import { getDiscoverProfiles, getUserProfile } from "@/actions/user-actions"
import { useRouter } from "next/navigation"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("nearby")
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [profiles, setProfiles] = useState<AlgoUserProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<AlgoUserProfile[]>([])
  const [currentUserProfile, setCurrentUserProfile] = useState<AlgoUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user: authUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authUser?.id) {
      router.replace("/login")
      return
    }

    async function fetchData() {
      if (!authUser?.id) {
        setIsLoading(false)
        return
      }

      if (!authUser.onboardingCompleted) {
        setIsLoading(false)
        console.log("Onboarding not complete, discover page will not load profiles.")
        return
      }

      setIsLoading(true)
      try {
        const userProfileData = await getUserProfile(authUser.id)

        // Detailed logging to debug incomplete profile data
        console.log("[DiscoverPage] Auth User ID:", authUser.id);
        console.log("[DiscoverPage] Fetched userProfileData:", JSON.stringify(userProfileData, null, 2));

        if (userProfileData) {
          console.log("[DiscoverPage] userProfileData.user:", JSON.stringify(userProfileData.user, null, 2));
          if (userProfileData.user) {
            console.log("[DiscoverPage] userProfileData.user.status:", userProfileData.user.status);
          }
          console.log("[DiscoverPage] userProfileData.preferences:", JSON.stringify(userProfileData.preferences, null, 2));
          console.log("[DiscoverPage] userProfileData.meetingTypes:", JSON.stringify(userProfileData.meetingTypes, null, 2));
        }

        if (userProfileData && userProfileData.user && userProfileData.user.status && userProfileData.preferences && userProfileData.meetingTypes) {
          const currentProfileForAlgo: AlgoUserProfile = {
            id: userProfileData.user.id,
            name: userProfileData.user.name || "Current User",
            age: userProfileData.user.age,
            location: userProfileData.user.location || "Unknown",
            image: userProfileData.user.avatar || "/placeholder.svg",
            online: true,
            featured: false,
            preferences: {
              status: userProfileData.user.status || "",
              age: userProfileData.user.age || null,
              orientation: userProfileData.user.orientation || "",
              interestedInRestaurant: userProfileData.preferences.interested_in_restaurant || false,
              interestedInEvents: userProfileData.preferences.interested_in_events || false,
              interestedInDating: userProfileData.preferences.interested_in_dating || false,
              preferCurtainOpen: userProfileData.preferences.prefer_curtain_open || false,
              interestedInLolib: userProfileData.preferences.interested_in_lolib || false,
              suggestions: userProfileData.preferences.suggestions || "",
              meetingTypes: {
                friendly: userProfileData.meetingTypes.friendly || false,
                romantic: userProfileData.meetingTypes.romantic || false,
                playful: userProfileData.meetingTypes.playful || false,
                openCurtains: userProfileData.meetingTypes.open_curtains || false,
                libertine: userProfileData.meetingTypes.libertine || false,
              },
              openToOtherCouples: userProfileData.meetingTypes.open_to_other_couples || false,
              specificPreferences: userProfileData.meetingTypes.specific_preferences || "",
              joinExclusiveEvents: (userProfileData.preferences as any).join_exclusive_events || false,
              premiumAccess: (userProfileData.preferences as any).premium_access || false,
            },
          };
          setCurrentUserProfile(currentProfileForAlgo);

          const fetchedDiscoverProfiles = await getDiscoverProfiles(authUser.id)
          setProfiles(fetchedDiscoverProfiles as AlgoUserProfile[])
        } else {
          console.error("Current user profile data is incomplete. Cannot load discover page.")
          // Detailed reasons for failure
          if (!userProfileData) {
            console.error("[DiscoverPage] Reason: userProfileData is null or undefined.");
          } else {
            if (!userProfileData.user) {
              console.error("[DiscoverPage] Reason: userProfileData.user is null or undefined.");
            }
            if (userProfileData.user && !userProfileData.user.status) {
              console.error("[DiscoverPage] Reason: userProfileData.user.status is null or undefined (likely missing user_profiles entry or status field is null in DB).");
            }
            if (!userProfileData.preferences) {
              console.error("[DiscoverPage] Reason: userProfileData.preferences is null or undefined (likely missing user_preferences entry).");
            }
            if (!userProfileData.meetingTypes) {
              console.error("[DiscoverPage] Reason: userProfileData.meetingTypes is null or undefined (likely missing user_meeting_types entry).");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data for discover page:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [authUser])

  useEffect(() => {
    if (!currentUserProfile) {
      setFilteredProfiles([])
      return
    }
    if (!profiles.length) {
      setFilteredProfiles([])
      return
    }

    let result = [...profiles]

    result = sortProfilesByCompatibility(currentUserProfile, result)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (profile) => profile.name.toLowerCase().includes(query) || profile.location.toLowerCase().includes(query),
      )
    }

    if (filterOptions) {
      result = result.filter(
        (profile) => profile.age >= filterOptions.ageRange[0] && profile.age <= filterOptions.ageRange[1],
      )

      if (filterOptions.onlineOnly) {
        result = result.filter((profile) => profile.online)
      }

      if (filterOptions.status !== "all") {
        if (filterOptions.status === "couple") {
          result = result.filter((profile) => profile.preferences.status === "couple")
        } else if (filterOptions.status === "single") {
          result = result.filter(
            (profile) => profile.preferences.status === "single_male" || profile.preferences.status === "single_female",
          )
        }
      }

      if (filterOptions.orientation !== "all") {
        result = result.filter(
          (profile) =>
            profile.preferences.orientation === filterOptions.orientation ||
            profile.preferences.orientation === "bi" ||
            filterOptions.orientation === "bi",
        )
      }

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

      if (filterOptions.curtainPreference !== "all") {
        const wantsCurtainOpen = filterOptions.curtainPreference === "open"
        result = result.filter((profile) => profile.preferences.preferCurtainOpen === wantsCurtainOpen)
      }
    }

    if (activeTab === "online") {
      result = result.filter((profile) => profile.online)
    } else if (activeTab === "new") {
      result = result.slice(0, 5)
    }

    setFilteredProfiles(result)
  }, [profiles, currentUserProfile, searchQuery, filterOptions, activeTab])

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters)
  }

  if (isLoading) {
    return (
      <MainLayout user={authUser}>
        <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
          <div className="container py-8 flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#ff3b8b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Chargement des profils...</p>
            </div>
          </div>
          <MobileNavigation />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout user={authUser}>
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
                        id={profile.id}
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
    </MainLayout>
  )
}

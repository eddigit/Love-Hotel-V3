"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MatchScore } from "@/components/match-score"
import { MessageCircle, Heart, Calendar, X, UserCheck, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { generateMockProfiles, getBestMatches, type UserProfile } from "@/utils/matching-algorithm"
import { useAuth } from "@/contexts/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { useRouter } from "next/navigation"

export default function MatchesPage(props) {
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [matches, setMatches] = useState<UserProfile[]>([])
  const [pendingMatches, setPendingMatches] = useState<UserProfile[]>([])
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Générer des profils fictifs
    const mockProfiles = generateMockProfiles(20)

    // Créer un profil fictif pour l'utilisateur actuel
    if (user) {
      const mockUserProfile: UserProfile = {
        id: user.id,
        name: user.name,
        age: 28, // Âge fictif
        location: "Paris",
        image: "/placeholder.svg?height=500&width=400&query=attractive+person+portrait+glamorous+lighting",
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

      // Obtenir les meilleurs matchs
      const bestMatches = getBestMatches(mockUserProfile, mockProfiles, 70)
      setMatches(bestMatches)

      // Générer des matchs en attente (score entre 50 et 70)
      const pending = mockProfiles
        .filter((profile) => {
          const score = profile.matchScore || 0
          return score >= 50 && score < 70
        })
        .slice(0, 5)
      setPendingMatches(pending)
    }

    return () => clearTimeout(timer)
  }, [user])

  const handleRemoveMatch = (id: string) => {
    setMatches(matches.filter((match) => match.id !== id))
  }

  const handleAcceptPending = async (profile: UserProfile) => {
    console.log("handleAcceptPending called", profile)
    if (!user) return
    try {
      // Call the new API route
      const response = await fetch("/api/accept-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: profile.id, receiverId: user.id })
      })
      const data = await response.json()
      if (data.success && data.conversationId) {
        setPendingMatches(pendingMatches.filter((p) => p.id !== profile.id))
        setMatches([...matches, profile])
        router.push(`/messages/${data.conversationId}`)
      } else {
        alert(data.error || "Erreur lors de l'acceptation du match.")
      }
    } catch (err) {
      alert("Erreur technique lors de l'acceptation du match.")
    }
  }

  const handleRejectPending = (id: string) => {
    setPendingMatches(pendingMatches.filter((p) => p.id !== id))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
        <div className="container py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff3b8b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Chargement de vos matchs...</p>
          </div>
        </div>
        <MobileNavigation />
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
        <div className="container py-4 md:py-6 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">Vos Matchs</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 bg-[#2d1155]/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
                Matchs ({matches.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#ff3b8b] data-[state=active]:text-white">
                En attente ({pendingMatches.length})
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value="all" className="space-y-4">
                {matches.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {matches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MatchCard profile={match} onRemove={() => handleRemoveMatch(match.id)} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={<Heart className="h-10 w-10 text-[#ff3b8b]/70" />}
                    title="Aucun match pour le moment"
                    description="Explorez la section Découvrir pour trouver des personnes qui vous correspondent"
                    action={
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] hover:from-[#ff3b8b]/90 hover:to-[#ff8cc8]/90 text-white border-0"
                      >
                        <Link href="/discover">Découvrir des profils</Link>
                      </Button>
                    }
                  />
                )}
              </TabsContent>

              <TabsContent key={`${activeTab}-pending`} value="pending" className="space-y-4">
                {pendingMatches.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    {pendingMatches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PendingMatchCard
                          profile={match}
                          onAccept={() => handleAcceptPending(match)}
                          onReject={() => handleRejectPending(match.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon={<Clock className="h-10 w-10 text-[#ff3b8b]/70" />}
                    title="Aucune demande en attente"
                    description="Revenez plus tard pour voir les nouvelles demandes de match"
                  />
                )}
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>

        <MobileNavigation />
      </div>
    </MainLayout>
  )
}

interface MatchCardProps {
  profile: UserProfile
  onRemove: () => void
}

function MatchCard({ profile, onRemove }: MatchCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg shadow-purple-900/20 bg-gradient-to-b from-[#2d1155]/90 to-[#1a0d2e]/90">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-1/3 aspect-square sm:aspect-auto">
            <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
            <div className="absolute top-2 left-2">
              <MatchScore score={Math.round(profile.matchScore || 0)} size="md" />
            </div>
            {profile.online && (
              <Badge className="absolute bottom-2 right-2 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                LIVE
              </Badge>
            )}
          </div>
          <div className="p-4 flex-1 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  {profile.name}, {profile.age}
                </h3>
                <p className="text-sm text-purple-200/80">{profile.location}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-200/60 hover:text-white hover:bg-purple-900/30"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-purple-200/80">
                <UserCheck className="h-4 w-4 mr-2 text-[#ff3b8b]" />
                <span>Match depuis {profile.lastActive || "2 jours"}</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(profile.preferences.meetingTypes)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="bg-purple-900/30 text-purple-100 border-purple-800/30 text-xs"
                    >
                      {key === "friendly" && "Amical"}
                      {key === "romantic" && "Romantique"}
                      {key === "playful" && "Ludique"}
                      {key === "openCurtains" && "Rideau ouvert"}
                      {key === "libertine" && "Libertin"}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] hover:from-[#ff3b8b]/90 hover:to-[#ff8cc8]/90 text-white border-0"
                asChild
              >
                <Link href={`/messages/${profile.id}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-purple-800/30 bg-purple-900/20 text-white hover:bg-purple-900/40"
                asChild
              >
                <Link href={`/profile/${profile.name.toLowerCase()}`}>Profil</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PendingMatchCardProps {
  profile: UserProfile
  onAccept: () => void
  onReject: () => void
}

function PendingMatchCard({ profile, onAccept, onReject }: PendingMatchCardProps) {
  console.log("PendingMatchCard rendered", profile)
  return (
    <Card className="overflow-hidden border-0 shadow-lg shadow-purple-900/20 bg-gradient-to-b from-[#2d1155]/90 to-[#1a0d2e]/90">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-1/3 aspect-square sm:aspect-auto">
            <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
            <div className="absolute top-2 left-2">
              <MatchScore score={Math.round(profile.matchScore || 0)} size="md" />
            </div>
          </div>
          <div className="p-4 flex-1 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">
                  {profile.name}, {profile.age}
                </h3>
                <p className="text-sm text-purple-200/80">{profile.location}</p>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-purple-200/80">
                <Calendar className="h-4 w-4 mr-2 text-[#ff3b8b]" />
                <span>Demande reçue {profile.lastActive || "aujourd'hui"}</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(profile.preferences.meetingTypes)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="bg-purple-900/30 text-purple-100 border-purple-800/30 text-xs"
                    >
                      {key === "friendly" && "Amical"}
                      {key === "romantic" && "Romantique"}
                      {key === "playful" && "Ludique"}
                      {key === "openCurtains" && "Rideau ouvert"}
                      {key === "libertine" && "Libertin"}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] hover:from-[#ff3b8b]/90 hover:to-[#ff8cc8]/90 text-white border-0"
                onClick={() => { console.log("Accepter button clicked"); onAccept(); }}
              >
                <Heart className="h-4 w-4 mr-1" />
                Accepter
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-purple-800/30 bg-purple-900/20 text-white hover:bg-purple-900/40"
                onClick={onReject}
              >
                <X className="h-4 w-4 mr-1" />
                Refuser
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
        className="h-20 w-20 rounded-full bg-[#2d1155]/70 flex items-center justify-center mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-xl text-white">{title}</h3>
      <p className="text-purple-200/80 mt-2 max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

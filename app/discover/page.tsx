"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useState, useEffect, useContext, useCallback } from "react"
import { AdvancedFilters } from "@/components/advanced-filters";
import { ProfileCard } from "@/components/profile-card";
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import MainLayout from "@/components/layout/main-layout"
import { useRouter } from "next/navigation"
import { getDiscoverProfiles } from "@/actions/user-actions";
import { FilterOptions } from "@/components/advanced-filters"

export default function DiscoverPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: [18, 99],
    distance: 50,
    onlineOnly: false,
    status: "all",
    orientation: "all",
    meetingTypes: {
      friendly: false,
      romantic: false,
      playful: false,
      openCurtains: false,
      libertine: false,
    },
    curtainPreference: "all",
  });

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchProfiles = useCallback(async (page: number) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await getDiscoverProfiles(user.id, page);

      setProfiles(prev => page === 1 ? result.profiles : [...prev, ...result.profiles]);
      setTotalPages(result.totalPages);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoading) return; // Wait for session to load
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfiles(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, router, fetchProfiles, currentPage]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchProfiles(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProfiles(nextPage);
    }
  };

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("nearby")

  if (!user?.onboardingCompleted) {
    return (
      <MainLayout user={user}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Complétez votre profil</h2>
            <p className="mb-4">Vous devez compléter votre profil pour accéder à cette page.</p>
            <Button onClick={() => router.push("/onboarding")}>Compléter mon profil</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout user={user}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover</h1>
        <div className="mb-8">
          <AdvancedFilters
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              age={profile.age}
              location={profile.location}
              image={profile.image || ""}
              popularity={profile.popularity || 0}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={!hasMore}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

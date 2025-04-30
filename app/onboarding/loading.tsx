import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]">
      <div className="container py-8 md:py-12 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg mb-6 text-center">
          <Skeleton className="h-8 w-64 bg-purple-800/30 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 bg-purple-800/20 mx-auto" />
        </div>

        <div className="w-full max-w-lg">
          <Skeleton className="h-[600px] w-full bg-purple-800/20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

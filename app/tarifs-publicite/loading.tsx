import { Skeleton } from "@/components/ui/skeleton"

export default function TarifsPubliciteLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />

        <Skeleton className="h-32 w-full mb-10" />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full transform scale-105" />
          <Skeleton className="h-[500px] w-full" />
        </div>

        <Skeleton className="h-96 w-full mb-12" />

        <div className="text-center">
          <Skeleton className="h-10 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-20 w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  )
}

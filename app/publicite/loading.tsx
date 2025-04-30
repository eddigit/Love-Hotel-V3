import { Skeleton } from "@/components/ui/skeleton"

export default function PubliciteLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />

        <Skeleton className="h-32 w-full mb-10" />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>

        <Skeleton className="h-80 w-full mb-12" />
        <Skeleton className="h-80 w-full mb-12" />

        <div className="text-center">
          <Skeleton className="h-10 w-1/2 mx-auto mb-6" />
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Skeleton className="h-12 w-40 mx-auto" />
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

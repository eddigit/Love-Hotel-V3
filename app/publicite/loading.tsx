import MainLayout from "ui/src/layout/MainLayout"

export default function PubliciteLoading() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6 w-3/4 mx-auto"></div>

            <div className="h-24 bg-gray-200 rounded-lg mb-10"></div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>

            <div className="h-80 bg-gray-200 rounded-lg mb-12"></div>

            <div className="h-64 bg-gray-200 rounded-lg mb-12"></div>

            <div className="flex justify-center gap-4">
              <div className="h-12 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

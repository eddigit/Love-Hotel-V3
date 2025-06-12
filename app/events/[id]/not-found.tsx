import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowLeft } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'

export default function EventNotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-xl">Événement introuvable</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                L'événement que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <div className="space-y-2">
                <Link href="/events">
                  <Button className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux événements
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

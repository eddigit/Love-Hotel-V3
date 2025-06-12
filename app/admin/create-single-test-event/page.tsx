import { createSingleTestEvent } from '@/actions/create-test-event'
import { redirect } from 'next/navigation'

export default async function CreateTestEventPage() {
  const result = await createSingleTestEvent()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Création d'événement de test</h1>
        {result.success ? (
          <div className="p-4 bg-green-100 text-green-800 rounded">
            ✅ {result.message}
          </div>
        ) : (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            ❌ Erreur: {result.error}
          </div>
        )}
        <div className="mt-4">
          <a href="/events" className="text-blue-500 hover:underline">
            Aller voir les événements
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateTestEventsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/events/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Créer des événements de test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createEvents} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Création en cours...' : 'Créer les événements de test'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result.success ? (
                <div>
                  <p>✅ Événements créés avec succès!</p>
                  <p>Nouveaux: {result.created}, Existants: {result.existing}</p>
                </div>
              ) : (
                <div>
                  <p>❌ Erreur: {result.error}</p>
                  {result.details && <p>Détails: {result.details}</p>}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

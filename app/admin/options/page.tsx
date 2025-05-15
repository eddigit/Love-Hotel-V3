"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOption, setOption } from "@/actions/user-actions"
import MainLayout from "@/components/layout/main-layout"
import { AdminTabs } from "@/components/admin-tabs"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/contexts/auth-context"

export default function AdminOptionsPage() {
  const { user } = useAuth()
  const [eventCategories, setEventCategories] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true)
      const value = await getOption("event_categories")
      setEventCategories(value || "speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant")
      setLoading(false)
    }
    fetchOptions()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)
    try {
      await setOption("event_categories", eventCategories)
      setSuccess(true)
    } catch (err) {
      setError("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <MainLayout user={user}>
      <div className="container py-10 max-w-xl">
        <AdminHeader user={user} />
        <AdminTabs />
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de l'application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Catégories d'événements</label>
                <textarea
                  className="w-full border rounded p-2 min-h-[120px] font-mono"
                  value={eventCategories}
                  onChange={e => setEventCategories(e.target.value)}
                  placeholder={"speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant"}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Une paire <b>valeur|label</b> par ligne. Exemple :<br />
                  <code>speed-dating|Speed Dating</code><br />
                  <code>jacuzzi|Jacuzzi</code>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Enregistré !</div>}
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

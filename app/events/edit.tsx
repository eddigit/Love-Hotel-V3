// Page for editing an event by its creator or admin
'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateEvent, getUpcomingEvents } from '@/actions/event-actions'
import { getOption } from '@/actions/user-actions'
import MainLayout from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'

export default function EditEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('id')
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    image: '',
    category: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)
      const events = await getUpcomingEvents(user?.id)
      const event = events.find((e: any) => String(e.id) === String(eventId))
      if (event) {
        setForm({
          title: event.title || '',
          location: event.location || '',
          date: event.event_date ? (typeof event.event_date === 'string' ? event.event_date.slice(0, 16) : new Date(event.event_date).toISOString().slice(0, 16)) : '',
          image: event.image || '',
          category: event.category || '',
          description: event.description || ''
        })
      }
      setLoading(false)
    }
    async function fetchCategories() {
      const raw = await getOption('event_categories')
      const lines = (raw || 'speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant').split('\n')
      setCategories(
        lines
          .map(line => line.trim())
          .filter(Boolean)
          .map(line => {
            const [value, label] = line.split('|')
            return value && label ? { value: value.trim(), label: label.trim() } : null
          })
          .filter(Boolean) as { value: string; label: string }[]
      )
    }
    if (eventId) fetchEvent()
    fetchCategories()
  }, [eventId, user?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await updateEvent(eventId, form)
      router.push('/events')
    } catch (err) {
      setError("Erreur lors de la modification de l'événement.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout user={user}>
      <div className="container py-10 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Modifier l'événement</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" placeholder="Titre" value={form.title} onChange={handleChange} className="w-full border rounded p-2" required />
                <input name="location" placeholder="Lieu" value={form.location} onChange={handleChange} className="w-full border rounded p-2" required />
                <input name="date" type="datetime-local" placeholder="Date" value={form.date} onChange={handleChange} className="w-full border rounded p-2" required />
                <input name="image" placeholder="Image (URL)" value={form.image} onChange={handleChange} className="w-full border rounded p-2" />
                <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Modification..." : "Enregistrer les modifications"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

// Page for creating a new event (for all users)
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createEvent } from '@/actions/event-actions'
import { getOption } from '@/actions/user-actions'
import MainLayout from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'

export default function CreateEventPage () {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    image: '',
    category: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    async function fetchCategories () {
      const raw = await getOption('event_categories')
      const lines = (
        raw ||
        'speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant'
      ).split('\n')
      setCategories(
        (lines as string[])
          .map((line: string) => line.trim())
          .filter(Boolean)
          .map((line: string) => {
            const [value, label] = line.split('|')
            return value && label
              ? { value: value.trim(), label: label.trim() }
              : null
          })
          .filter(Boolean) as { value: string; label: string }[]
      )
    }
    fetchCategories()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!user?.id) {
      setError('Vous devez être connecté pour créer un événement.')
      setLoading(false)
      return
    }
    try {
      await createEvent({ ...form, creator_id: user.id })
      router.push('/events')
    } catch (err) {
      setError("Erreur lors de la création de l'événement.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout user={user}>
      <div className='container py-10 max-w-xl'>
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <input
                name='title'
                placeholder='Titre'
                value={form.title}
                onChange={handleChange}
                className='w-full border rounded p-2'
                required
              />
              <input
                name='location'
                placeholder='Lieu'
                value={form.location}
                onChange={handleChange}
                className='w-full border rounded p-2'
                required
              />
              <input
                name='date'
                type='datetime-local'
                placeholder='Date'
                value={form.date}
                onChange={handleChange}
                className='w-full border rounded p-2'
                required
              />
              <input
                name='image'
                placeholder='Image (URL)'
                value={form.image}
                onChange={handleChange}
                className='w-full border rounded p-2'
              />
              <select
                name='category'
                value={form.category}
                onChange={handleChange}
                className='w-full border rounded p-2'
              >
                <option value=''>Catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <textarea
                name='description'
                placeholder='Description'
                value={form.description}
                onChange={handleChange}
                className='w-full border rounded p-2'
              />
              {error && <div className='text-red-500 text-sm'>{error}</div>}
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Création...' : "Créer l'événement"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Image from 'next/image'

export function UserProfileEditor ({
  user,
  onSave,
  onUploadImage
}: {
  user: any
  onSave: (data: any) => void
  onUploadImage: (formData: FormData) => Promise<any>
}) {
  const router = useRouter()
  const [form, setForm] = useState(() => {
    let interests = user.interests
    if (typeof interests === 'string') {
      try {
        interests = interests ? JSON.parse(interests) : []
      } catch {
        interests = []
      }
    }
    if (!Array.isArray(interests)) {
      interests = []
    }
    return {
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      age: user.age || '',
      orientation: user.orientation || '',
      gender: user.gender || '',
      birthday: user.birthday || '',
      interests,
      avatar: user.avatar || ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [newInterest, setNewInterest] = useState('')
  const [uploading, setUploading] = useState(false)

  function handleChange (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSelectChange (name: string, value: string) {
    setForm({ ...form, [name]: value })
  }

  function handleAddInterest () {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm({ ...form, interests: [...form.interests, newInterest.trim()] })
      setNewInterest('')
    }
  }

  function handleRemoveInterest (interest: string) {
    setForm({
      ...form,
      interests: form.interests.filter((i: string) => i !== interest)
    })
  }

  async function handleImageChange (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const formData = new FormData()
      formData.append('profileImage', file)
      const result = await onUploadImage(formData)
      if (result?.url) {
        setForm(f => ({ ...f, avatar: result.url }))
      }
      setUploading(false)
    }
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <button
              type='button'
              onClick={() => setForm({ ...form, avatar: '' })}
              className='absolute bottom-4 right-4 bg-red-500 text-white rounded-full px-2'
              style={{ display: form.avatar.length > 0 ? 'block' : 'none' }}
            >
              X
            </button>
            <div className='w-32 h-32 md:w-60 md:h-60 rounded-full border-4 border-background overflow-hidden shadow-lg shadow-purple-900/30'>
              <Image
                src={form.avatar || '/amethyst-portrait.png'}
                alt={form.name}
                width={200}
                height={200}
                className='h-full w-full object-cover '
              />
            </div>
          </div>
          <Input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            disabled={uploading}
            className='text-2xl font-bold text-center max-w-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2'
            style={{ display: form.avatar.length > 0 ? 'none' : 'block' }}
          />
          <Input
            name='name'
            value={form.name}
            onChange={handleChange}
            className='text-2xl font-bold text-center max-w-sm'
            placeholder='Nom'
          />
          <div className='w-full max-w-sm'>
            <Select
              value={form.gender}
              onValueChange={value => handleSelectChange('gender', value)}
            >
              <SelectTrigger id='gender'>
                <SelectValue placeholder='Sélectionner le genre' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Homme</SelectItem>
                <SelectItem value='female'>Femme</SelectItem>
                <SelectItem value='other'>Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            name='birthday'
            type='date'
            value={form.birthday}
            onChange={handleChange}
            className='max-w-sm'
            placeholder='Date de naissance'
          />
          <Input
            name='location'
            value={form.location}
            onChange={handleChange}
            className='max-w-sm'
            placeholder='Ville'
          />
          <Input
            name='age'
            type='number'
            value={form.age}
            onChange={handleChange}
            className='max-w-sm'
            placeholder='Âge'
            min={18}
          />
          <div className='w-full max-w-sm'>
            <Select
              value={form.orientation}
              onValueChange={value => handleSelectChange('orientation', value)}
            >
              <SelectTrigger id='orientation'>
                <SelectValue placeholder="Sélectionner l'orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='hetero'>Hétérosexuel(le)</SelectItem>
                <SelectItem value='homo'>Homosexuel(le)</SelectItem>
                <SelectItem value='bi'>Bisexuel(le)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            name='bio'
            value={form.bio}
            onChange={handleChange}
            className='max-w-sm'
            placeholder='À propos de moi'
            rows={4}
          />
          <div>
            <div className='flex flex-wrap gap-2 mb-2'>
              {form.interests.map((interest: string) => (
                <span
                  key={interest}
                  className='inline-flex items-center bg-gray-800 rounded px-2 py-1 text-sm'
                >
                  {interest}
                  <button
                    type='button'
                    onClick={() => handleRemoveInterest(interest)}
                    className='ml-1 text-red-500'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className='flex gap-2'>
              <Input
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                placeholder='Ajouter un intérêt'
                className='w-40'
              />
              <Button
                type='button'
                onClick={handleAddInterest}
                variant='secondary'
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button type='submit' disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  )
}

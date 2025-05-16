"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export function UserProfileEditor({ user, onSave, onUploadImage }: {
  user: any,
  onSave: (data: any) => void,
  onUploadImage: (formData: FormData) => Promise<any>
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    age: user.age || "",
    orientation: user.orientation || "",
    gender: user.gender || "",
    birthday: user.birthday || "",
    interests: user.interests || [],
    avatar: user.avatar || "",
  })
  const [saving, setSaving] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [uploading, setUploading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSelectChange(name: string, value: string) {
    setForm({ ...form, [name]: value })
  }

  function handleAddInterest() {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm({ ...form, interests: [...form.interests, newInterest.trim()] })
      setNewInterest("")
    }
  }

  function handleRemoveInterest(interest: string) {
    setForm({ ...form, interests: form.interests.filter((i: string) => i !== interest) })
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      const formData = new FormData()
      formData.append("profileImage", file)
      const result = await onUploadImage(formData)
      if (result?.url) {
        setForm(f => ({ ...f, avatar: result.url }))
      }
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden shadow-lg shadow-purple-900/30">
          <Image
            src={form.avatar || "/amethyst-portrait.png"}
            alt={form.name}
            width={160}
            height={160}
            className="object-cover"
          />
        </div>
        <Input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="text-2xl font-bold text-center max-w-xs"
          placeholder="Nom"
        />
        <div className="w-full max-w-xs">
          <Select value={form.gender} onValueChange={value => handleSelectChange("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Sélectionner le genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          name="birthday"
          type="date"
          value={form.birthday}
          onChange={handleChange}
          className="max-w-xs"
          placeholder="Date de naissance"
        />
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="max-w-xs"
          placeholder="Ville"
        />
        <Input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="max-w-xs"
          placeholder="Âge"
          min={18}
        />
        <Input
          name="orientation"
          value={form.orientation}
          onChange={handleChange}
          className="max-w-xs"
          placeholder="Orientation"
        />
        <Textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full"
          placeholder="À propos de moi"
          rows={4}
        />
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.interests.map((interest: string) => (
              <span key={interest} className="inline-flex items-center bg-gray-800 rounded px-2 py-1 text-sm">
                {interest}
                <button type="button" onClick={() => handleRemoveInterest(interest)} className="ml-1 text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              placeholder="Ajouter un intérêt"
              className="w-40"
            />
            <Button type="button" onClick={handleAddInterest} variant="secondary">
              Ajouter
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}

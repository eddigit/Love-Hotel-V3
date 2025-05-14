"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"

export function PreferencesEditor({ preferences, meetingTypes, additionalOptions, onSave }: any) {
  const [form, setForm] = useState({
    interested_in_restaurant: preferences.interested_in_restaurant || false,
    interested_in_events: preferences.interested_in_events || false,
    interested_in_dating: preferences.interested_in_dating || false,
    prefer_curtain_open: preferences.prefer_curtain_open || false,
    interested_in_lolib: preferences.interested_in_lolib || false,
    suggestions: preferences.suggestions || "",
    friendly: meetingTypes.friendly || false,
    romantic: meetingTypes.romantic || false,
    playful: meetingTypes.playful || false,
    open_curtains: meetingTypes.open_curtains || false,
    libertine: meetingTypes.libertine || false,
    open_to_other_couples: meetingTypes.open_to_other_couples || false,
    specific_preferences: meetingTypes.specific_preferences || "",
    join_exclusive_events: additionalOptions.join_exclusive_events || false,
    premium_access: additionalOptions.premium_access || false,
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    await onSave({
      preferences: {
        interested_in_restaurant: form.interested_in_restaurant,
        interested_in_events: form.interested_in_events,
        interested_in_dating: form.interested_in_dating,
        prefer_curtain_open: form.prefer_curtain_open,
        interested_in_lolib: form.interested_in_lolib,
        suggestions: form.suggestions,
      },
      meetingTypes: {
        friendly: form.friendly,
        romantic: form.romantic,
        playful: form.playful,
        open_curtains: form.open_curtains,
        libertine: form.libertine,
        open_to_other_couples: form.open_to_other_couples,
        specific_preferences: form.specific_preferences,
      },
      additionalOptions: {
        join_exclusive_events: form.join_exclusive_events,
        premium_access: form.premium_access,
      },
    })
    setSaving(false)
    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Préférences générales</h4>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <Checkbox name="interested_in_restaurant" checked={form.interested_in_restaurant} onCheckedChange={v => setForm(f => ({ ...f, interested_in_restaurant: v as boolean }))} />
              Intéressé(e) par les restaurants
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="interested_in_events" checked={form.interested_in_events} onCheckedChange={v => setForm(f => ({ ...f, interested_in_events: v as boolean }))} />
              Intéressé(e) par les évènements
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="interested_in_dating" checked={form.interested_in_dating} onCheckedChange={v => setForm(f => ({ ...f, interested_in_dating: v as boolean }))} />
              Intéressé(e) par les rencontres
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="prefer_curtain_open" checked={form.prefer_curtain_open} onCheckedChange={v => setForm(f => ({ ...f, prefer_curtain_open: v as boolean }))} />
              Préfère rideaux ouverts
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="interested_in_lolib" checked={form.interested_in_lolib} onCheckedChange={v => setForm(f => ({ ...f, interested_in_lolib: v as boolean }))} />
              Intéressé(e) par le Lolib
            </label>
            <label className="flex items-center gap-2">
              Suggestions :
              <Input name="suggestions" value={form.suggestions} onChange={handleChange} className="ml-2" />
            </label>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Types de rencontres recherchées</h4>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <Checkbox name="friendly" checked={form.friendly} onCheckedChange={v => setForm(f => ({ ...f, friendly: v as boolean }))} />
              Amicales
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="romantic" checked={form.romantic} onCheckedChange={v => setForm(f => ({ ...f, romantic: v as boolean }))} />
              Romantiques
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="playful" checked={form.playful} onCheckedChange={v => setForm(f => ({ ...f, playful: v as boolean }))} />
              Ludiques
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="open_curtains" checked={form.open_curtains} onCheckedChange={v => setForm(f => ({ ...f, open_curtains: v as boolean }))} />
              Rideaux ouverts
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="libertine" checked={form.libertine} onCheckedChange={v => setForm(f => ({ ...f, libertine: v as boolean }))} />
              Libertines
            </label>
            <label className="flex items-center gap-2">
              <Checkbox name="open_to_other_couples" checked={form.open_to_other_couples} onCheckedChange={v => setForm(f => ({ ...f, open_to_other_couples: v as boolean }))} />
              Ouvert aux autres couples
            </label>
            <label className="flex items-center gap-2">
              Préférences spécifiques :
              <Input name="specific_preferences" value={form.specific_preferences} onChange={handleChange} className="ml-2" />
            </label>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Options supplémentaires</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <Checkbox name="join_exclusive_events" checked={form.join_exclusive_events} onCheckedChange={v => setForm(f => ({ ...f, join_exclusive_events: v as boolean }))} />
            Participer aux évènements exclusifs
          </label>
          <label className="flex items-center gap-2">
            <Checkbox name="premium_access" checked={form.premium_access} onCheckedChange={v => setForm(f => ({ ...f, premium_access: v as boolean }))} />
            Accès premium
          </label>
        </div>
      </div>
      <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer les préférences"}</Button>
      {success && <div className="text-green-600 mt-2">Préférences enregistrées !</div>}
    </form>
  )
}

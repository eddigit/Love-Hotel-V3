'use client'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getOption, setOption } from '@/actions/user-actions'
import MainLayout from '@/components/layout/main-layout'
import { AdminTabs } from '@/components/admin-tabs'
import { AdminHeader } from '@/components/admin-header'
import { useAuth } from '@/contexts/auth-context'

export default function AdminOptionsPage () {
  const { user } = useAuth()
  const [eventCategories, setEventCategories] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [resetEmailSubject, setResetEmailSubject] = useState('')
  const [resetEmailBody, setResetEmailBody] = useState('')

  useEffect(() => {
    async function fetchOptions () {
      setLoading(true)
      const value = await getOption('event_categories')
      setEventCategories(
        value ||
          'speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant'
      )
      const subject = await getOption('verification_email_subject')
      setEmailSubject(subject || 'Vérifiez votre adresse email sur Love Hotel')
      const body = await getOption('verification_email_body')
      setEmailBody(
        body ||
          `Bonjour [name],\n\nMerci de vous être inscrit sur Love Hotel !\n\nVeuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :\n\n[verification-link]\n\nSi vous n'avez pas créé de compte, ignorez cet email.\n\nL'équipe Love Hotel`
      )
      const resetSubject = await getOption('password_reset_email_subject')
      setResetEmailSubject(
        resetSubject || 'Réinitialisez votre mot de passe sur Love Hotel'
      )
      const resetBody = await getOption('password_reset_email_body')
      setResetEmailBody(
        resetBody ||
          `Bonjour [name],\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nVeuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :\n\n[reset-link]\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nL'équipe Love Hotel`
      )
      setLoading(false)
    }
    fetchOptions()
  }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await setOption('event_categories', eventCategories)
      await setOption('verification_email_subject', emailSubject)
      await setOption('verification_email_body', emailBody)
      await setOption('password_reset_email_subject', resetEmailSubject)
      await setOption('password_reset_email_body', resetEmailBody)
      setSuccess(true)
    } catch (err) {
      setError("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <MainLayout user={user}>
      <div className='container py-10 max-w-xl'>
        <AdminHeader user={user} />
        <AdminTabs />
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de l'application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className='space-y-4'>
              <div>
                <label className='block font-medium mb-1'>
                  Catégories d'événements
                </label>
                <textarea
                  className='w-full border rounded p-2 min-h-[120px] font-mono'
                  value={eventCategories}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEventCategories(e.target.value)
                  }
                  placeholder={
                    'speed-dating|Speed Dating\njacuzzi|Jacuzzi\nrestaurant|Restaurant'
                  }
                />
                <div className='text-xs text-muted-foreground mt-1'>
                  Une paire <b>valeur|label</b> par ligne. Exemple :<br />
                  <code>speed-dating|Speed Dating</code>
                  <br />
                  <code>jacuzzi|Jacuzzi</code>
                </div>
              </div>
              <hr className='my-6' />
              <div>
                <label className='block font-medium mb-1'>
                  Sujet de l'email de vérification
                </label>
                <input
                  className='w-full border rounded p-2 font-mono'
                  value={emailSubject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmailSubject(e.target.value)
                  }
                  placeholder='Vérifiez votre adresse email sur Love Hotel'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>
                  Corps de l'email de vérification
                </label>
                <textarea
                  className='w-full border rounded p-2 min-h-[160px] font-mono'
                  value={emailBody}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEmailBody(e.target.value)
                  }
                  placeholder={`Bonjour [name],\n\nMerci de vous être inscrit sur Love Hotel !\n\nVeuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :\n\n[verification-link]\n\nSi vous n'avez pas créé de compte, ignorez cet email.\n\nL'équipe Love Hotel`}
                />
                <div className='text-xs text-muted-foreground mt-1'>
                  Placeholders disponibles : <code>[name]</code>,{' '}
                  <code>[verification-link]</code>
                </div>
              </div>
              <div>
                <label className='block font-medium mb-1'>
                  Sujet de l'email de réinitialisation
                </label>
                <input
                  className='w-full border rounded p-2 font-mono'
                  value={resetEmailSubject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setResetEmailSubject(e.target.value)
                  }
                  placeholder='Réinitialisez votre mot de passe sur Love Hotel'
                />
              </div>
              <div>
                <label className='block font-medium mb-1'>
                  Corps de l'email de réinitialisation
                </label>
                <textarea
                  className='w-full border rounded p-2 min-h-[160px] font-mono'
                  value={resetEmailBody}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResetEmailBody(e.target.value)
                  }
                  placeholder={`Bonjour [name],\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nVeuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :\n\n[reset-link]\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nL'équipe Love Hotel`}
                />
                <div className='text-xs text-muted-foreground mt-1'>
                  Placeholders disponibles : <code>[name]</code>,{' '}
                  <code>[reset-link]</code>
                </div>
              </div>
              {error && <div className='text-red-500 text-sm'>{error}</div>}
              {success && (
                <div className='text-green-600 text-sm'>Enregistré !</div>
              )}
              <Button type='submit' className='w-full' disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

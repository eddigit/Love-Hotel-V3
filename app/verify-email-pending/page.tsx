'use client'

import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function VerifyEmailPendingPage () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleResend = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Un nouvel email de vérification a été envoyé.')
      } else {
        setMessage(data.error || "Erreur lors de l'envoi de l'email.")
      }
    } catch (e) {
      setMessage("Erreur lors de l'envoi de l'email.")
    }
    setLoading(false)
  }

  return (
    <MainLayout>
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]'>
        <div className='bg-white/10 rounded-lg p-8 shadow-lg max-w-md w-full text-center'>
          <h1 className='text-2xl font-bold mb-4 text-white'>
            Vérification de l'email requise
          </h1>
          <p className='mb-4 text-purple-200'>
            Un e-mail de vérification vient de vous être envoyé à <b>{email}</b>
            .<br />
            Merci de vérifier votre boîte de réception.
          </p>
          <Button
            onClick={handleResend}
            disabled={loading}
            className='w-full mb-2'
          >
            {loading ? 'Envoi...' : "Renvoyer l'email de vérification"}
          </Button>
          {message && <div className='text-purple-100 mt-2'>{message}</div>}
        </div>
      </div>
    </MainLayout>
  )
}

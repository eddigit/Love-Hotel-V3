'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'

export default function VerifyEmailPage () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token manquant.')
      return
    }
    fetch(`/api/verify-email?token=${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setMessage(
            'Votre email a bien été vérifié. Vous pouvez maintenant vous connecter.'
          )
        } else {
          setStatus('error')
          setMessage(data.error || 'Erreur lors de la vérification.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Erreur lors de la vérification.')
      })
  }, [token])

  return (
    <MainLayout>
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0d2e] to-[#3d1155]'>
        <div className='bg-white/10 rounded-lg p-8 shadow-lg max-w-md w-full text-center'>
          <h1 className='text-2xl font-bold mb-4 text-white'>
            Vérification de l'email
          </h1>
          {status === 'pending' && (
            <p className='text-purple-200'>Vérification en cours...</p>
          )}
          {status !== 'pending' && <p className='text-purple-200'>{message}</p>}
        </div>
      </div>
    </MainLayout>
  )
}

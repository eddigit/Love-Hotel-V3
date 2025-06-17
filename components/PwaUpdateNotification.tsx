'use client'

import { useEffect, useState } from 'react'

export default function PwaUpdateNotification() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setShow(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShow(false)
    window.location.reload()
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 0,
      right: 0,
      margin: '0 auto',
      maxWidth: 400,
      background: '#222',
      color: '#fff',
      padding: 16,
      borderRadius: 8,
      textAlign: 'center',
      zIndex: 1000
    }}>
      <div>Une nouvelle version de l’application est disponible.</div>
      <button
        style={{
          marginTop: 12,
          background: '#e11d48',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '8px 16px',
          cursor: 'pointer'
        }}
        onClick={reloadPage}
      >
        Mettre à jour
      </button>
    </div>
  )
}

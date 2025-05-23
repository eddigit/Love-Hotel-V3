'use client'

import React from 'react'
import MainLayout from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'

export default function ConceptPage () {
  const { user } = useAuth()
  return (
    <MainLayout user={user}>
      <div className='min-h-screen bg-[#120821] flex flex-col items-center justify-center py-12'>
        <h1 className='text-3xl md:text-5xl font-bold text-white mb-8 text-center'>
          Le Concept Love Hôtel
        </h1>
        <div className='w-full max-w-4xl rounded-2xl overflow-visible shadow-lg border-0 '>
          <iframe
            src='https://love-hotel-a-paris-un-ec-g1f4ldz.gamma.site/'
            title='Concept Love Hôtel'
            width='100%'
            className='w-full min-h-[90vh] bg-white border-0'
            style={{ minHeight: '90vh', border: 0, display: 'block' }}
            allowFullScreen
            scrolling='auto'
          ></iframe>
        </div>
      </div>
    </MainLayout>
  )
}

import MainLayout from '@/components/layout/main-layout'

export default function GoodbyePage () {
  return (
    <MainLayout>
      <div className='container max-w-screen-md mx-auto px-4 py-16 text-center'>
        <h1 className='text-3xl font-bold mb-6 text-red-700'>
          Votre compte a bien été supprimé
        </h1>
        <p className='mb-8 text-lg'>
          Nous sommes désolés de vous voir partir. Toutes vos données ont été
          supprimées conformément à la réglementation RGPD.
        </p>
        <a
          href='/'
          className='inline-block bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 transition'
        >
          Retour à l'accueil
        </a>
      </div>
    </MainLayout>
  )
}

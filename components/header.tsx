'use client'

import { Button } from '@/components/ui/button'
import { Heart, Menu, Search, X, MessageCircle, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { NotificationsButton } from '@/components/notifications-button'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  session?: any
  user?: any
}

export function Header ({ session, user }: HeaderProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Vérifier si nous sommes sur la landing page, une page de présentation, la page de login ou la page d'inscription
  const isPresentationPage =
    pathname === '/' ||
    /*pathname === "/about" ||*/
    pathname === '/features' ||
    pathname === '/pricing' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/rencontres' ||
    pathname === '/en-direct' ||
    pathname === '/premium'

  if (isPresentationPage) {
    return null
  }

  return (
    <header className='border-b border-purple-800/30 sticky top-0 z-40 bg-[#1a0d2e]/95 backdrop-blur-md'>
      <div className='container flex items-center justify-between h-16'>
        <Link
          href={isLoggedIn ? '/discover' : '/'}
          className='flex items-center gap-2 z-10'
        >
          <Heart className='h-5 w-5 text-[#ff3b8b]' />
          <span className='font-bold text-lg'>Love Hotel</span>
        </Link>
        {isLoggedIn ? (
          <>
            <div className='hidden md:flex items-center gap-4'>
              <Link href='/discover'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={pathname === '/discover' ? 'text-[#ff3b8b]' : ''}
                >
                  Découvrir
                </Button>
              </Link>
              <Link href='/events'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={pathname === '/events' ? 'text-[#ff3b8b]' : ''}
                >
                  Événements
                </Button>
              </Link>
              <Link href='/love-rooms'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={pathname === '/love-rooms' ? 'text-[#ff3b8b]' : ''}
                >
                  Escapade
                </Button>
              </Link>
              <Link href='/messages'>
                <Button
                  variant='ghost'
                  size='sm'
                  className={pathname === '/messages' ? 'text-[#ff3b8b]' : ''}
                >
                  Messages
                </Button>
              </Link>
              {isAdmin && (
                <Link href='/admin'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className={pathname === '/admin' ? 'text-[#ff3b8b]' : ''}
                  >
                    <Settings className='h-5 w-5' />
                  </Button>
                </Link>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {/*<Button
                variant='outline'
                size='icon'
                className='rounded-full md:flex hidden border-purple-800/30 bg-[#2d1155]/50'
              >
                <Search className='h-4 w-4' />
              </Button>*/}
              <NotificationsButton />
              <div className='hidden md:block'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='rounded-full border-purple-800/30 bg-[#2d1155]/50 p-0' // p-0 to make image fit better
                    >
                      <Image
                        src={user?.avatar || '/mystical-forest-spirit.png'}
                        alt='Avatar'
                        width={36}
                        height={36}
                        className='rounded-full'
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48 bg-[#1a0d2e] border-purple-800/50 text-white'
                    align='end'
                  >
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer hover:bg-[#2d1155]/50 focus:bg-[#2d1155]/80'
                    >
                      <Link href='/profile'>Mon profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className='cursor-pointer hover:bg-[#2d1155]/50 focus:bg-[#2d1155]/80'
                    >
                      <Link href='/matches'>Mes matchs</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={logout}
                className='hidden md:flex'
              >
                Déconnexion
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className='h-5 w-5' />
                ) : (
                  <Menu className='h-5 w-5' />
                )}
              </Button>
            </div>
            {mobileMenuOpen && (
              <div className='fixed inset-0 bg-[#1a0d2e]/95 z-30 md:hidden pt-16'>
                <div className='container py-8 flex flex-col gap-4'>
                  <Link
                    href='/profile'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className='flex items-center gap-3 p-3 rounded-lg hover:bg-[#2d1155]/50'>
                      <Image
                        src={user?.avatar || '/mystical-forest-spirit.png'}
                        alt='Avatar'
                        width={40}
                        height={40}
                        className='rounded-full'
                      />
                      <div>
                        <p className='font-medium'>
                          {user?.name || 'Utilisateur'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Voir le profil
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className='space-y-1 mt-4'>
                    <Link
                      href='/discover'
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        pathname === '/discover'
                          ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                          : 'hover:bg-[#2d1155]/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Search className='h-5 w-5' />
                      <span>Découvrir</span>
                    </Link>
                    <Link
                      href='/matches'
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        pathname === '/matches'
                          ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                          : 'hover:bg-[#2d1155]/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className='h-5 w-5' />
                      <span>Matchs</span>
                    </Link>
                    <Link
                      href='/events'
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        pathname === '/events'
                          ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                          : 'hover:bg-[#2d1155]/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className='h-5 w-5' />
                      <span>Événements</span>
                    </Link>
                    <Link
                      href='/love-rooms'
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        pathname === '/love-rooms'
                          ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                          : 'hover:bg-[#2d1155]/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className='h-5 w-5' />
                      <span>Escapade</span>
                    </Link>
                    <Link
                      href='/messages'
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        pathname === '/messages'
                          ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                          : 'hover:bg-[#2d1155]/50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MessageCircle className='h-5 w-5' />
                      <span>Messages</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href='/admin'
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg',
                          pathname === '/admin'
                            ? 'bg-[#ff3b8b]/10 text-[#ff3b8b]'
                            : 'hover:bg-[#2d1155]/50'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className='h-5 w-5' />
                        <span>Admin</span>
                      </Link>
                    )}
                  </div>
                  <div className='mt-auto pt-4 border-t border-purple-800/30'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start'
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className='hidden md:flex items-center gap-4'>
              <Link href='/about'>
                <Button variant='ghost' size='sm'>
                  À propos
                </Button>
              </Link>
              <Link href='/events'>
                <Button variant='ghost' size='sm'>
                  Événements
                </Button>
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <Link href='/login'>
                <Button variant='ghost' size='sm'>
                  Connexion
                </Button>
              </Link>
              <Link href='/register'>
                <Button
                  className='bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 hover:opacity-90 text-white'
                  size='sm'
                >
                  Inscription
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

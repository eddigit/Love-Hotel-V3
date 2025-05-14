"use client"

import type React from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

interface MainLayoutProps {
  children: React.ReactNode
  session?: any
  user?: any
}

export default function MainLayout({ children, session, user }: MainLayoutProps) {
  return (
    <>
      <Header session={session} user={user} />
      <main>{children}</main>
      <Footer />
    </>
  )
}

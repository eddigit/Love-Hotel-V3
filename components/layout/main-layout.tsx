"use client"

import type React from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

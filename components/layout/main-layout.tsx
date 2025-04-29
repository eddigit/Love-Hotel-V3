import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

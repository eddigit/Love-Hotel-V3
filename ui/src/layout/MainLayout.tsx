import type React from "react"
import Header from "ui/src/components/Header"
import Footer from "ui/src/components/Footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AdminHeader({ user }: { user?: any }) {
  return (
    <div className="flex items-center justify-between mb-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold">Panneau d'administration</h1>
        <p className="text-muted-foreground">
          Bienvenue{user?.name ? `, ${user.name}` : ""}. Gérez votre application depuis ce panneau.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Retour au site</Link>
      </Button>
    </div>
  )
}

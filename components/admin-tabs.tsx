"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Événements", href: "/admin/events" },
  { label: "Utilisateurs", href: "/admin/users" },
  { label: "Paramètres", href: "/admin/options" },
  // Add more admin sections here as needed
  // { label: "Statistiques", href: "/admin/stats" },
]

export function AdminTabs() {
  const pathname = usePathname()
  return (
    <nav className="mb-8 border-b border-muted flex gap-4">
      {tabs.map(tab => {
        const isDashboard = tab.href === "/admin"
        const isActive = isDashboard
          ? pathname === "/admin"
          : pathname === tab.href || pathname.startsWith(tab.href + "/")
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
              isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

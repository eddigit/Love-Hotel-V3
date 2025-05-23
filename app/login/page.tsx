import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Connexion | Love Hotel Rencontre",
  description: "Connectez-vous à votre compte Love Hotel Rencontre",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-muted-foreground mt-2">Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <LoginForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Vous n&apos;avez pas de compte?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Inscrivez-vous
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

export default function TarifsPublicitePage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous pourriez ajouter la logique pour envoyer les données du formulaire
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  const selectPlan = (plan: string) => {
    setSelectedPlan(plan)
    // Faire défiler jusqu'au formulaire
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Nos tarifs d'espaces publicitaires</h1>

        <div className="bg-gradient-to-r from-purple-900 to-pink-800 text-white p-6 rounded-lg shadow-lg mb-10">
          <p className="text-xl mb-4 text-center">
            Choisissez la formule qui correspond le mieux à vos besoins et maximisez votre visibilité
          </p>
        </div>

        {/* Plans tarifaires */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Plan hebdomadaire */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-800 text-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Hebdomadaire</h2>
              <p className="text-4xl font-bold mb-4">
                499€<span className="text-lg font-normal">/semaine</span>
              </p>
              <p className="mb-6">Idéal pour les promotions ponctuelles et événements à court terme</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Visibilité sur toutes les pages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>8 400 impressions estimées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Rapport de performance</span>
                </li>
              </ul>

              <Button
                onClick={() => selectPlan("Hebdomadaire - 499€")}
                className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 rounded-full"
              >
                Sélectionner
              </Button>
            </div>
          </div>

          {/* Plan mensuel */}
          <div className="bg-gradient-to-r from-pink-800 to-purple-900 text-white rounded-xl shadow-lg overflow-hidden transform scale-105 z-10">
            <div className="bg-pink-600 text-white text-center py-2">
              <p className="font-semibold">PLUS POPULAIRE</p>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Mensuel</h2>
              <p className="text-4xl font-bold mb-4">
                1690€<span className="text-lg font-normal">/mois</span>
              </p>
              <p className="mb-6">Solution optimale pour une présence régulière et efficace</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Positionnement premium</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>36 000 impressions estimées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Rapports détaillés hebdomadaires</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Modification de visuel 1x/mois</span>
                </li>
              </ul>

              <Button
                onClick={() => selectPlan("Mensuel - 1690€")}
                className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 rounded-full"
              >
                Sélectionner
              </Button>
            </div>
          </div>

          {/* Plan annuel */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-800 text-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Annuel</h2>
              <p className="text-4xl font-bold mb-4">Nous contacter</p>
              <p className="mb-6">La solution la plus économique pour une présence continue</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Positionnement premium garanti</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>438 000 impressions estimées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Rapports détaillés mensuels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>Modification de visuel 1x/mois</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-pink-300" />
                  <span>2 mois offerts (inclus)</span>
                </li>
              </ul>

              <Button
                onClick={() => selectPlan("Annuel - Tarif personnalisé")}
                className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 rounded-full"
              >
                Sélectionner
              </Button>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div
          id="contact-form"
          className="bg-gradient-to-r from-pink-800 to-purple-900 text-white p-8 rounded-lg shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Contactez-nous pour réserver votre espace</h2>

          {formSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Demande envoyée avec succès !</h3>
              <p>Notre équipe vous contactera dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>

                <div>
                  <label htmlFor="plan" className="block mb-2">
                    Formule choisie
                  </label>
                  <Input
                    id="plan"
                    type="text"
                    value={selectedPlan || ""}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Sélectionnez une formule ci-dessus"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={4}
                  required
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Précisez vos besoins ou posez-nous vos questions"
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-white text-purple-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full"
                >
                  Envoyer ma demande
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Informations supplémentaires */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Besoin d'une solution personnalisée ?</h2>
          <p className="mb-6">
            Nous proposons également des formules sur mesure adaptées à vos besoins spécifiques. Contactez-nous
            directement pour discuter de votre projet.
          </p>
          <p className="font-semibold">Email: publicite@lovehotel.com | Tél: 01 23 45 67 89</p>
        </div>
      </div>
    </div>
  )
}

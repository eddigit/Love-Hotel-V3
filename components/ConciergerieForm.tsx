'use client'

import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function ConciergerieForm() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [besoin, setBesoin] = useState('')
  const [budget, setBudget] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(false)
    try {
      const res = await fetch('/api/conciergerie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, besoin, budget }),
      })
      if (res.ok) {
        setSubmitted(true)
        setNom('')
        setEmail('')
        setBesoin('')
        setBudget('')
      } else {
        console.error('Erreur API conciergerie', await res.text())
        alert("Une erreur est survenue, veuillez réessayer.")
      }
    } catch (err) {
      console.error('Erreur réseau conciergerie', err)
      alert("Impossible d'envoyer la demande, vérifiez votre connexion.")
    }
  }

  return (
    <section className="flex justify-center items-center py-12 px-2 md:px-0 w-full bg-transparent">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#2d1155]/90 to-[#3d1155]/90 border border-purple-700">
        {/* Image à gauche, responsive */}
        <div className="flex-1 flex items-center justify-center bg-[#2d1155] md:rounded-l-3xl md:rounded-r-none rounded-t-3xl md:rounded-t-none p-0 md:p-8">
          <img
            src="https://cdn.gamma.app/6ph0ks7uhahu5sl/generated-images/pV1oErVaeU-5Dcv3mCOK6.png"
            alt="Illustration conciergerie sur-mesure"
            className="w-full max-w-xs md:max-w-sm h-auto md:h-[480px] object-contain rounded-2xl shadow-xl border-4 border-white/40"
            style={{ background: '#fff' }}
          />
        </div>
        {/* Formulaire à droite */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-center p-6 md:p-10 bg-[#3d1155]/90 md:rounded-r-3xl md:rounded-l-none rounded-b-3xl md:rounded-b-none"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/90 rounded-full p-3 mb-2 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-1 text-center">Conciergerie sur-mesure</h2>
            <p className="text-muted-foreground text-center text-sm max-w-md">
              Notre équipe réalise vos envies les plus personnalisées. Remplissez ce formulaire, nous vous recontactons rapidement !
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-white/90 max-w-md">
              <li>Théâtre érotique privé</li>
              <li>Passage secret du restaurant à la Love Room</li>
              <li>Playlist sur mesure pour votre ambiance</li>
              <li>Repas de dégustation avec Love Room (sur réservation)</li>
              <li>Escapade en limousine à Paris (sur disponibilité)</li>
              <li>Accès à notre bar à fantasmes partenaire</li>
              <li>Entrée en club privatisé</li>
              <li>Hôtel 4★ & Love Room, suite appartement premium avec jacuzzi à Pigalle</li>
              <li>Solutions clés en main sur mesure</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="nom" className="block font-semibold mb-1 text-primary">Votre nom</label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                required
                className="w-full p-2 rounded-lg border border-purple-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                placeholder="Votre nom ou pseudo"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold mb-1 text-primary">Votre email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded-lg border border-purple-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                placeholder="Votre adresse email pour la réponse"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="besoin" className="block font-semibold mb-1 text-primary">Décrivez vos besoins ou envies</label>
            <textarea
              id="besoin"
              value={besoin}
              onChange={e => setBesoin(e.target.value)}
              required
              rows={5}
              className="w-full p-2 rounded-lg border border-purple-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/60 transition resize-none"
              placeholder="Exprimez ici vos besoins ou envies sur mesure…"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="budget" className="block font-semibold mb-1 text-primary">Budget (optionnel)</label>
            <input
              id="budget"
              type="text"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full p-2 rounded-lg border border-purple-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              placeholder="Ex : 100-200€"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-md hover:from-pink-600 hover:to-purple-700 transition"
          >
            Envoyer ma demande
          </button>
          {submitted && (
            <div className="text-green-600 mt-6 text-center font-semibold animate-fade-in">
              Merci, votre demande a bien été envoyée !
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

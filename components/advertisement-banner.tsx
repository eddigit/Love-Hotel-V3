"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

export function AdvertisementBanner() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>

      <div className="relative flex flex-col md:flex-row items-center">
        <div className="relative z-20 p-6 md:p-10 md:w-1/2 space-y-4">
          <h3 className="text-xl md:text-2xl font-medium">
            Vous aimez nos produits, nos valeurs, et découvrir de nouveaux produits ?
          </h3>
          <p className="text-lg md:text-xl">
            SKYN a pensé à vous et vous propose de devenir{" "}
            <span className="relative inline-block">
              <span className="font-bold">VOTRE PUB ICI</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400"></span>
            </span>
          </p>
          <p className="text-base md:text-lg">Trouvez une mission qui correspond à votre profil !</p>
          <Button
            variant="outline"
            className="mt-4 border-white text-white hover:bg-white hover:text-black transition-colors rounded-full px-8"
          >
            VOTRE PUB ICI
          </Button>
        </div>

        <div className="md:w-1/2 h-full">
          <div className="relative h-64 md:h-80 w-full">
            {!imageError ? (
              <Image
                src="/skyn-products-black-background.png"
                alt="Advertisement banner"
                fill
                className="object-contain object-right"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <p className="text-white text-center p-4">Produits SKYN</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

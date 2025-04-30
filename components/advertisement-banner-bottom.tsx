"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AdvertisementBannerBottom() {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl text-white shadow-xl"
      style={{
        backgroundImage: !imageError
          ? "url(https://sjc.microlink.io/tjLJXxJYdPG7_3ETE_Nzg8t6L1VTg5PUxeVCnbKxrbQuXVmh8sQafo0M1bIYBEHpY-mDfdkcQgWlrNXpwcBlWg.jpeg)"
          : "linear-gradient(to right, #000000, #111111)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "300px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>

      <div className="relative z-20 p-6 md:p-10 flex flex-col items-start justify-center h-full">
        <h3 className="text-xl md:text-2xl font-medium max-w-lg mb-4">
          Vous aimez nos produits, nos valeurs, et découvrir de nouveaux produits ?
        </h3>
        <p className="text-lg md:text-xl max-w-lg mb-2">
          SKYN a pensé à vous et vous propose de devenir{" "}
          <span className="relative inline-block">
            <span className="font-bold">VOTRE PUB ICI</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400"></span>
          </span>
        </p>
        <p className="text-base md:text-lg max-w-lg mb-6">Trouvez une mission qui correspond à votre profil !</p>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-black transition-colors rounded-full px-8"
          onClick={() => (window.location.href = "/publicite")}
        >
          VOTRE PUB ICI
        </Button>
      </div>
    </div>
  )
}

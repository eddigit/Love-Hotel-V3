"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MatchScore } from "@/components/match-score"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ProfileCardProps {
  name: string
  age: number
  location: string
  image: string
  online?: boolean
  featured?: boolean
  matchScore?: number
}

export function ProfileCard({ name, age, location, image, online, featured, matchScore }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false)

  // Vérifier si l'image est une URL externe
  const isExternalImage = image.startsWith("http")

  return (
    <Link href={`/profile/${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="overflow-hidden border-0 shadow-lg shadow-purple-900/20 bg-gradient-to-b from-[#2d1155]/90 to-[#1a0d2e]/90 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 transform hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4]">
            {isExternalImage ? (
              // Pour les images externes, utiliser un élément img standard
              <div className="w-full h-full relative">
                <img
                  src="https://t3.ftcdn.net/jpg/06/26/94/08/240_F_626940897_wwd1PzIV04U7EGesT81Csh8JEkDMqB7B.jpg"
                  alt={name}
                  className="w-full h-full object-cover absolute inset-0"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              // Pour les images locales, utiliser le composant Image de Next.js
              <Image
                src={image || "/placeholder.svg?height=500&width=400&query=person+silhouette"}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}

            {matchScore !== undefined && (
              <div className="absolute top-2 left-2">
                <MatchScore score={matchScore} />
              </div>
            )}
            {featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 border-0 flex items-center gap-1.5 text-xs">
                  <Star className="h-3 w-3 fill-white" />
                  VIP
                </Badge>
              </div>
            )}
            {online && (
              <Badge className="absolute bottom-2 right-2 bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                LIVE
              </Badge>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="font-bold text-white">
                {name}, {age}
              </h3>
              <p className="text-xs text-white/80">{location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

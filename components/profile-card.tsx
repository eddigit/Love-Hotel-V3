"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MatchScore } from "@/components/match-score"
import { Star, Heart, Flame } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ProfileCardProps {
  id: string
  name: string
  age: number
  location: string
  image: string
  online?: boolean
  featured?: boolean
  matchScore?: number
  popularity?: number // Added popularity prop
}

export function ProfileCard({ id, name, age, location, image, online, featured, matchScore, popularity }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false)

  const placeholderSrc = "/placeholder.svg?height=500&width=400&query=person+silhouette"

  // Determine the image source to use.
  // If an error occurred, use the placeholder.
  // Otherwise, use the provided image; if it's invalid (null, empty), also use the placeholder.
  let srcToUse = imageError ? placeholderSrc : (typeof image === 'string' && image ? image : placeholderSrc)

  // Check if the srcToUse (which might be the placeholder if original image failed) is an external URL.
  const isExternal = typeof srcToUse === 'string' && srcToUse.startsWith("http")

  const handleImageError = () => {
    if (!imageError) { // Prevent infinite loops if placeholder itself errors, though unlikely for local SVG
      setImageError(true)
    }
  }

  const imageAltText = `Photo de profil de ${name}, ${age} ans, ${location}`

  return (
    <Link href={`/profile/${id}`}>
      <Card className="overflow-hidden border-0 shadow-lg shadow-purple-900/20 bg-gradient-to-b from-[#2d1155]/90 to-[#1a0d2e]/90 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 transform hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4]">
            {isExternal ? (
              <img
                src={srcToUse} // Use the determined src, not hardcoded
                alt={imageAltText}
                className="w-full h-full object-cover" // Simplified className
                onError={handleImageError}
              />
            ) : (
              // For local images or if an external image failed (srcToUse is now placeholderSrc)
              <Image
                src={srcToUse} // Use the determined src
                alt={imageAltText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                onError={handleImageError} // Added onError for Next/Image
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
            {/* Popularity badge - shows only for profiles with 3+ matches */}
            {popularity !== undefined && popularity >= 3 && (
              <div className={`absolute ${featured ? 'top-10' : 'top-2'} right-2`}>
                <Badge
                  className={`
                    flex items-center gap-1.5 text-xs border-0
                    ${popularity >= 10
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                      : popularity >= 5
                        ? 'bg-gradient-to-r from-pink-400 to-pink-600'
                        : 'bg-gradient-to-r from-pink-300 to-pink-500'
                    }
                  `}
                >
                  <Flame className="h-3 w-3 fill-white" />
                  {popularity >= 10 ? 'Populaire' : popularity >= 5 ? 'Tendance' : 'En vue'}
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

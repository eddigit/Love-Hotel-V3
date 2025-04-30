"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProfileCardProps {
  name: string
  age: number
  location: string
  image: string
  online: boolean
}

export function ProfileCard({ name, age, location, image, online }: ProfileCardProps) {
  return (
    <Link href={`/profile/${name.toLowerCase()}`}>
      <Card className="profile-card group overflow-hidden card-hover border-0 shadow-lg shadow-purple-900/20">
        <div className="relative aspect-[3/4]">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d2e]/80 via-[#3d1155]/30 to-transparent"></div>

          {online && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="absolute top-2 right-2 z-10"
            >
              <Badge className="bg-gradient-to-r from-[#ff3b8b] to-[#ff8cc8] border-0 flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                LIVE
              </Badge>
            </motion.div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <div className="text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base sm:text-lg line-clamp-1">
                  {name}, {age}
                </h3>
                <div className="flex gap-1.5">
                  <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors touch-target">
                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                  </button>
                  <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors touch-target">
                    <Heart className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-1">{location}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

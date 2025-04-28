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
      <Card className="profile-card group overflow-hidden">
        <div className="relative aspect-[3/4]">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {online && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="absolute bottom-2 left-2 z-10"
            >
              <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                En ligne
              </Badge>
            </motion.div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 profile-card-content">
            <div className="text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {name}, {age}
                </h3>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <Heart className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/80">{location}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"

interface EventCardProps {
  title: string
  location: string
  date: string
  image: string
  attendees: number
}

export function EventCard({ title, location, date, image, attendees }: EventCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 sm:h-56">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div className="text-white">
            <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-y-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span>{attendees} participants</span>
          </div>
        </div>
        <Button className="w-full">Participer</Button>
      </CardContent>
    </Card>
  )
}

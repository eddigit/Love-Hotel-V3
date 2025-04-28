"use client"

import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { motion } from "framer-motion"
import { useNotifications } from "@/contexts/notification-context"
import { useState, useEffect } from "react"

export function NotificationsButton() {
  const { notifications, counts, markAsRead, markAllAsRead, addNotification } = useNotifications()
  const [newNotification, setNewNotification] = useState(false)

  useEffect(() => {
    // Simuler l'arrivée d'une nouvelle notification après 10 secondes
    const timer = setTimeout(() => {
      const newNotif = {
        id: `new-${Date.now()}`,
        type: "message" as const,
        title: "Nouveau message",
        description: "Vous avez reçu un nouveau message de Sophie",
        time: "À l'instant",
        read: false,
        image: "/serene-woman.png",
        link: "/messages/1",
      }

      addNotification(newNotif)
      setNewNotification(true)

      // Réinitialiser l'animation après 2 secondes
      setTimeout(() => {
        setNewNotification(false)
      }, 2000)
    }, 10000)

    return () => clearTimeout(timer)
  }, [addNotification])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  return (
    <motion.div
      animate={
        newNotification
          ? {
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
    >
      <NotificationsDropdown
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </motion.div>
  )
}

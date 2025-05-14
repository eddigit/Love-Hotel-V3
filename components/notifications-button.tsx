"use client"

import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { motion } from "framer-motion"
import { useNotifications } from "@/contexts/notification-context"
import { useState } from "react"

export function NotificationsButton() {
  const { notifications, counts, markAsRead, markAllAsRead } = useNotifications()
  const [newNotification, setNewNotification] = useState(false)

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

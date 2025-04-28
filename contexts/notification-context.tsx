"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getNotifications } from "@/app/actions"
import type { Notification } from "@/components/notifications-dropdown"

type NotificationCounts = {
  total: number
  messages: number
  events: number
  likes: number
  matches: number
}

type NotificationContextType = {
  notifications: Notification[]
  counts: NotificationCounts
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [counts, setCounts] = useState<NotificationCounts>({
    total: 0,
    messages: 0,
    events: 0,
    likes: 0,
    matches: 0,
  })

  useEffect(() => {
    async function loadNotifications() {
      try {
        const { notifications } = await getNotifications()
        setNotifications(notifications)
      } catch (error) {
        console.error("Failed to load notifications:", error)
      }
    }

    loadNotifications()
  }, [])

  // Mettre à jour les compteurs chaque fois que les notifications changent
  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read)

    setCounts({
      total: unreadNotifications.length,
      messages: unreadNotifications.filter((n) => n.type === "message").length,
      events: unreadNotifications.filter((n) => n.type === "event").length,
      likes: unreadNotifications.filter((n) => n.type === "like").length,
      matches: unreadNotifications.filter((n) => n.type === "match").length,
    })
  }, [notifications])

  // Update the markAsRead function to avoid unnecessary re-renders
  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      // Check if the notification exists and is not already read
      const notification = prev.find((n) => n.id === id)
      if (!notification || notification.read) {
        return prev // Return the same array if no changes needed
      }

      // Only update if the notification exists and needs to be marked as read
      return prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        counts,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoolyyBWidget() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if the widget has been dismissed before
  useEffect(() => {
    const dismissed = localStorage.getItem("loolyyb-widget-dismissed")
    if (dismissed) {
      setIsDismissed(true)
    } else {
      // Show the widget after a delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Remember that the user dismissed the widget
    localStorage.setItem("loolyyb-widget-dismissed", "true")
    setTimeout(() => {
      setIsDismissed(true)
    }, 500)
  }

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="container mx-auto px-4 pb-4">
            <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-purple-900/30">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a0d2e] to-[#3d1155] z-0"></div>
              <div className="absolute inset-0 bg-[url('/purple-glow-pattern.png')] opacity-20 mix-blend-overlay z-0"></div>

              {/* Curved light effect */}
              <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#ff3b8b]/10 to-transparent"></div>
                <div className="absolute top-1/2 left-0 right-0 h-20 bg-[#4a2282]/20 blur-3xl transform -rotate-6"></div>
                <div className="absolute top-1/3 left-0 right-0 h-16 bg-[#ff3b8b]/20 blur-3xl transform rotate-3"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

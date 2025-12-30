"use client"

import type React from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = "919876543210"

  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank")
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="
        fixed
        bottom-24
        right-6
        z-50
        w-14
        h-14
        rounded-full
        bg-emerald-500
        hover:bg-emerald-600
        text-white
        shadow-xl
        shadow-emerald-500/40
        flex
        items-center
        justify-center
      "
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  )
}

export default FloatingWhatsApp

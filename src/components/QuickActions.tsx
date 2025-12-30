"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Plus, Building2, Calendar, MessageCircle, Phone, Heart, LogIn, TrendingUp, Mail } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { useNavigate } from "react-router-dom"

interface QuickActionsProps {
  onBookVisit: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onBookVisit }) => {
  const { isAdmin } = useApp()
  const navigate = useNavigate()

  const whatsappNumber = "919876543210"
  const phoneNumber = "+919876543210"

  const actions = [
    ...(isAdmin
      ? [
          {
            label: "Add Property",
            icon: Plus,
            onClick: () => navigate("/admin"),
            isPrimary: true,
          },
        ]
      : [
          {
            label: "Admin",
            icon: LogIn,
            onClick: () => navigate("/login"),
            isSecondary: true,
          },
        ]),
    {
      label: "Properties",
      icon: Building2,
      onClick: () => navigate("/properties"),
    },
    {
      label: "Book Visit",
      icon: Calendar,
      onClick: onBookVisit,
    },
    {
      label: "Calculator",
      icon: TrendingUp,
      onClick: () => navigate("/calculator"),
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      onClick: () => window.open(`https://wa.me/${whatsappNumber}`, "_blank"),
      isWhatsApp: true,
    },
    {
      label: "Call",
      icon: Phone,
      onClick: () => window.open(`tel:${phoneNumber}`, "_blank"),
    },
    {
      label: "Contact",
      icon: Mail,
      onClick: () => navigate("/contact"),
    },
    {
      label: "Favorites",
      icon: Heart,
      onClick: () => navigate("/favorites"),
    },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={action.onClick}
          className={`action-button text-xs sm:text-sm ${
            action.isPrimary
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : action.isWhatsApp
                ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500"
                : action.isSecondary
                  ? "bg-secondary/80 hover:bg-secondary text-muted-foreground border border-border/50"
                  : ""
          }`}
        >
          <action.icon className="w-5 sm:w-6 h-5 sm:h-6" />
          <span className="text-xs font-medium line-clamp-1">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default QuickActions

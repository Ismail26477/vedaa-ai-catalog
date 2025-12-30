"use client"

import type React from "react"
import { memo } from "react"
import { motion } from "framer-motion"
import { Building2, Sparkles, Calendar, Flame } from "lucide-react"
import { useApp } from "@/context/AppContext"

const DashboardStats: React.FC = memo(() => {
  const { properties, siteVisits } = useApp()

  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      icon: Building2,
      gradient: "from-violet-600/90 to-indigo-700/90",
      glow: "shadow-violet-500/30",
    },
    {
      label: "New Listings",
      value: properties.filter((p) => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return p.createdAt > oneWeekAgo
      }).length,
      icon: Sparkles,
      gradient: "from-emerald-500/90 to-teal-600/90",
      glow: "shadow-emerald-500/30",
    },
    {
      label: "Site Visits",
      value: siteVisits.filter((v) => v.status === "pending" || v.status === "confirmed").length,
      icon: Calendar,
      gradient: "from-sky-500/90 to-blue-600/90",
      glow: "shadow-sky-500/30",
    },
    {
      label: "Hot Deals",
      value: properties.filter((p) => p.status === "hot-deal").length,
      icon: Flame,
      gradient: "from-orange-500/90 to-red-600/90",
      glow: "shadow-orange-500/30",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <motion.div
          key={`stat-${stat.label}`}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full
            h-28 sm:h-32
            rounded-2xl
            bg-gradient-to-br ${stat.gradient}
            p-4
            text-white/80
            shadow-xl ${stat.glow}
            relative
            overflow-hidden
            will-change-transform
          `}
        >
          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative h-full flex flex-col justify-between">
            {/* Top row: Label + Icon */}
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-wider text-white/70 font-medium">{stat.label}</p>

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md flex-shrink-0">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Main value */}
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold leading-none tracking-tight">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
})

DashboardStats.displayName = "DashboardStats"

export default DashboardStats

"use client"

import type React from "react"
import { memo } from "react"
import { motion } from "framer-motion"
import { cities } from "@/data/properties"

interface CityTabsProps {
  selectedCity: string | null
  onSelectCity: (city: string | null) => void
}

const CityTabs: React.FC<CityTabsProps> = memo(({ selectedCity, onSelectCity }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCity(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
          selectedCity === null
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All Cities
      </motion.button>
      {cities.map((city, index) => (
        <motion.button
          key={city}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCity(city)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
            selectedCity === city
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {city}
        </motion.button>
      ))}
    </motion.div>
  )
})

CityTabs.displayName = "CityTabs"

export default CityTabs

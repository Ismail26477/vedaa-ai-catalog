"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { Property } from "@/data/properties"
import PropertyCard from "./PropertyCard"
import { useNavigate } from "react-router-dom"

interface PropertySectionProps {
  title: string
  properties: Property[]
  onViewProperty: (property: Property) => void
  viewAllLink?: string
}

const PropertySection: React.FC<PropertySectionProps> = ({ title, properties, onViewProperty, viewAllLink }) => {
  const navigate = useNavigate()

  if (properties.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="section-title text-foreground text-lg sm:text-xl md:text-2xl flex-1 truncate">{title}</h2>
        {viewAllLink && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-cols-max sm:auto-cols-fr">
          {properties.slice(0, 8).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="min-w-[calc(100vw-32px)] sm:min-w-0"
            >
              <PropertyCard property={property} onView={onViewProperty} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PropertySection

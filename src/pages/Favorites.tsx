"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import type { Property } from "@/data/properties"
import PropertyCard from "@/components/PropertyCard"
import PropertyDetailModal from "@/components/PropertyDetailModal"
import SiteVisitModal from "@/components/SiteVisitModal"
import { useState } from "react"

const Favorites: React.FC = () => {
  const navigate = useNavigate()
  const { properties, favorites } = useApp()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)

  const favoriteProperties = favorites.map((id) => properties.find((p) => p.id === id)).filter(Boolean) as Property[]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-semibold text-foreground flex-1">
            <Heart className="w-5 h-5 inline-block mr-2 text-red-500 fill-red-500" />
            Favorites
          </h1>
        </div>
      </div>

      {/* Properties */}
      <div className="p-4">
        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard
                  property={property}
                  onView={(p) => {
                    setSelectedProperty(p)
                    setIsDetailOpen(true)
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-6">Save properties you love to view them here</p>
            <button
              onClick={() => navigate("/properties")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>

      {/* Property Detail */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookVisit={() => {
          setIsDetailOpen(false)
          setIsVisitModalOpen(true)
        }}
      />

      {/* Site Visit Modal */}
      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        property={selectedProperty || undefined}
      />
    </div>
  )
}

export default Favorites

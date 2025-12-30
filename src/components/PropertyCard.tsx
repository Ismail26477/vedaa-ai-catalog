"use client"

import type React from "react"
import { forwardRef, memo } from "react"
import { motion } from "framer-motion"
import { Heart, Phone, MessageCircle, Eye, Bed, Bath, Maximize, Flame, MapPin } from "lucide-react"
import { type Property, formatPrice } from "@/data/properties"
import { useApp } from "@/context/AppContext"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  property: Property
  onView: (property: Property) => void
  index?: number
}

const getSafeImageUrl = (url?: string) => {
  if (!url || url.startsWith("blob:") || url.includes("/src/assets/")) {
    return "/placeholder.svg"
  }
  return url
}

const PropertyCard = memo(
  forwardRef<HTMLDivElement, PropertyCardProps>(({ property, onView, index = 0 }, ref) => {
    const { favorites, toggleFavorite } = useApp()
    const isFavorite = favorites.includes(property.id)

    const whatsappNumber = "919876543210"
    const phoneNumber = "+919876543210"

    const handleWhatsApp = (e: React.MouseEvent) => {
      e.stopPropagation()
      const message = encodeURIComponent(
        `Hi! I'm interested in ${property.title} in ${property.city} priced at ${formatPrice(property.price)}`,
      )
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
    }

    const handleCall = (e: React.MouseEvent) => {
      e.stopPropagation()
      window.open(`tel:${phoneNumber}`, "_blank")
    }

    const handleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleFavorite(property.id)
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -4 }}
        className="property-card cursor-pointer group overflow-hidden"
        onClick={() => onView(property)}
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-secondary">
          <img
            src={getSafeImageUrl(property.images[0]) || "/placeholder.svg"}
            alt={property.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          {/* Status Badge */}
          {property.status === "hot-deal" && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg">
              <Flame className="w-3 h-3 mr-1" />
              Hot Deal
            </Badge>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background shadow-lg"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </motion.button>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
              <p className="text-lg font-bold gold-text">{formatPrice(property.price)}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 bg-card">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 mb-1">{property.title}</h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{property.city}</span>
            <span className="mx-1">•</span>
            <span className="capitalize">{property.propertyType}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
              <Bed className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
              <Bath className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1">
              <Maximize className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{property.area} sqft</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Call</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">WhatsApp</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation()
                onView(property)
              }}
              className="flex items-center justify-center w-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98]"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }),
)

PropertyCard.displayName = "PropertyCard"

export default PropertyCard

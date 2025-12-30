"use client"

import React, { forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Wifi,
  Waves,
  Dumbbell,
  Shield,
  Trees,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { type Property, formatPrice } from "@/data/properties"
import { useApp } from "@/context/AppContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PropertyDetailProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onBookVisit: () => void
}

const amenityIcons: Record<string, React.ElementType> = {
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  Security: Shield,
  Garden: Trees,
  Wifi: Wifi,
}

const PropertyDetail = forwardRef<HTMLDivElement, PropertyDetailProps>(
  ({ property, isOpen, onClose, onBookVisit }, ref) => {
    const { favorites, toggleFavorite, addToRecentlyViewed } = useApp()
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

    React.useEffect(() => {
      if (property) {
        addToRecentlyViewed(property.id)
      }
    }, [property, addToRecentlyViewed]) // Fixed dependency

    if (!property) return null

    const isFavorite = favorites.includes(property.id)
    const whatsappNumber = "919876543210"
    const phoneNumber = "+919876543210"

    const handleWhatsApp = () => {
      const message = encodeURIComponent(
        `Hi! I'm interested in ${property.title} in ${property.city} priced at ${formatPrice(property.price)}`,
      )
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
    }

    const handleCall = () => {
      window.open(`tel:${phoneNumber}`, "_blank")
    }

    const handleShare = () => {
      const message = encodeURIComponent(
        `Check out this property: ${property.title} in ${property.city} - ${formatPrice(property.price)}`,
      )
      window.open(`https://wa.me/?text=${message}`, "_blank")
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Slider */}
            <div className="relative aspect-[4/3] sm:aspect-video">
              <img
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i === 0 ? property.images.length - 1 : i - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i + 1) % property.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Status Badge */}
              {property.status === "hot-deal" && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 border-0 text-sm">
                  🔥 Hot Deal
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-4 -mt-8 relative">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                {/* Price */}
                <p className="text-3xl font-bold gold-text mb-2">{formatPrice(property.price)}</p>

                {/* Title */}
                <h1 className="text-2xl font-display font-semibold text-foreground mb-2">{property.title}</h1>

                {/* Location */}
                <div className="flex items-center gap-1 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.city}</span>
                  <span className="mx-1">•</span>
                  <span className="capitalize">{property.propertyType}</span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-secondary rounded-xl p-3 text-center">
                    <Bed className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3 text-center">
                    <Bath className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-3 text-center">
                    <Maximize className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-semibold text-foreground">{property.area}</p>
                    <p className="text-xs text-muted-foreground">Sq.ft</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-foreground mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Shield
                      return (
                        <div
                          key={`${property.id}-amenity-${index}-${amenity}`}
                          className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5"
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mb-20">
                  <h3 className="font-display font-semibold text-foreground mb-3">Location</h3>
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">{property.city}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border">
              <div className="flex gap-3">
                <Button onClick={handleCall} variant="secondary" className="flex-1 h-12">
                  <Phone className="w-5 h-5 mr-2" />
                  Call
                </Button>
                <Button onClick={handleWhatsApp} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
                <Button onClick={onBookVisit} variant="default" className="flex-1 h-12">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Visit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  },
)

PropertyDetail.displayName = "PropertyDetail"

export default PropertyDetail

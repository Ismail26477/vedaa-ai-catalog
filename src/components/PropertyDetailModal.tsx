"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Car,
  Wifi,
  Waves,
  Dumbbell,
  Shield,
  Trees,
  Calendar,
  Heart,
} from "lucide-react"
import { type Property, formatPrice, getPropertyTypeIcon } from "@/data/properties"
import { useApp } from "@/context/AppContext"

interface PropertyDetailModalProps {
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
  "Rooftop Terrace": Home,
  "Private Elevator": Home,
  "Smart Home": Home,
  "Private Beach": Waves,
  "Infinity Pool": Waves,
  "Staff Quarters": Home,
  Helipad: Home,
  "High Ceilings": Home,
  "Open Layout": Home,
  "Rooftop Access": Home,
  "Modular Kitchen": Home,
  Spa: Waves,
  "Kids Play Area": Trees,
}

const getSafeImageUrl = (url?: string) => {
  if (!url || url.startsWith("blob:") || url.includes("/src/assets/")) {
    return "/placeholder.svg"
  }
  return url
}

export default function PropertyDetailModal({ property, isOpen, onClose, onBookVisit }: PropertyDetailModalProps) {
  const { favorites, toggleFavorite, addToRecentlyViewed } = useApp()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "location">("overview")

  React.useEffect(() => {
    if (property) {
      addToRecentlyViewed(property.id)
      setCurrentImageIndex(0)
    }
  }, [property, addToRecentlyViewed])

  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

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
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} in ${property.city}`,
        url: window.location.href,
      })
    } else {
      const message = encodeURIComponent(
        `Check out this property: ${property.title} in ${property.city} - ${formatPrice(property.price)}`,
      )
      window.open(`https://wa.me/?text=${message}`, "_blank")
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((i) => (i + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((i) => (i === 0 ? property.images.length - 1 : i - 1))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 top-0 md:inset-x-8 md:top-8 md:bottom-8 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full w-full max-w-6xl mx-auto bg-zinc-950 rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
              </button>

              <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                <div className="relative aspect-[16/9] md:aspect-video overflow-hidden">
                  {/* Image */}
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={getSafeImageUrl(property.images[currentImageIndex])}
                    alt={property.title}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent" />

                  {/* Image navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          prevImage()
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-all z-20 group"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          nextImage()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-all z-20 group"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {/* Image dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {property.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? "w-8 bg-white shadow-lg"
                                : "w-1.5 bg-white/40 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 md:p-10 lg:p-12 bg-zinc-950">
                  <div className="mb-8">
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight font-serif"
                    >
                      {property.title}
                    </motion.h1>
                    <div className="flex items-center gap-3 text-zinc-400 text-sm md:text-base mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-500" />
                        <span>{property.city}</span>
                      </div>
                      <span className="text-zinc-700">•</span>
                      <span className="capitalize flex items-center gap-2">
                        <span>{getPropertyTypeIcon(property.propertyType)}</span>
                        {property.propertyType}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1 font-bold">Price</div>
                      <div className="text-4xl md:text-5xl font-bold text-yellow-500">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 mb-8"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={onBookVisit}
                        className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl min-w-[160px] justify-center"
                      >
                        <Calendar className="w-5 h-5" />
                        Book Visit
                      </button>
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all border ${
                          isFavorite
                            ? "bg-red-500/10 border-red-500 text-red-500"
                            : "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white"
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCall}
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white transition-all"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Metadata row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-zinc-400">
                    <span className="text-emerald-500 font-semibold">95% Match</span>
                    <span className="px-2 py-0.5 border border-zinc-700 rounded text-xs">
                      {property.propertyType.toUpperCase()}
                    </span>
                    <span>{property.area} sqft</span>
                    <span className="px-2 py-0.5 border border-zinc-700 rounded text-xs">HD</span>
                  </div>

                  {/* Property specs */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{property.bedrooms}</div>
                        <div className="text-xs text-zinc-500">Bedrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Bath className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{property.bathrooms}</div>
                        <div className="text-xs text-zinc-500">Bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Maximize className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{property.area}</div>
                        <div className="text-xs text-zinc-500">Sq.ft</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-zinc-300 text-lg leading-relaxed">{property.description}</p>
                  </div>

                  {/* Cast/Agent info placeholder */}
                  <div className="mb-8">
                    <div className="text-sm text-zinc-400">
                      <span className="text-zinc-500">Agent:</span> Premium Property Consultants
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 border-b border-zinc-800 mb-6">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`pb-3 text-sm font-semibold transition-colors relative ${
                        activeTab === "overview" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      Overview
                      {activeTab === "overview" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("amenities")}
                      className={`pb-3 text-sm font-semibold transition-colors relative ${
                        activeTab === "amenities" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      Amenities
                      {activeTab === "amenities" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("location")}
                      className={`pb-3 text-sm font-semibold transition-colors relative ${
                        activeTab === "location" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      Location
                      {activeTab === "location" && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                        />
                      )}
                    </button>
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-4 text-zinc-300">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Property Type</h3>
                            <p className="capitalize">{property.propertyType}</p>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                            <p className="capitalize">{property.status.replace("-", " ")}</p>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Features</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {property.isFeatured && <li>Featured Property</li>}
                              {property.isPremium && <li>Premium Listing</li>}
                              {property.isBudgetFriendly && <li>Budget Friendly</li>}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "amenities" && (
                      <motion.div
                        key="amenities"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {property.amenities.map((amenity, idx) => {
                            const Icon = amenityIcons[amenity] || Shield
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-5 h-5 text-yellow-400" />
                                </div>
                                <span className="text-sm text-zinc-300">{amenity}</span>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "location" && (
                      <motion.div
                        key="location"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="aspect-video rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden">
                          <div className="text-center">
                            <MapPin className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-lg font-semibold">{property.city}</p>
                            <p className="text-zinc-600 text-sm mt-1">Map integration coming soon</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom spacing for scroll */}
                  <div className="h-20" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

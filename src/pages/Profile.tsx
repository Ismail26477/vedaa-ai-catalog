"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Heart, Search, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import type { Property } from "@/data/properties"
import PropertyCard from "@/components/PropertyCard"
import PropertyDetailModal from "@/components/PropertyDetailModal"

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { favorites, properties, isAdmin, setIsAdmin } = useApp()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"favorites" | "searches">("favorites")

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id))

  const handleLogout = () => {
    setIsAdmin(false)
    navigate("/")
  }

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
          <h1 className="text-xl font-display font-semibold text-foreground flex-1">My Profile</h1>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center hover:bg-destructive/30 transition-colors"
          >
            <LogOut className="w-5 h-5 text-destructive" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pb-4">
          {[
            { id: "favorites", label: "Favorites", icon: Heart },
            { id: "searches", label: "Saved Searches", icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as "favorites" | "searches")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-6xl mx-auto">
        {activeTab === "favorites" && (
          <div>
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
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No favorite properties yet</p>
                <button
                  onClick={() => navigate("/properties")}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "searches" && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No saved searches yet</p>
            <button
              onClick={() => navigate("/properties")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create a Search
            </button>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookVisit={() => {
          setIsDetailOpen(false)
        }}
      />
    </div>
  )
}

export default Profile

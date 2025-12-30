"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useApp } from "@/context/AppContext"
import type { Property } from "@/data/properties"
import DashboardStats from "@/components/DashboardStats"
import QuickActions from "@/components/QuickActions"
import PropertySection from "@/components/PropertySection"
import CityTabs from "@/components/CityTabs"
import SearchBar from "@/components/SearchBar"
import SiteVisitModal from "@/components/SiteVisitModal"
import PropertyDetailModal from "@/components/PropertyDetailModal"
import FloatingWhatsApp from "@/components/FloatingWhatsApp"
import { Settings, User, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import heroImage from "@/assets/hero-property.jpg"
import { getTimestamp } from "@/lib/dateUtils"

const Index: React.FC = () => {
  const { properties, recentlyViewed, isAdmin } = useApp()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const filteredProperties = selectedCity ? properties.filter((p) => p.city === selectedCity) : properties

  const featuredProperties = filteredProperties.filter((p) => p.isFeatured)
  const latestProperties = [...filteredProperties].sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
  const budgetProperties = filteredProperties.filter((p) => p.isBudgetFriendly)
  const premiumProperties = filteredProperties.filter((p) => p.isPremium)
  const recentlyViewedProperties = recentlyViewed
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean) as Property[]

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
    setIsDetailOpen(true)
  }

  const handleBookVisit = () => {
    setIsVisitModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-40 sm:h-56 md:h-64 overflow-hidden">
        <img src={heroImage || "/placeholder.svg"} alt="Luxury Real Estate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        {/* Header Actions */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground">
              <span className="gold-text">Veda</span> Ai
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <Settings className="w-5 h-5 text-foreground" />
              </button>
            )}
            <button
              onClick={() => navigate("/login")}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-3 bg-card/95 backdrop-blur-lg rounded-xl border border-border p-3 gap-2 flex flex-col z-30 min-w-[150px] shadow-lg"
          >
            {isAdmin && (
              <button
                onClick={() => {
                  navigate("/admin")
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            )}
            <button
              onClick={() => {
                navigate("/login")
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              Account
            </button>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 md:px-6 -mt-4 relative z-10 pb-20 max-w-6xl mx-auto">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar onSelectProperty={handleViewProperty} />
        </motion.div>

        {/* Dashboard Stats */}
        <section className="mb-6">
          <DashboardStats />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="section-title text-foreground mb-4 text-lg sm:text-xl">Quick Actions</h2>
          <QuickActions onBookVisit={handleBookVisit} />
        </section>

        {/* City Tabs */}
        <section className="mb-6">
          <h2 className="section-title text-foreground mb-4 text-lg sm:text-xl">Browse by City</h2>
          <CityTabs selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </section>

        {/* Property Sections */}
        {featuredProperties.length > 0 && (
          <PropertySection
            title="Featured Properties"
            properties={featuredProperties}
            onViewProperty={handleViewProperty}
            viewAllLink="/properties?filter=featured"
          />
        )}

        <PropertySection
          title="Latest Listings"
          properties={latestProperties}
          onViewProperty={handleViewProperty}
          viewAllLink="/properties?filter=latest"
        />

        {budgetProperties.length > 0 && (
          <PropertySection
            title="Budget Friendly"
            properties={budgetProperties}
            onViewProperty={handleViewProperty}
            viewAllLink="/properties?filter=budget"
          />
        )}

        {premiumProperties.length > 0 && (
          <PropertySection
            title="Premium Properties"
            properties={premiumProperties}
            onViewProperty={handleViewProperty}
            viewAllLink="/properties?filter=premium"
          />
        )}

        {recentlyViewedProperties.length > 0 && (
          <PropertySection
            title="Recently Viewed"
            properties={recentlyViewedProperties}
            onViewProperty={handleViewProperty}
          />
        )}
      </div>

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Site Visit Modal */}
      <SiteVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        property={selectedProperty || undefined}
      />

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBookVisit={() => {
          setIsDetailOpen(false)
          setIsVisitModalOpen(true)
        }}
      />
    </div>
  )
}

export default Index

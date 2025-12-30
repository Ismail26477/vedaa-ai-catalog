"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Search, GitCompare } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import type { Property } from "@/data/properties"
import PropertyCard from "@/components/PropertyCard"
import PropertyDetailModal from "@/components/PropertyDetailModal"
import SiteVisitModal from "@/components/SiteVisitModal"
import CityTabs from "@/components/CityTabs"
import AdvancedFilters, { type FilterOptions } from "@/components/AdvancedFilters"
import PropertyCompare from "@/components/PropertyCompare"
import { getTimestamp } from "@/lib/dateUtils"

const Properties: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const filter = searchParams.get("filter")
  const { properties } = useApp()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)
  const [compareProperties, setCompareProperties] = useState<Property[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({})

  const filteredProperties = useMemo(() => {
    let result = properties

    // Apply URL filter
    if (filter === "featured") {
      result = result.filter((p) => p.isFeatured)
    } else if (filter === "latest") {
      result = [...result].sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
    } else if (filter === "budget") {
      result = result.filter((p) => p.isBudgetFriendly)
    } else if (filter === "premium") {
      result = result.filter((p) => p.isPremium)
    }

    // Apply advanced filters
    if (filterOptions.priceMin) {
      result = result.filter((p) => p.price >= filterOptions.priceMin!)
    }
    if (filterOptions.priceMax) {
      result = result.filter((p) => p.price <= filterOptions.priceMax!)
    }
    if (filterOptions.bedrooms) {
      result = result.filter((p) => p.bedrooms >= filterOptions.bedrooms!)
    }
    if (filterOptions.bathrooms) {
      result = result.filter((p) => p.bathrooms >= filterOptions.bathrooms!)
    }
    if (filterOptions.propertyType) {
      result = result.filter((p) => p.propertyType === filterOptions.propertyType)
    }
    if (filterOptions.status) {
      result = result.filter((p) => p.status === filterOptions.status)
    }
    if (filterOptions.areaMin) {
      result = result.filter((p) => p.area >= filterOptions.areaMin!)
    }
    if (filterOptions.areaMax) {
      result = result.filter((p) => p.area <= filterOptions.areaMax!)
    }

    // Apply city filter
    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity)
    } else if (filterOptions.city) {
      result = result.filter((p) => p.city === filterOptions.city)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.propertyType.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      )
    }

    return result
  }, [properties, filter, filterOptions, selectedCity, searchQuery])

  const getTitle = () => {
    switch (filter) {
      case "featured":
        return "Featured Properties"
      case "latest":
        return "Latest Listings"
      case "budget":
        return "Budget Friendly"
      case "premium":
        return "Premium Properties"
      default:
        return "All Properties"
    }
  }

  const toggleCompare = (property: Property) => {
    setCompareProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id)
      if (exists) {
        return prev.filter((p) => p.id !== property.id)
      } else if (prev.length < 3) {
        return [...prev, property]
      }
      return prev
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 p-3 sm:p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-display font-semibold text-foreground flex-1 truncate">
            {getTitle()}
          </h1>
          {compareProperties.length > 0 && (
            <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
              <GitCompare className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">{compareProperties.length}</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>

        {/* City Tabs */}
        <div className="pb-3 sm:pb-4">
          <CityTabs selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </div>

        {/* Advanced Filters */}
        <div className="px-3 sm:px-4 pb-4">
          <AdvancedFilters onFilter={setFilterOptions} properties={properties} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 max-w-7xl mx-auto">
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">{filteredProperties.length} properties found</p>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {compareProperties.length > 0 && (
                <button
                  onClick={() => toggleCompare(property)}
                  className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    compareProperties.find((p) => p.id === property.id)
                      ? "bg-primary border-primary"
                      : "border-border bg-card/50 hover:bg-card"
                  }`}
                >
                  {compareProperties.find((p) => p.id === property.id) && (
                    <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )}
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

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        )}

        {/* Comparison Section */}
        {compareProperties.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <PropertyCompare properties={compareProperties} onClose={() => setCompareProperties([])} />
          </motion.div>
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

export default Properties

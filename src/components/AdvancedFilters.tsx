"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Filter, X } from "lucide-react"
import type { Property } from "@/data/properties"

interface AdvancedFiltersProps {
  onFilter: (filters: FilterOptions) => void
  properties: Property[]
}

export interface FilterOptions {
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  city?: string
  areaMin?: number
  areaMax?: number
  status?: string
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilter, properties }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({})

  // Get unique values for filters
  const cities = Array.from(new Set(properties.map((p) => p.city)))
  const propertyTypes = Array.from(new Set(properties.map((p) => p.propertyType)))
  const statuses = Array.from(new Set(properties.map((p) => p.status)))

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilter({})
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary border border-border hover:bg-secondary/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <span className="font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg p-4 shadow-lg z-50 space-y-4 max-h-96 overflow-y-auto"
          >
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ""}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ""}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms || ""}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+ Bedrooms
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Property Type</label>
              <select
                value={filters.propertyType || ""}
                onChange={(e) => handleFilterChange("propertyType", e.target.value || undefined)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold mb-2">City</label>
              <select
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value || undefined)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedFilters

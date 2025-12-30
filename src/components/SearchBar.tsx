"use client"

import type React from "react"
import { useState, useEffect, useRef, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, MapPin, Building2 } from "lucide-react"
import type { Property } from "@/data/properties"
import { formatPrice } from "@/data/properties"
import { useApp } from "@/context/AppContext"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchBarProps {
  onSelectProperty: (property: Property) => void
}

const SearchBar: React.FC<SearchBarProps> = memo(({ onSelectProperty }) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Property[]>([])
  const { properties } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const searchQuery = debouncedQuery.toLowerCase()
      const filtered = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery) ||
          p.city.toLowerCase().includes(searchQuery) ||
          p.propertyType.toLowerCase().includes(searchQuery),
      )
      setResults(filtered.slice(0, 5))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery, properties])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (property: Property) => {
    onSelectProperty(property)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search properties or cities..."
        className="
          w-full
          h-12
          pl-12
          pr-10
          rounded-xl
          bg-card
          border
          border-border
          text-foreground
          placeholder:text-muted-foreground
          shadow-sm
          transition-all
          focus:outline-none
          focus:border-primary
          focus:ring-2
          focus:ring-primary/30
        "
      />

      {query && (
        <button
          onClick={() => {
            setQuery("")
            setIsOpen(false)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="
              absolute
              top-full
              left-0
              right-0
              mt-3
              bg-card
              border
              border-border
              rounded-2xl
              shadow-xl
              overflow-hidden
              z-50
            "
          >
            {results.map((property, index) => (
              <motion.button
                key={property.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(property)}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-secondary
                  transition-colors
                  border-b border-border/30 last:border-b-0
                "
              >
                <img
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{property.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{property.city}</span>
                    <span>•</span>
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="capitalize truncate">{property.propertyType}</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-primary whitespace-nowrap flex-shrink-0">
                  {formatPrice(property.price)}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

SearchBar.displayName = "SearchBar"

export default SearchBar

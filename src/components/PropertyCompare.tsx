"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X, Check } from "lucide-react"
import { type Property, formatPrice } from "@/data/properties"

interface PropertyCompareProps {
  properties: Property[]
  onClose: () => void
}

const PropertyCompare: React.FC<PropertyCompareProps> = ({ properties, onClose }) => {
  if (properties.length === 0) return null

  const specs = [
    { label: "Price", key: "price" },
    { label: "Bedrooms", key: "bedrooms" },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Area (sqft)", key: "area" },
    { label: "Property Type", key: "propertyType" },
    { label: "Status", key: "status" },
    { label: "Featured", key: "isFeatured" },
    { label: "Premium", key: "isPremium" },
    { label: "Budget Friendly", key: "isBudgetFriendly" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 md:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Property Comparison</h3>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-semibold sticky left-0 bg-card z-10">Feature</th>
              {properties.map((property) => (
                <th key={property.id} className="text-center py-3 px-2 min-w-[150px]">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="text-xs font-medium line-clamp-2">{property.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, idx) => (
              <tr key={spec.key} className={`border-b border-border/50 ${idx % 2 === 0 ? "bg-secondary/20" : ""}`}>
                <td className="py-3 px-2 font-medium sticky left-0 bg-card/80 backdrop-blur-sm">{spec.label}</td>
                {properties.map((property) => (
                  <td key={property.id} className="text-center py-3 px-2">
                    {spec.key === "price" && formatPrice((property as any)[spec.key])}
                    {spec.key === "area" && `${(property as any)[spec.key]} sqft`}
                    {(spec.key === "isFeatured" || spec.key === "isPremium" || spec.key === "isBudgetFriendly") &&
                      ((property as any)[spec.key] ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      ))}
                    {!["price", "area", "isFeatured", "isPremium", "isBudgetFriendly"].includes(spec.key) && (
                      <span>{String((property as any)[spec.key])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default PropertyCompare

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Property } from "@/data/properties"
import { api } from "@/lib/api"

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  propertyId?: string
  status: "raw" | "verified" | "site-visit-requested" | "site-visit-done" | "negotiation" | "deal-closed"
  requirementDetails?: {
    propertyType?: string
    transactionType?: string
    budgetRange?: { min: number; max: number }
    preferredLocations?: string[]
    city?: string
    areaRange?: { min: number; max: number }
    configuration?: string
    purpose?: string
    timeline?: string
    loanRequirement?: boolean
    specialNotes?: string
  }
  createdAt: Date
  visitDate?: Date
}

interface SiteVisit {
  id: string
  name: string
  phone: string
  propertyId: string
  date: Date
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
}

interface AppContextType {
  properties: Property[]
  favorites: string[]
  recentlyViewed: string[]
  leads: Lead[]
  siteVisits: SiteVisit[]
  isAdmin: boolean
  isLoadingProperties: boolean
  toggleFavorite: (propertyId: string) => void
  addToRecentlyViewed: (propertyId: string) => void
  addSiteVisit: (visit: Omit<SiteVisit, "id" | "createdAt" | "status">) => void
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Promise<void>
  login: (password: string) => boolean
  logout: () => void
  addProperty: (property: Omit<Property, "id" | "createdAt">) => void
  updateProperty: (id: string, property: Partial<Property>) => void
  deleteProperty: (id: string) => void
  updateLeadStatus: (id: string, status: Lead["status"]) => void
  updateSiteVisitStatus: (id: string, status: SiteVisit["status"]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const normalizeData = (data: any[]) => {
  return data.map((item) => ({
    ...item,
    id: item.id || item._id,
  }))
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(true)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites")
    return saved ? JSON.parse(saved) : []
  })
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentlyViewed")
    return saved ? JSON.parse(saved) : []
  })
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("isAdmin") === "true"
  })
  const [leads, setLeads] = useState<Lead[]>([])
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("[v0] Fetching properties from API...")
        const data = await api.getProperties()
        console.log("[v0] Properties loaded:", data.length)
        const normalizedData = data.map((prop: any) => ({
          ...prop,
          id: prop._id || prop.id,
          images: prop.images?.map((url: string) => (url.startsWith("blob:") ? "/placeholder.svg" : url)) || [
            "/placeholder.svg",
          ],
        }))
        setProperties(normalizedData)
      } catch (error) {
        console.error("[v0] Failed to fetch properties:", error)
      } finally {
        setIsLoadingProperties(false)
      }
    }
    fetchProperties()
  }, [])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log("[v0] Fetching leads from API...")
        const data = await api.getLeads()
        console.log("[v0] Leads loaded:", data.length)
        const normalizedData = data.map((lead: any) => ({
          ...lead,
          id: lead._id || lead.id,
        }))
        setLeads(normalizedData)
      } catch (error) {
        console.error("[v0] Failed to fetch leads:", error)
      }
    }
    if (isAdmin) {
      fetchLeads()
    }
  }, [isAdmin])

  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        console.log("[v0] Fetching site visits from API...")
        const data = await api.getSiteVisits()
        console.log("[v0] Site visits loaded:", data.length)
        const normalizedData = data.map((visit: any) => ({
          ...visit,
          id: visit._id || visit.id,
        }))
        setSiteVisits(normalizedData)
      } catch (error) {
        console.error("[v0] Failed to fetch site visits:", error)
      }
    }
    if (isAdmin) {
      fetchSiteVisits()
    }
  }, [isAdmin])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => (prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]))
  }

  const addToRecentlyViewed = (propertyId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== propertyId)
      return [propertyId, ...filtered].slice(0, 10)
    })
  }

  const addSiteVisit = async (visit: Omit<SiteVisit, "id" | "createdAt" | "status">) => {
    try {
      const newVisit = await api.createSiteVisit(visit)
      setSiteVisits((prev) => [normalizeData([newVisit])[0], ...prev])

      // Also add as a lead
      const newLead = await api.createLead({
        name: visit.name,
        phone: visit.phone,
        propertyId: visit.propertyId,
        status: "site-visit-requested",
        visitDate: visit.date,
      })
      setLeads((prev) => [normalizeData([newLead])[0], ...prev])
    } catch (error) {
      console.error("[v0] Failed to add site visit:", error)
    }
  }

  const addLead = async (lead: Omit<Lead, "id" | "createdAt">) => {
    try {
      console.log("[v0] Creating new lead:", lead)
      const newLead = await api.createLead(lead)
      const normalizedLead = {
        ...newLead,
        id: newLead._id || newLead.id,
      }
      console.log("[v0] Lead created successfully:", normalizedLead)
      setLeads((prev) => [normalizedLead, ...prev])
    } catch (error) {
      console.error("[v0] Failed to add lead:", error)
      throw error
    }
  }

  const login = (password: string): boolean => {
    if (password === "admin123") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  const addProperty = async (property: Omit<Property, "id" | "createdAt">) => {
    try {
      const newProperty = await api.createProperty(property)
      const normalizedProperty = {
        ...newProperty,
        id: newProperty._id || newProperty.id,
      }
      setProperties((prev) => [normalizedProperty, ...prev])
    } catch (error) {
      console.error("[v0] Failed to add property:", error)
    }
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const updatedProperty = await api.updateProperty(id, updates)
      const normalizedProperty = {
        ...updatedProperty,
        id: updatedProperty._id || updatedProperty.id,
      }
      setProperties((prev) => prev.map((p) => (p.id === id ? normalizedProperty : p)))
    } catch (error) {
      console.error("[v0] Failed to update property:", error)
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      await api.deleteProperty(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("[v0] Failed to delete property:", error)
    }
  }

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      const updatedLead = await api.updateLead(id, { status })
      const normalized = normalizeData([updatedLead])[0]
      setLeads((prev) => prev.map((l) => (l.id === id ? normalized : l)))
    } catch (error) {
      console.error("[v0] Failed to update lead status:", error)
    }
  }

  const updateSiteVisitStatus = async (id: string, status: SiteVisit["status"]) => {
    try {
      const updatedVisit = await api.updateSiteVisit(id, { status })
      const normalized = normalizeData([updatedVisit])[0]
      setSiteVisits((prev) => prev.map((v) => (v.id === id ? normalized : v)))
    } catch (error) {
      console.error("[v0] Failed to update site visit status:", error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        properties,
        favorites,
        recentlyViewed,
        leads,
        siteVisits,
        isAdmin,
        isLoadingProperties,
        toggleFavorite,
        addToRecentlyViewed,
        addSiteVisit,
        addLead,
        login,
        logout,
        addProperty,
        updateProperty,
        deleteProperty,
        updateLeadStatus,
        updateSiteVisitStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

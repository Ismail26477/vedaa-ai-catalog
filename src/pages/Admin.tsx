"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  Phone,
  MessageCircle,
  LogOut,
  Plus,
  FileText,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import { formatPrice } from "@/data/properties"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import AddPropertyModal from "@/components/AddPropertyModal"

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const {
    properties,
    leads,
    siteVisits,
    isAdmin,
    logout,
    deleteProperty,
    updateProperty,
    updateLeadStatus,
    updateSiteVisitStatus,
  } = useApp()

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)
  const [selectedLeadRequirements, setSelectedLeadRequirements] = useState<string | null>(null) // State to toggle requirement details

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/login")
    }
  }, [isAdmin, navigate])

  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      icon: Building2,
      color: "from-primary to-gold-dark",
    },
    {
      label: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Site Visits",
      value: siteVisits.length,
      icon: Calendar,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "In Negotiation",
      value: leads.filter((l) => l.status === "negotiation").length,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      raw: "bg-gray-500",
      verified: "bg-blue-500",
      "site-visit-requested": "bg-yellow-500",
      "site-visit-done": "bg-emerald-500",
      negotiation: "bg-orange-500",
      "deal-closed": "bg-primary",
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      completed: "bg-emerald-500",
      cancelled: "bg-red-500",
      active: "bg-emerald-500",
      "hot-deal": "bg-orange-500",
      sold: "bg-gray-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const handleDeleteProperty = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty(id)
      toast({
        title: "Property Deleted",
        description: "The property has been removed.",
      })
    }
  }

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "hot-deal" : currentStatus === "hot-deal" ? "sold" : "active"
    updateProperty(id, { status: newStatus as any })
    toast({
      title: "Status Updated",
      description: `Property marked as ${newStatus}`,
    })
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
  }

  const getSafeImageUrl = (url?: string) => {
    if (!url || url.startsWith("blob:")) {
      return "/placeholder.svg"
    }
    return url
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-display font-semibold text-foreground truncate">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              size="sm"
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-foreground font-medium flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="flex-shrink-0">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="visits">Site Visits</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="space-y-3">
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={getSafeImageUrl(property.images?.[0]) || "/placeholder.svg"}
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-foreground truncate">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.city}</p>
                          <p className="text-sm font-semibold text-primary mt-1">{formatPrice(property.price)}</p>
                        </div>
                        <Badge
                          className={`${getStatusColor(property.status)} border-0 cursor-pointer`}
                          onClick={() => handleToggleStatus(property.id, property.status)}
                        >
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleStatus(property.id, property.status)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Change Status
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProperty(property.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="space-y-3">
              {leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      {lead.email && <p className="text-xs text-muted-foreground mt-0.5">{lead.email}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${getStatusColor(lead.status)} border-0`}>
                        {lead.status.replace("-", " ")}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        ID: {lead.id ? lead.id.slice(-6).toUpperCase() : "N/A"}
                      </span>
                    </div>
                  </div>

                  {lead.requirementDetails && (
                    <div className="mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-primary hover:text-primary/80 p-0"
                        onClick={() =>
                          setSelectedLeadRequirements(selectedLeadRequirements === lead.id ? null : lead.id)
                        }
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {selectedLeadRequirements === lead.id ? "Hide Requirements" : "View Requirements"}
                      </Button>

                      {selectedLeadRequirements === lead.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border/50 text-xs space-y-2"
                        >
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <span className="text-muted-foreground block">Property Type</span>
                              <span className="font-medium">{lead.requirementDetails.propertyType || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Transaction</span>
                              <span className="font-medium">{lead.requirementDetails.transactionType || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Budget Range</span>
                              <span className="font-medium text-primary">
                                {lead.requirementDetails.budgetRange?.min && lead.requirementDetails.budgetRange?.max
                                  ? `₹${lead.requirementDetails.budgetRange.min} - ${lead.requirementDetails.budgetRange.max} Lakhs`
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Timeline</span>
                              <span className="font-medium">{lead.requirementDetails.timeline || "N/A"}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground block">Locations</span>
                              <span className="font-medium">
                                {lead.requirementDetails.preferredLocations?.join(", ") ||
                                  lead.requirementDetails.city ||
                                  "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Configuration</span>
                              <span className="font-medium">{lead.requirementDetails.configuration || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block">Loan Required</span>
                              <span className="font-medium">
                                {lead.requirementDetails.loanRequirement ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                          {lead.requirementDetails.specialNotes && (
                            <div className="pt-1 border-t border-border/30">
                              <span className="text-muted-foreground block">Notes</span>
                              <p className="italic text-foreground/80">{lead.requirementDetails.specialNotes}</p>
                            </div>
                          )}
                          <div className="pt-1 text-[10px] text-muted-foreground">
                            Source: {lead.source || "Website"} | Added: {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.open(`tel:${lead.phone}`, "_blank")}>
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500"
                      onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank")}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className="flex-1 h-9 px-3 text-sm rounded-md bg-secondary border border-border text-foreground"
                    >
                      <option value="raw">Raw Lead</option>
                      <option value="verified">Verified</option>
                      <option value="site-visit-requested">Site Visit Requested</option>
                      <option value="site-visit-done">Site Visit Done</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="deal-closed">Deal Closed</option>
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Site Visits Tab */}
          <TabsContent value="visits">
            <div className="space-y-3">
              {siteVisits.map((visit) => {
                const property = properties.find((p) => p.id === visit.propertyId)
                const visitDate = typeof visit.date === "string" ? new Date(visit.date) : visit.date
                return (
                  <motion.div
                    key={visit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{visit.name}</h3>
                        <p className="text-sm text-muted-foreground">{visit.phone}</p>
                        {property && <p className="text-sm text-primary mt-1">{property.title}</p>}
                      </div>
                      <Badge className={`${getStatusColor(visit.status)} border-0`}>{visit.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">📅 {visitDate.toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => window.open(`tel:${visit.phone}`, "_blank")}>
                        <Phone className="w-4 h-4" />
                      </Button>
                      <select
                        value={visit.status}
                        onChange={(e) => updateSiteVisitStatus(visit.id, e.target.value as any)}
                        className="flex-1 h-9 px-3 text-sm rounded-md bg-secondary border border-border text-foreground"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddPropertyModal isOpen={isAddPropertyModalOpen} onClose={() => setIsAddPropertyModalOpen(false)} />
    </div>
  )
}

export default Admin

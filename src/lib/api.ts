const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const api = {
  // Properties
  getProperties: async () => {
    const response = await fetch(`${API_URL}/properties`)
    if (!response.ok) throw new Error("Failed to fetch properties")
    return response.json()
  },

  getProperty: async (id: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`)
    if (!response.ok) throw new Error("Failed to fetch property")
    return response.json()
  },

  createProperty: async (property: any) => {
    const response = await fetch(`${API_URL}/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    })
    if (!response.ok) throw new Error("Failed to create property")
    return response.json()
  },

  updateProperty: async (id: string, updates: any) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update property")
    return response.json()
  },

  deleteProperty: async (id: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete property")
    return response.json()
  },

  // Leads
  getLeads: async () => {
    const response = await fetch(`${API_URL}/leads`)
    if (!response.ok) throw new Error("Failed to fetch leads")
    return response.json()
  },

  createLead: async (lead: any) => {
    const response = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
    if (!response.ok) throw new Error("Failed to create lead")
    return response.json()
  },

  updateLead: async (id: string, updates: any) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update lead")
    return response.json()
  },

  // Site Visits
  getSiteVisits: async () => {
    const response = await fetch(`${API_URL}/site-visits`)
    if (!response.ok) throw new Error("Failed to fetch site visits")
    return response.json()
  },

  createSiteVisit: async (visit: any) => {
    const response = await fetch(`${API_URL}/site-visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit),
    })
    if (!response.ok) throw new Error("Failed to create site visit")
    return response.json()
  },

  updateSiteVisit: async (id: string, updates: any) => {
    const response = await fetch(`${API_URL}/site-visits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update site visit")
    return response.json()
  },
}

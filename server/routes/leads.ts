import express from "express"
import Lead from "../models/Lead.js"

const router = express.Router()

// Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().populate("propertyId").sort({ createdAt: -1 })
    res.json(leads)
  } catch (error) {
    console.error("[v0] Error fetching leads:", error)
    res.status(500).json({ error: "Failed to fetch leads" })
  }
})

// Create lead
router.post("/", async (req, res) => {
  try {
    const lead = new Lead(req.body)
    await lead.save()
    res.status(201).json(lead)
  } catch (error) {
    console.error("[v0] Error creating lead:", error)
    res.status(500).json({ error: "Failed to create lead" })
  }
})

// Update lead
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" })
    }
    res.json(lead)
  } catch (error) {
    console.error("[v0] Error updating lead:", error)
    res.status(500).json({ error: "Failed to update lead" })
  }
})

// Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id)
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" })
    }
    res.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting lead:", error)
    res.status(500).json({ error: "Failed to delete lead" })
  }
})

export default router

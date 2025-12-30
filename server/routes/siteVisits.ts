import express from "express"
import SiteVisit from "../models/SiteVisit.js"

const router = express.Router()

// Get all site visits
router.get("/", async (req, res) => {
  try {
    const visits = await SiteVisit.find().populate("propertyId").sort({ date: 1 })
    res.json(visits)
  } catch (error) {
    console.error("[v0] Error fetching site visits:", error)
    res.status(500).json({ error: "Failed to fetch site visits" })
  }
})

// Create site visit
router.post("/", async (req, res) => {
  try {
    const visit = new SiteVisit(req.body)
    await visit.save()
    res.status(201).json(visit)
  } catch (error) {
    console.error("[v0] Error creating site visit:", error)
    res.status(500).json({ error: "Failed to create site visit" })
  }
})

// Update site visit
router.put("/:id", async (req, res) => {
  try {
    const visit = await SiteVisit.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!visit) {
      return res.status(404).json({ error: "Site visit not found" })
    }
    res.json(visit)
  } catch (error) {
    console.error("[v0] Error updating site visit:", error)
    res.status(500).json({ error: "Failed to update site visit" })
  }
})

// Delete site visit
router.delete("/:id", async (req, res) => {
  try {
    const visit = await SiteVisit.findByIdAndDelete(req.params.id)
    if (!visit) {
      return res.status(404).json({ error: "Site visit not found" })
    }
    res.json({ message: "Site visit deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting site visit:", error)
    res.status(500).json({ error: "Failed to delete site visit" })
  }
})

export default router

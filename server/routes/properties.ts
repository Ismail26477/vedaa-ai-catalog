import express from "express"
import Property from "../models/Property.js"

const router = express.Router()

// Get all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 })
    res.json(properties)
  } catch (error) {
    console.error("[v0] Error fetching properties:", error)
    res.status(500).json({ error: "Failed to fetch properties" })
  }
})

// Get single property
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }
    res.json(property)
  } catch (error) {
    console.error("[v0] Error fetching property:", error)
    res.status(500).json({ error: "Failed to fetch property" })
  }
})

// Create property
router.post("/", async (req, res) => {
  try {
    console.log("[v0] Received property data:", req.body)

    if (!req.body.title || !req.body.city || req.body.price === undefined || req.body.area === undefined) {
      console.error("[v0] Missing required fields:", req.body)
      return res.status(400).json({ error: "Missing required fields: title, city, price, and area are required" })
    }

    const property = new Property(req.body)
    const savedProperty = await property.save()

    console.log("[v0] Property created successfully:", savedProperty._id)
    res.status(201).json(savedProperty)
  } catch (error) {
    console.error("[v0] Error creating property:", error)
    res.status(500).json({ error: "Failed to create property", details: String(error) })
  }
})

// Update property
router.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }
    res.json(property)
  } catch (error) {
    console.error("[v0] Error updating property:", error)
    res.status(500).json({ error: "Failed to update property" })
  }
})

// Delete property
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id)
    if (!property) {
      return res.status(404).json({ error: "Property not found" })
    }
    res.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting property:", error)
    res.status(500).json({ error: "Failed to delete property" })
  }
})

export default router

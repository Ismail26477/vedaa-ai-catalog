"use client"

import type React from "react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { X, Plus, Upload } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Property, PropertyType, PropertyStatus } from "@/data/properties"

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addProperty } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    city: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "apartment" as PropertyType,
    status: "active" as PropertyStatus,
    description: "",
    amenities: "",
    images: "",
    isFeatured: false,
    isPremium: false,
    isBudgetFriendly: false,
  })

  const [locationData, setLocationData] = useState({
    lat: "0",
    lng: "0",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newFiles = [...imageFiles, ...files]
      setImageFiles(newFiles)

      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])

      console.log("[v0] Selected images:", newFiles.length)
    }
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.price || !formData.city || !formData.area) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a production environment, this is where you would perform the actual file upload to a server
      const propertyImages =
        imagePreviews.length > 0
          ? imagePreviews.map((url, i) =>
              url.startsWith("blob:") ? `/placeholder.svg?height=800&width=1200&query=property-${i}` : url,
            )
          : ["/placeholder.svg"]

      const newProperty: Omit<Property, "id" | "createdAt"> = {
        title: formData.title,
        price: Number.parseFloat(formData.price),
        city: formData.city,
        area: Number.parseFloat(formData.area),
        bedrooms: Number.parseInt(formData.bedrooms) || 1,
        bathrooms: Number.parseInt(formData.bathrooms) || 1,
        propertyType: formData.propertyType,
        status: formData.status,
        description: formData.description,
        images: propertyImages,
        amenities: formData.amenities ? formData.amenities.split(",").map((a) => a.trim()) : [],
        isFeatured: formData.isFeatured,
        isPremium: formData.isPremium,
        isBudgetFriendly: formData.isBudgetFriendly,
        location: {
          lat: Number.parseFloat(locationData.lat) || 0,
          lng: Number.parseFloat(locationData.lng) || 0,
        },
      }

      console.log("[v0] Adding property:", newProperty)
      await addProperty(newProperty)

      toast({
        title: "Success",
        description: "Property added successfully!",
      })

      setFormData({
        title: "",
        price: "",
        city: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        propertyType: "apartment",
        status: "active",
        description: "",
        amenities: "",
        images: "",
        isFeatured: false,
        isPremium: false,
        isBudgetFriendly: false,
      })
      setImageFiles([])
      setImagePreviews([])
      setLocationData({ lat: "0", lng: "0" })

      onClose()
    } catch (error) {
      console.error("[v0] Error adding property:", error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-background border border-border shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur p-6">
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Add New Property</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Property Title *</label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Luxury Apartment in Downtown"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price (₹) *</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="8500000"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Area (sq ft) *</label>
                <Input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="2200"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleSelectChange("propertyType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="3"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Status & Tags */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Status & Tags</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hot-deal">Hot Deal</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Premium</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBudgetFriendly"
                  checked={formData.isBudgetFriendly}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Budget Friendly</span>
              </label>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Details</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the property..."
                className="w-full min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amenities (comma separated)</label>
              <Input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Pool, Gym, Parking, Security, Garden"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Property Images</label>
              <div className="mt-2 grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-secondary/50 cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Location</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Latitude</label>
                <Input
                  type="number"
                  name="lat"
                  value={locationData.lat}
                  onChange={handleLocationChange}
                  placeholder="19.076"
                  step="0.0001"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Longitude</label>
                <Input
                  type="number"
                  name="lng"
                  value={locationData.lng}
                  onChange={handleLocationChange}
                  placeholder="72.8777"
                  step="0.0001"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

export default AddPropertyModal

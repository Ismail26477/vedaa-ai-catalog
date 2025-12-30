"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/AppContext"

interface LeadFormData {
  // Client Details
  clientName: string
  mobileNumber: string
  emailId: string
  dateOfEnquiry: Date
  source: string
  assignedTo: string

  // Property Requirements
  propertyType: string
  transactionType: string
  budgetMin: string
  budgetMax: string
  preferredLocations: string
  city: string
  minArea: string
  maxArea: string
  configuration: string
  purpose: string
  timeline: string
  loanRequirement: string
  specialNotes: string
}

export default function LeadRequirementForm() {
  const { addLead } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LeadFormData>({
    clientName: "",
    mobileNumber: "",
    emailId: "",
    dateOfEnquiry: new Date(),
    source: "",
    assignedTo: "",
    propertyType: "",
    transactionType: "",
    budgetMin: "",
    budgetMax: "",
    preferredLocations: "",
    city: "",
    minArea: "",
    maxArea: "",
    configuration: "",
    purpose: "",
    timeline: "",
    loanRequirement: "",
    specialNotes: "",
  })

  const handleInputChange = (field: keyof LeadFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.clientName || !formData.mobileNumber) {
        toast.error("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      const leadData = {
        name: formData.clientName,
        phone: formData.mobileNumber,
        email: formData.emailId || undefined,
        source: formData.source || "website",
        status: "raw" as const,
        requirementDetails: {
          propertyType: formData.propertyType || undefined,
          transactionType: formData.transactionType || undefined,
          budgetRange:
            formData.budgetMin && formData.budgetMax
              ? {
                  min: Number.parseFloat(formData.budgetMin),
                  max: Number.parseFloat(formData.budgetMax),
                }
              : undefined,
          preferredLocations: formData.preferredLocations
            ? formData.preferredLocations.split(",").map((loc) => loc.trim())
            : undefined,
          city: formData.city || undefined,
          areaRange:
            formData.minArea && formData.maxArea
              ? {
                  min: Number.parseFloat(formData.minArea),
                  max: Number.parseFloat(formData.maxArea),
                }
              : undefined,
          configuration: formData.configuration || undefined,
          purpose: formData.purpose || undefined,
          timeline: formData.timeline || undefined,
          loanRequirement:
            formData.loanRequirement === "yes" ? true : formData.loanRequirement === "no" ? false : undefined,
          specialNotes: formData.specialNotes || undefined,
        },
      }

      console.log("[v0] Submitting lead data:", leadData)

      await addLead(leadData)

      toast.success("Lead submitted successfully!", {
        description: `${formData.clientName}'s requirements have been recorded.`,
      })

      // Reset form
      setFormData({
        clientName: "",
        mobileNumber: "",
        emailId: "",
        dateOfEnquiry: new Date(),
        source: "",
        assignedTo: "",
        propertyType: "",
        transactionType: "",
        budgetMin: "",
        budgetMax: "",
        preferredLocations: "",
        city: "",
        minArea: "",
        maxArea: "",
        configuration: "",
        purpose: "",
        timeline: "",
        loanRequirement: "",
        specialNotes: "",
      })
    } catch (error) {
      console.error("[v0] Error submitting lead:", error)
      toast.error("Failed to submit lead. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-balance mb-2">Lead & Property Requirement</h1>
        <p className="text-muted-foreground text-lg">Fill in the details below to capture client requirements</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Details Section */}
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-primary">01</span> Lead & Client Details
            </CardTitle>
            <CardDescription>Basic information about the client and enquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-base">
                  Client Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="clientName"
                  placeholder="Enter full name"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-base">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Email ID */}
              <div className="space-y-2">
                <Label htmlFor="emailId" className="text-base">
                  Email ID
                </Label>
                <Input
                  id="emailId"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.emailId}
                  onChange={(e) => handleInputChange("emailId", e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Date of Enquiry */}
              <div className="space-y-2">
                <Label className="text-base">Date of Enquiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal",
                        !formData.dateOfEnquiry && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfEnquiry ? format(formData.dateOfEnquiry, "dd/MM/yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfEnquiry}
                      onSelect={(date) => date && handleInputChange("dateOfEnquiry", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label htmlFor="source" className="text-base">
                  Source
                </Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                  <SelectTrigger id="source" className="h-11">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="cp">CP</SelectItem>
                    <SelectItem value="bni">BNI</SelectItem>
                    <SelectItem value="walkin">Walk-in</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-base">
                  Assigned To
                </Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                  <SelectTrigger id="assignedTo" className="h-11">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="wife">Wife</SelectItem>
                    <SelectItem value="cp1">Channel Partner 1</SelectItem>
                    <SelectItem value="cp2">Channel Partner 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Requirements Section */}
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-primary">02</span> Property Requirement Details
            </CardTitle>
            <CardDescription>Specific property preferences and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-base">
                  Property Type
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger id="propertyType" className="h-11">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label htmlFor="transactionType" className="text-base">
                  Transaction Type
                </Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) => handleInputChange("transactionType", value)}
                >
                  <SelectTrigger id="transactionType" className="h-11">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="invest">Invest</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <Label htmlFor="budgetMin" className="text-base">
                  Budget Min (₹ Lakhs)
                </Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="40"
                  value={formData.budgetMin}
                  onChange={(e) => handleInputChange("budgetMin", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax" className="text-base">
                  Budget Max (₹ Lakhs)
                </Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="50"
                  value={formData.budgetMax}
                  onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Preferred Locations */}
              <div className="space-y-2">
                <Label htmlFor="preferredLocations" className="text-base">
                  Preferred Location(s)
                </Label>
                <Input
                  id="preferredLocations"
                  placeholder="e.g., Manish Nagar, Wardha Road"
                  value={formData.preferredLocations}
                  onChange={(e) => handleInputChange("preferredLocations", e.target.value)}
                  className="h-11"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-base">
                  City
                </Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger id="city" className="h-11">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nagpur">Nagpur</SelectItem>
                    <SelectItem value="dubai">Dubai</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Area Range */}
              <div className="space-y-2">
                <Label htmlFor="minArea" className="text-base">
                  Minimum Area (sq.ft)
                </Label>
                <Input
                  id="minArea"
                  type="number"
                  placeholder="1200"
                  value={formData.minArea}
                  onChange={(e) => handleInputChange("minArea", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxArea" className="text-base">
                  Maximum Area (sq.ft)
                </Label>
                <Input
                  id="maxArea"
                  type="number"
                  placeholder="2000"
                  value={formData.maxArea}
                  onChange={(e) => handleInputChange("maxArea", e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Configuration */}
              <div className="space-y-2">
                <Label htmlFor="configuration" className="text-base">
                  Configuration
                </Label>
                <Select
                  value={formData.configuration}
                  onValueChange={(value) => handleInputChange("configuration", value)}
                >
                  <SelectTrigger id="configuration" className="h-11">
                    <SelectValue placeholder="Select configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1bhk">1 BHK</SelectItem>
                    <SelectItem value="2bhk">2 BHK</SelectItem>
                    <SelectItem value="3bhk">3 BHK</SelectItem>
                    <SelectItem value="4bhk">4 BHK</SelectItem>
                    <SelectItem value="plot">Plot Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-base">
                  Purpose
                </Label>
                <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                  <SelectTrigger id="purpose" className="h-11">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selfuse">Self-use</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline to Buy */}
              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-base">
                  Timeline to Buy
                </Label>
                <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger id="timeline" className="h-11">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1-3months">1-3 months</SelectItem>
                    <SelectItem value="3-6months">3-6 months</SelectItem>
                    <SelectItem value="6-12months">6-12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loan Requirement */}
              <div className="space-y-2">
                <Label htmlFor="loanRequirement" className="text-base">
                  Loan Requirement
                </Label>
                <Select
                  value={formData.loanRequirement}
                  onValueChange={(value) => handleInputChange("loanRequirement", value)}
                >
                  <SelectTrigger id="loanRequirement" className="h-11">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Special Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialNotes" className="text-base">
                  Special Notes
                </Label>
                <Textarea
                  id="specialNotes"
                  placeholder="e.g., Vaastu, corner plot, road-facing, etc."
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange("specialNotes", e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-64 h-12 text-base font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Lead & Requirements"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

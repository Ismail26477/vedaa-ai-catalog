import mongoose, { Schema, type Document } from "mongoose"

export interface ILead extends Document {
  name: string
  phone: string
  email?: string
  propertyId?: string
  status: "raw" | "verified" | "site-visit-requested" | "site-visit-done" | "negotiation" | "deal-closed"
  source?: string
  assignedTo?: string
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
  visitDate?: Date
  createdAt: Date
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
  status: {
    type: String,
    enum: ["raw", "verified", "site-visit-requested", "site-visit-done", "negotiation", "deal-closed"],
    default: "raw",
  },
  source: { type: String },
  assignedTo: { type: String },
  requirementDetails: {
    propertyType: { type: String },
    transactionType: { type: String },
    budgetRange: {
      min: { type: Number },
      max: { type: Number },
    },
    preferredLocations: [{ type: String }],
    city: { type: String },
    areaRange: {
      min: { type: Number },
      max: { type: Number },
    },
    configuration: { type: String },
    purpose: { type: String },
    timeline: { type: String },
    loanRequirement: { type: Boolean },
    specialNotes: { type: String },
  },
  visitDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ILead>("Lead", LeadSchema)
  
import mongoose, { Schema, type Document } from "mongoose"

export interface ISiteVisit extends Document {
  name: string
  phone: string
  propertyId: string
  date: Date
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
}

const SiteVisitSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<ISiteVisit>("SiteVisit", SiteVisitSchema)

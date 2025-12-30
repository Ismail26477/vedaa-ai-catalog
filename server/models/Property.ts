import mongoose, { Schema, type Document } from "mongoose"

export interface IProperty extends Document {
  title: string
  city: string
  bedrooms: number
  bathrooms: number
  area: number
  price: number
  propertyType: "villa" | "apartment" | "penthouse" | "townhouse" | "plot"
  status: "active" | "hot-deal" | "sold"
  images: string[]
  description: string
  amenities: string[]
  isFeatured: boolean
  isPremium: boolean
  isBudgetFriendly: boolean
  location: {
    lat: number
    lng: number
  }
  createdAt: Date
}

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  city: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  propertyType: {
    type: String,
    enum: ["villa", "apartment", "penthouse", "townhouse", "plot"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "hot-deal", "sold"],
    default: "active",
  },
  images: [{ type: String }],
  description: { type: String, default: "" },
  amenities: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  isBudgetFriendly: { type: Boolean, default: false },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IProperty>("Property", PropertySchema)

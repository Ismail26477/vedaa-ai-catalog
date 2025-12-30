import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://vedaa:vedaa123@vedaa-ai.blmd84r.mongodb.net/vedaa-ai-property?appName=vedaa-Ai"

export default async function connectDB() {
  try {
    console.log("[v0] Attempting to connect to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] MongoDB connected successfully")
    console.log("[v0] Database Name:", mongoose.connection.name)
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    process.exit(1)
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("[v0] MongoDB disconnected")
})

mongoose.connection.on("error", (error) => {
  console.error("[v0] MongoDB error:", error)
})

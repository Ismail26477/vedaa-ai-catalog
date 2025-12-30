import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import propertyRoutes from "./routes/properties.js"
import leadRoutes from "./routes/leads.js"
import siteVisitRoutes from "./routes/siteVisits.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/properties", propertyRoutes)
app.use("/api/leads", leadRoutes)
app.use("/api/site-visits", siteVisitRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

app.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`)
})

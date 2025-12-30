import mongoose from "mongoose"
import Property from "../server/models/Property.js"
import Lead from "../server/models/Lead.js"
import SiteVisit from "../server/models/SiteVisit.js"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://vedaa:vedaa123@vedaa-ai.blmd84r.mongodb.net/vedaa-ai-property?appName=vedaa-Ai"

const seedData = async () => {
  try {
    console.log("[v0] Connecting to MongoDB...")
    console.log("[v0] Target Database: vedaa-ai-property")
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] Connected to MongoDB successfully")
    console.log("[v0] Active Database:", mongoose.connection.name)

    // Clear existing data
    await Property.deleteMany({})
    await Lead.deleteMany({})
    await SiteVisit.deleteMany({})
    console.log("[v0] Cleared existing data")

    // Seed Properties with enhanced data
    const properties = await Property.insertMany([
      {
        title: "Luxury Skyline Apartment",
        price: 8500000,
        city: "Mumbai",
        area: 2200,
        bedrooms: 3,
        bathrooms: 3,
        propertyType: "apartment",
        status: "hot-deal",
        images: ["/src/assets/property-1.jpg"],
        amenities: ["Pool", "Gym", "Parking", "Security", "Garden", "24/7 Concierge", "Air Conditioning"],
        description: "Stunning skyline views with premium interiors and modern amenities",
      },
      {
        title: "Classic Brick Townhouse",
        price: 4200000,
        city: "Delhi",
        area: 1800,
        bedrooms: 4,
        bathrooms: 2,
        propertyType: "townhouse",
        status: "active",
        images: ["/src/assets/property-2.jpg"],
        amenities: ["Garden", "Parking", "Modular Kitchen", "Terrace", "Gated Community"],
        description: "Elegant townhouse with modern amenities in prime location",
      },
      {
        title: "Manhattan View Penthouse",
        price: 25000000,
        city: "Bangalore",
        area: 4500,
        bedrooms: 5,
        bathrooms: 5,
        propertyType: "penthouse",
        status: "active",
        images: ["/src/assets/property-3.jpg"],
        amenities: ["Rooftop Terrace", "Private Elevator", "Smart Home", "Pool", "Spa", "Home Theater", "Wine Cellar"],
        description: "Ultra-luxury penthouse with breathtaking city views and state-of-the-art facilities",
      },
      {
        title: "Cozy Family Home",
        price: 3200000,
        city: "Pune",
        area: 1500,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "villa",
        status: "active",
        images: ["/src/assets/property-4.jpg"],
        amenities: ["Garden", "Parking", "Kids Play Area", "Compound Wall", "Water Storage"],
        description: "Perfect family home in peaceful neighborhood with excellent schools nearby",
      },
      {
        title: "Beachfront Paradise Villa",
        price: 18500000,
        city: "Goa",
        area: 5200,
        bedrooms: 6,
        bathrooms: 6,
        propertyType: "villa",
        status: "hot-deal",
        images: ["/src/assets/property-5.jpg"],
        amenities: [
          "Private Beach",
          "Infinity Pool",
          "Garden",
          "Staff Quarters",
          "Helipad",
          "Yacht Dock",
          "Sunset Terrace",
        ],
        description: "Exclusive beachfront property with panoramic ocean views and luxury amenities",
      },
      {
        title: "Urban Industrial Loft",
        price: 5800000,
        city: "Hyderabad",
        area: 2800,
        bedrooms: 2,
        bathrooms: 2,
        propertyType: "apartment",
        status: "active",
        images: ["/src/assets/property-6.jpg"],
        amenities: ["High Ceilings", "Open Layout", "Gym", "Rooftop Access", "Coworking Space", "Event Hall"],
        description: "Trendy industrial loft with exposed brick walls and modern living spaces",
      },
      {
        title: "Modern Glass House",
        price: 12500000,
        city: "Chennai",
        area: 3200,
        bedrooms: 4,
        bathrooms: 3,
        propertyType: "villa",
        status: "active",
        images: ["/src/assets/property-1.jpg"],
        amenities: ["Solar Panels", "Smart Home", "Swimming Pool", "Gym", "Theater Room"],
        description: "Contemporary villa with eco-friendly features and energy efficiency",
      },
      {
        title: "Riverside Apartment Complex",
        price: 7200000,
        city: "Kolkata",
        area: 2100,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "apartment",
        status: "active",
        images: ["/src/assets/property-6.jpg"],
        amenities: ["River View", "Walking Trail", "Clubhouse", "Children's Play Area", "Amphitheater"],
        description: "Serene riverside living with community amenities and green spaces",
      },
    ])
    console.log(`[v0] Seeded ${properties.length} properties`)

    // Seed Leads - Updated status values to match model
    const leads = await Lead.insertMany([
      {
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        status: "raw",
      },
      {
        name: "Priya Patel",
        phone: "+91 87654 32109",
        propertyId: properties[0]._id,
        status: "site-visit-requested",
        visitDate: new Date("2024-12-18"),
      },
      {
        name: "Amit Kumar",
        phone: "+91 76543 21098",
        propertyId: properties[2]._id,
        status: "negotiation",
      },
      {
        name: "Sneha Reddy",
        phone: "+91 65432 10987",
        status: "verified",
      },
    ])
    console.log(`[v0] Seeded ${leads.length} leads`)

    // Seed Site Visits
    const visits = await SiteVisit.insertMany([
      {
        name: "Vikram Singh",
        phone: "+91 99887 76655",
        propertyId: properties[0]._id,
        date: new Date("2024-12-16"),
        status: "confirmed",
      },
      {
        name: "Anjali Mehta",
        phone: "+91 88776 65544",
        propertyId: properties[4]._id,
        date: new Date("2024-12-17"),
        status: "pending",
      },
    ])
    console.log(`[v0] Seeded ${visits.length} site visits`)

    console.log("[v0] Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    process.exit(1)
  }
}

seedData()

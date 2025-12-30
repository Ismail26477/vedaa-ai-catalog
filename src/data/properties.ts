export type PropertyStatus = "active" | "hot-deal" | "sold"
export type PropertyType = "villa" | "apartment" | "penthouse" | "townhouse" | "plot"

export interface Property {
  id: string
  title: string
  price: number
  city: string
  area: number
  bedrooms: number
  bathrooms: number
  propertyType: PropertyType
  status: PropertyStatus
  images: string[]
  amenities: string[]
  description: string
  location: {
    lat: number
    lng: number
  }
  isFeatured: boolean
  isPremium: boolean
  isBudgetFriendly: boolean
  createdAt: Date
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxury Skyline Apartment",
    price: 8500000,
    city: "Mumbai",
    area: 2200,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "apartment",
    status: "hot-deal",
    images: ["/property-1.jpg"],
    amenities: ["Pool", "Gym", "Parking", "Security", "Garden"],
    description: "Stunning skyline views with premium interiors",
    location: { lat: 19.076, lng: 72.8777 },
    isFeatured: true,
    isPremium: true,
    isBudgetFriendly: false,
    createdAt: new Date("2024-12-10"),
  },
  {
    id: "2",
    title: "Classic Brick Townhouse",
    price: 4200000,
    city: "Delhi",
    area: 1800,
    bedrooms: 4,
    bathrooms: 2,
    propertyType: "townhouse",
    status: "active",
    images: ["/property-2.jpg"],
    amenities: ["Garden", "Parking", "Modular Kitchen"],
    description: "Elegant townhouse with modern amenities",
    location: { lat: 28.6139, lng: 77.209 },
    isFeatured: true,
    isPremium: false,
    isBudgetFriendly: false,
    createdAt: new Date("2024-12-12"),
  },
  {
    id: "3",
    title: "Manhattan View Penthouse",
    price: 25000000,
    city: "Bangalore",
    area: 4500,
    bedrooms: 5,
    bathrooms: 5,
    propertyType: "penthouse",
    status: "active",
    images: ["/property-3.jpg"],
    amenities: ["Rooftop Terrace", "Private Elevator", "Smart Home", "Pool", "Spa"],
    description: "Ultra-luxury penthouse with breathtaking views",
    location: { lat: 12.9716, lng: 77.5946 },
    isFeatured: true,
    isPremium: true,
    isBudgetFriendly: false,
    createdAt: new Date("2024-12-08"),
  },
  {
    id: "4",
    title: "Cozy Family Home",
    price: 3200000,
    city: "Pune",
    area: 1500,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "villa",
    status: "active",
    images: ["/property-4.jpg"],
    amenities: ["Garden", "Parking", "Kids Play Area"],
    description: "Perfect family home in peaceful neighborhood",
    location: { lat: 18.5204, lng: 73.8567 },
    isFeatured: false,
    isPremium: false,
    isBudgetFriendly: true,
    createdAt: new Date("2024-12-14"),
  },
  {
    id: "5",
    title: "Beachfront Paradise Villa",
    price: 18500000,
    city: "Goa",
    area: 5200,
    bedrooms: 6,
    bathrooms: 6,
    propertyType: "villa",
    status: "hot-deal",
    images: ["/property-5.jpg"],
    amenities: ["Private Beach", "Infinity Pool", "Garden", "Staff Quarters", "Helipad"],
    description: "Exclusive beachfront property with panoramic ocean views",
    location: { lat: 15.2993, lng: 74.124 },
    isFeatured: true,
    isPremium: true,
    isBudgetFriendly: false,
    createdAt: new Date("2024-12-11"),
  },
  {
    id: "6",
    title: "Urban Industrial Loft",
    price: 5800000,
    city: "Hyderabad",
    area: 2800,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "apartment",
    status: "active",
    images: ["/property-6.jpg"],
    amenities: ["High Ceilings", "Open Layout", "Gym", "Rooftop Access"],
    description: "Trendy industrial loft with exposed brick walls",
    location: { lat: 17.385, lng: 78.4867 },
    isFeatured: false,
    isPremium: false,
    isBudgetFriendly: false,
    createdAt: new Date("2024-12-13"),
  },
]

export const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Goa", "Hyderabad", "Chennai", "Kolkata"]

export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`
  }
  return `₹${price.toLocaleString("en-IN")}`
}

export const getPropertyTypeIcon = (type: PropertyType): string => {
  const icons: Record<PropertyType, string> = {
    villa: "🏡",
    apartment: "🏢",
    penthouse: "🏰",
    townhouse: "🏘️",
    plot: "📐",
  }
  return icons[type]
}

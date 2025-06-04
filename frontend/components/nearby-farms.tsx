"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import FarmCard from "@/components/farm-card"
import MapView from "@/components/map-view"

interface NearbyFarmsProps {
  location: string
  maxDistance?: number
}

// Sample farm data with coordinates
const sampleFarms = [
  {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    location: "Bengaluru, Karnataka",
    distance: "5.7 km",
    rating: 4.9,
    specialties: ["Dairy", "Organic", "Hormone-free"],
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: "farm-2",
    name: "KleverEats",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    location: "Mysuru, Karnataka",
    distance: "3.2 km",
    rating: 4.8,
    specialties: ["Ready-to-cook", "Traditional", "Signature recipes"],
    coordinates: { lat: 12.2958, lng: 76.6394 },
  },
  {
    id: "farm-3",
    name: "Soy for Joy Farm",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    location: "Mangaluru, Karnataka",
    distance: "7.1 km",
    rating: 4.7,
    specialties: ["Organic", "Soy products", "Sustainable"],
    coordinates: { lat: 12.9141, lng: 74.856 },
  },
  {
    id: "farm-4",
    name: "Pearl Millets",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    location: "Hubballi, Karnataka",
    distance: "8.6 km",
    rating: 4.8,
    specialties: ["Millets", "Organic", "Gluten-free"],
    coordinates: { lat: 15.3647, lng: 75.124 },
  },
  {
    id: "farm-5",
    name: "Green Valley Organics",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    location: "Belagavi, Karnataka",
    distance: "12.3 km",
    rating: 4.6,
    specialties: ["Vegetables", "Organic", "Pesticide-free"],
    coordinates: { lat: 15.8497, lng: 74.4977 },
  },
  {
    id: "farm-6",
    name: "Sunshine Farms",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    location: "Kalaburagi, Karnataka",
    distance: "15.8 km",
    rating: 4.5,
    specialties: ["Fruits", "Organic", "Seasonal"],
    coordinates: { lat: 17.3297, lng: 76.8343 },
  },
]

// Karnataka cities with coordinates
const karnatakaLocations = [
  { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru, Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Mangaluru, Karnataka", lat: 12.9141, lng: 74.856 },
  { name: "Hubballi, Karnataka", lat: 15.3647, lng: 75.124 },
  { name: "Belagavi, Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Kalaburagi, Karnataka", lat: 17.3297, lng: 76.8343 },
  { name: "Davanagere, Karnataka", lat: 14.4644, lng: 75.9218 },
  { name: "Ballari, Karnataka", lat: 15.1394, lng: 76.9214 },
  { name: "Vijayapura, Karnataka", lat: 16.8302, lng: 75.71 },
  { name: "Shivamogga, Karnataka", lat: 13.9299, lng: 75.5681 },
]

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

export default function NearbyFarms({ location, maxDistance = 50 }: NearbyFarmsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [nearbyFarms, setNearbyFarms] = useState<any[]>([])
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (!location || location === "Select Location") {
      setNearbyFarms([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Find location coordinates
    const locationData = karnatakaLocations.find((loc) => loc.name === location)

    if (!locationData) {
      setNearbyFarms([])
      setIsLoading(false)
      return
    }

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Calculate distance for each farm
      const farmsWithDistance = sampleFarms.map((farm) => {
        const distance = calculateDistance(
          locationData.lat,
          locationData.lng,
          farm.coordinates.lat,
          farm.coordinates.lng,
        )

        // Convert distance to string format (e.g., "5.7 km")
        const distanceStr = `${distance.toFixed(1)} km`

        return { ...farm, distance: distanceStr, distanceValue: distance }
      })

      // Filter farms within maxDistance km and sort by distance
      const nearby = farmsWithDistance
        .filter((farm) => farm.distanceValue <= maxDistance)
        .sort((a, b) => a.distanceValue - b.distanceValue)

      setNearbyFarms(nearby)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [location, maxDistance])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-4" />
        <p className="text-gray-600">Finding farms near {location}...</p>
      </div>
    )
  }

  if (!location || location === "Select Location") {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Location</h3>
        <p className="text-gray-500 max-w-md mx-auto">Please select your location to see farms in your area.</p>
      </div>
    )
  }

  if (nearbyFarms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Farms Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any registered farms within {maxDistance} km of {location}.
        </p>
        <Button
          className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => (window.location.href = "/farms")}
        >
          View All Farms
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farms Near {location}</h2>
          <p className="text-gray-600 mt-1">
            Showing {nearbyFarms.length} farms within {maxDistance} km of your location
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-1 text-green-600 border-green-600"
          onClick={() => setShowMap(!showMap)}
        >
          <MapPin className="h-4 w-4" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      {showMap && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <MapView
            initialLocation={karnatakaLocations.find((loc) => loc.name === location)}
            showNearbyFarms={true}
            height="400px"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nearbyFarms.map((farm) => (
          <a href={`/farms/${farm.id}`} key={farm.id} className="block h-full">
            <FarmCard
              id={farm.id}
              name={farm.name}
              image={farm.image}
              location={farm.location}
              distance={farm.distance}
              rating={farm.rating}
              specialties={farm.specialties}
              onClick={() => {}}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

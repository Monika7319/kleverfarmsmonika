"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Define types for our component
interface MapViewProps {
  initialLocation?: { lat: number; lng: number; name: string }
  onSelectLocation?: (location: { lat: number; lng: number; name: string }) => void
  showNearbyFarms?: boolean
  height?: string
  className?: string
}

interface Farm {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  distance?: number
}

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
  { name: "Tumakuru, Karnataka", lat: 13.3379, lng: 77.1173 },
  { name: "Raichur, Karnataka", lat: 16.212, lng: 77.3439 },
  { name: "Hassan, Karnataka", lat: 13.0068, lng: 76.1003 },
  { name: "Chitradurga, Karnataka", lat: 14.225, lng: 76.4 },
  { name: "Udupi, Karnataka", lat: 13.3409, lng: 74.7421 },
  { name: "Dharwad, Karnataka", lat: 15.4589, lng: 75.0078 },
  { name: "Bidar, Karnataka", lat: 17.9104, lng: 77.5199 },
  { name: "Gadag, Karnataka", lat: 15.4317, lng: 75.635 },
  { name: "Haveri, Karnataka", lat: 14.795, lng: 75.404 },
  { name: "Chamarajanagar, Karnataka", lat: 11.9261, lng: 76.94 },
  { name: "Koppal, Karnataka", lat: 15.35, lng: 76.15 },
  { name: "Kodagu, Karnataka", lat: 12.3375, lng: 75.8069 },
  { name: "Bagalkot, Karnataka", lat: 16.1691, lng: 75.6615 },
  { name: "Yadgir, Karnataka", lat: 16.77, lng: 77.14 },
  { name: "Chikkaballapur, Karnataka", lat: 13.4356, lng: 77.7313 },
  { name: "Chikkamagaluru, Karnataka", lat: 13.3161, lng: 75.772 },
  { name: "Mandya, Karnataka", lat: 12.52, lng: 76.9 },
  { name: "Kolar, Karnataka", lat: 13.1367, lng: 78.1283 },
  { name: "Bengaluru Rural, Karnataka", lat: 13.2846, lng: 77.7947 },
  { name: "Ramanagara, Karnataka", lat: 12.7223, lng: 77.2819 },
]

// Sample farm data with coordinates
const sampleFarms = [
  {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    location: "Bengaluru, Karnataka",
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: "farm-2",
    name: "KleverEats",
    location: "Mysuru, Karnataka",
    coordinates: { lat: 12.2958, lng: 76.6394 },
  },
  {
    id: "farm-3",
    name: "Soy for Joy Farm",
    location: "Mangaluru, Karnataka",
    coordinates: { lat: 12.9141, lng: 74.856 },
  },
  {
    id: "farm-4",
    name: "Pearl Millets",
    location: "Hubballi, Karnataka",
    coordinates: { lat: 15.3647, lng: 75.124 },
  },
  {
    id: "farm-5",
    name: "Green Valley Organics",
    location: "Belagavi, Karnataka",
    coordinates: { lat: 15.8497, lng: 74.4977 },
  },
  {
    id: "farm-6",
    name: "Sunshine Farms",
    location: "Kalaburagi, Karnataka",
    coordinates: { lat: 17.3297, lng: 76.8343 },
  },
  {
    id: "farm-7",
    name: "Harvest Hills",
    location: "Davanagere, Karnataka",
    coordinates: { lat: 14.4644, lng: 75.9218 },
  },
  {
    id: "farm-8",
    name: "Nature's Bounty",
    location: "Ballari, Karnataka",
    coordinates: { lat: 15.1394, lng: 76.9214 },
  },
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

export default function MapView({
  initialLocation,
  onSelectLocation,
  showNearbyFarms = false,
  height = "400px",
  className = "",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof karnatakaLocations>([])
  const [selectedLocation, setSelectedLocation] = useState<typeof initialLocation>(
    initialLocation || { lat: 12.9716, lng: 77.5946, name: "Bengaluru, Karnataka" },
  )
  const [nearbyFarms, setNearbyFarms] = useState<Farm[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize the map
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !map) {
      // Dynamically import Leaflet
      import("leaflet").then((L) => {
        // Import CSS
        import("leaflet/dist/leaflet.css")

        // Create map instance
        const mapInstance = L.map(mapRef.current).setView([selectedLocation.lat, selectedLocation.lng], 10)

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance)

        // Add initial marker
        const initialMarker = L.marker([selectedLocation.lat, selectedLocation.lng], {
          draggable: true,
        }).addTo(mapInstance)

        // Handle marker drag end
        initialMarker.on("dragend", (event) => {
          const marker = event.target
          const position = marker.getLatLng()

          // Find the closest known location
          let closestLocation = karnatakaLocations[0]
          let minDistance = calculateDistance(position.lat, position.lng, closestLocation.lat, closestLocation.lng)

          karnatakaLocations.forEach((location) => {
            const distance = calculateDistance(position.lat, position.lng, location.lat, location.lng)
            if (distance < minDistance) {
              minDistance = distance
              closestLocation = location
            }
          })

          const newLocation = {
            lat: position.lat,
            lng: position.lng,
            name:
              minDistance < 10
                ? closestLocation.name
                : `Custom Location (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`,
          }

          setSelectedLocation(newLocation)
          if (onSelectLocation) {
            onSelectLocation(newLocation)
          }

          if (showNearbyFarms) {
            findNearbyFarms(position.lat, position.lng)
          }
        })

        setMap(mapInstance)
        setMarker(initialMarker)

        // Find nearby farms if enabled
        if (showNearbyFarms) {
          findNearbyFarms(selectedLocation.lat, selectedLocation.lng)
        }

        // Clean up on unmount
        return () => {
          if (mapInstance) {
            mapInstance.remove()
          }
        }
      })
    }
  }, [])

  // Update map when selectedLocation changes
  useEffect(() => {
    if (map && marker && selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 10)
      marker.setLatLng([selectedLocation.lat, selectedLocation.lng])
    }
  }, [selectedLocation, map, marker])

  // Search for locations
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = karnatakaLocations.filter((location) => location.name.toLowerCase().includes(query))
    setSearchResults(results)
  }

  // Select a location from search results
  const selectSearchResult = (location: (typeof karnatakaLocations)[0]) => {
    setSelectedLocation({
      lat: location.lat,
      lng: location.lng,
      name: location.name,
    })

    if (onSelectLocation) {
      onSelectLocation({
        lat: location.lat,
        lng: location.lng,
        name: location.name,
      })
    }

    setSearchQuery("")
    setSearchResults([])

    if (showNearbyFarms) {
      findNearbyFarms(location.lat, location.lng)
    }
  }

  // Find farms near the selected location
  const findNearbyFarms = (lat: number, lng: number) => {
    setIsLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const farmsWithDistance = sampleFarms.map((farm) => {
        const distance = calculateDistance(lat, lng, farm.coordinates.lat, farm.coordinates.lng)
        return { ...farm, distance }
      })

      // Filter farms within 50km and sort by distance
      const nearby = farmsWithDistance
        .filter((farm) => farm.distance !== undefined && farm.distance <= 50)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))

      setNearbyFarms(nearby)
      setIsLoading(false)
    }, 1000)
  }

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Find the closest known location
          let closestLocation = karnatakaLocations[0]
          let minDistance = calculateDistance(latitude, longitude, closestLocation.lat, closestLocation.lng)

          karnatakaLocations.forEach((location) => {
            const distance = calculateDistance(latitude, longitude, location.lat, location.lng)
            if (distance < minDistance) {
              minDistance = distance
              closestLocation = location
            }
          })

          const locationName =
            minDistance < 50
              ? closestLocation.name
              : `Custom Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`

          const newLocation = {
            lat: latitude,
            lng: longitude,
            name: locationName,
          }

          setSelectedLocation(newLocation)
          if (onSelectLocation) {
            onSelectLocation(newLocation)
          }

          if (showNearbyFarms) {
            findNearbyFarms(latitude, longitude)
          }

          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
          alert("Unable to retrieve your location. Please search for a location instead.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative mb-4">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for a location in Karnataka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={useCurrentLocation}
            variant="outline"
            className="ml-2 flex items-center gap-1"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="hidden sm:inline">Use My Location</span>
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {searchResults.map((location, index) => (
                <li key={index}>
                  <button
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => selectSearchResult(location)}
                  >
                    <MapPin className="h-4 w-4 text-green-600 mr-2" />
                    <span>{location.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative">
        <div ref={mapRef} className="rounded-lg overflow-hidden border border-gray-200" style={{ height }}></div>

        {selectedLocation && (
          <div className="absolute bottom-3 left-3 bg-white p-2 rounded-md shadow-md text-sm max-w-[80%]">
            <div className="font-medium flex items-center">
              <MapPin className="h-4 w-4 text-green-600 mr-1 flex-shrink-0" />
              <span className="truncate">{selectedLocation.name}</span>
            </div>
          </div>
        )}
      </div>

      {showNearbyFarms && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Nearby Farms</h3>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-600 mr-2" />
              <span>Finding nearby farms...</span>
            </div>
          ) : nearbyFarms.length > 0 ? (
            <div className="space-y-3">
              {nearbyFarms.map((farm) => (
                <div key={farm.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{farm.name}</h4>
                      <p className="text-sm text-gray-600">{farm.location}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {farm.distance?.toFixed(1)} km away
                    </div>
                  </div>
                  <div className="mt-2">
                    <a href={`/farms/${farm.id}`} className="text-sm text-green-600 hover:underline">
                      View Farm Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">No farms found within 50km of this location.</p>
              <p className="text-sm text-gray-500 mt-1">Try selecting a different location.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

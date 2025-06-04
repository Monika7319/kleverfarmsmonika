"use client"

import { useEffect, useState } from "react"
import { X, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LocationMapModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (location: { lat: number; lng: number; name: string }) => void
  initialLocation: { lat: number; lng: number; name: string }
}

export default function LocationMapModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation,
}: LocationMapModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Karnataka locations for search
  const locations = [
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
  ]

  const [filteredLocations, setFilteredLocations] = useState(locations)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations)
    } else {
      const filtered = locations.filter((location) => location.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredLocations(filtered)
    }
  }, [searchTerm])

  useEffect(() => {
    if (!isOpen) return

    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [isOpen])

  const handleLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    setSelectedLocation(location)
  }

  const handleConfirm = () => {
    onSelectLocation(selectedLocation)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col relative animate-zoom-in">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Your Location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a location in Karnataka..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && filteredLocations.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto bg-white shadow-md rounded-md border">
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
                  onClick={() => {
                    handleLocationSelect(location)
                    setSearchTerm("")
                  }}
                >
                  <MapPin className="h-4 w-4 text-green-600 mr-2" />
                  <span>{location.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative overflow-hidden">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-200">
              {/* Map placeholder - in a real implementation, this would be a map component */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <p className="text-gray-600 mb-2">Map View</p>
                  <p className="font-medium">Selected: {selectedLocation.name}</p>
                  <p className="text-sm text-gray-500">
                    Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedLocation.lat},${selectedLocation.lng}&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7C${selectedLocation.lat},${selectedLocation.lng}&key=YOUR_API_KEY`}
                    alt="Map"
                    className="rounded-lg shadow-md"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">Click on the map to select a location</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirm}>
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  )
}

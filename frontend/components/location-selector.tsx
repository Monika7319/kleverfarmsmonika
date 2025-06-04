"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import LocationMapModal from "@/components/location-map-modal"

interface LocationSelectorProps {
  onSelect: (location: string) => void
  onClose: () => void
  onOpenMap?: () => void
}

export default function LocationSelector({ onSelect, onClose, onOpenMap }: LocationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [showMapModal, setShowMapModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Karnataka locations
  const locations = [
    "Bengaluru, Karnataka",
    "Mysuru, Karnataka",
    "Mangaluru, Karnataka",
    "Hubballi, Karnataka",
    "Belagavi, Karnataka",
    "Kalaburagi, Karnataka",
    "Davanagere, Karnataka",
    "Ballari, Karnataka",
    "Vijayapura, Karnataka",
    "Shivamogga, Karnataka",
    "Tumakuru, Karnataka",
    "Raichur, Karnataka",
    "Hassan, Karnataka",
    "Chitradurga, Karnataka",
    "Udupi, Karnataka",
    "Dharwad, Karnataka",
    "Bidar, Karnataka",
    "Gadag, Karnataka",
    "Haveri, Karnataka",
    "Chamarajanagar, Karnataka",
    "Koppal, Karnataka",
    "Kodagu, Karnataka",
    "Bagalkot, Karnataka",
    "Yadgir, Karnataka",
    "Chikkaballapur, Karnataka",
    "Chikkamagaluru, Karnataka",
    "Mandya, Karnataka",
    "Kolar, Karnataka",
    "Bengaluru Rural, Karnataka",
    "Ramanagara, Karnataka",
  ]

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations)
    } else {
      const filtered = locations.filter((location) => location.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredLocations(filtered)
    }
  }, [searchTerm])

  useEffect(() => {
    // Initialize with all locations
    setFilteredLocations(locations)

    // Handle clicks outside the component
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleMapSelection = (location: { lat: number; lng: number; name: string }) => {
    onSelect(location.name)
    setShowMapModal(false)
  }

  return (
    <>
      <div
        ref={containerRef}
        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter location manually..."
              className="pl-8 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            <ul className="py-1">
              {filteredLocations.map((location, index) => (
                <li key={index}>
                  <button
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      onSelect(location)
                      onClose()
                    }}
                  >
                    <MapPin className="h-4 w-4 text-green-600 mr-2" />
                    <span>{location}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No locations found</div>
          )}
        </div>

        <div className="p-3 border-t bg-gray-50">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              setShowMapModal(true)
              if (onOpenMap) onOpenMap()
            }}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Select location on map
          </Button>
        </div>
      </div>

      <LocationMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleMapSelection}
        initialLocation={{ lat: 12.9716, lng: 77.5946, name: "Bengaluru, Karnataka" }}
      />
    </>
  )
}

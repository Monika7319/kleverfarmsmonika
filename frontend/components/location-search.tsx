"use client"

import { useState } from "react"
import LocationSelector from "@/components/location-selector"
import LocationMapModal from "@/components/location-map-modal"

interface LocationSearchProps {
  selectedLocation: string
  onSelectLocation: (location: string) => void
}

export default function LocationSearch({ selectedLocation, onSelectLocation }: LocationSearchProps) {
  const [showLocationSelector, setShowLocationSelector] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)

  const handleLocationSelect = (location: string) => {
    onSelectLocation(location)
    setShowLocationSelector(false)
  }

  const handleMapLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    onSelectLocation(location.name)
  }

  return (
    <div className="relative">
      <button
        className="font-medium text-green-600 hover:underline flex items-center gap-1"
        onClick={() => setShowLocationSelector(!showLocationSelector)}
      >
        {selectedLocation !== "Select Location" ? (
          <>
            <span className="text-green-700">{selectedLocation}</span>
            <span className="text-xs text-green-600 ml-1">(Farms near: {selectedLocation})</span>
          </>
        ) : (
          selectedLocation
        )}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showLocationSelector && (
        <LocationSelector
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationSelector(false)}
          onOpenMap={() => {
            setShowLocationSelector(false)
            setShowMapModal(true)
          }}
        />
      )}

      <LocationMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleMapLocationSelect}
        initialLocation={{ lat: 12.9716, lng: 77.5946, name: "Bengaluru, Karnataka" }}
      />
    </div>
  )
}

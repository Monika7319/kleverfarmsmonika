"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import NearbyFarms from "@/components/nearby-farms"
import LocationMapModal from "@/components/location-map-modal"

export default function FindFarmsPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("Select Location")
  const [showMapModal, setShowMapModal] = useState(false)

  const handleLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    setSelectedLocation(location.name)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Farms Near You</h1>
          <p className="text-gray-600 mb-6">
            Discover local farms in your area and get fresh produce delivered directly to your doorstep.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Your location:</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">
                    {selectedLocation !== "Select Location" ? selectedLocation : "No location selected"}
                  </span>
                </div>
              </div>

              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowMapModal(true)}>
                {selectedLocation !== "Select Location" ? "Change Location" : "Select Location"}
              </Button>
            </div>

            {selectedLocation !== "Select Location" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Delivery available:</span> Yes, we deliver to this location
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Estimated delivery time:</span> 30-45 minutes
                </p>
              </div>
            )}
          </div>

          <NearbyFarms location={selectedLocation} maxDistance={50} />
        </div>
      </div>

      <LocationMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelectLocation={handleLocationSelect}
        initialLocation={{ lat: 12.9716, lng: 77.5946, name: "Bengaluru, Karnataka" }}
      />
    </div>
  )
}

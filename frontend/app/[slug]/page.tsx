"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Star, Phone, Mail, Globe, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { useCart } from "@/components/cart-context"
import MapView from "@/components/map-view"

const API_BASE_URL = "http://localhost:8000" // Adjust if needed

export default function SlugPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [farm, setFarm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()
  const [showMap, setShowMap] = useState(false)
  

  useEffect(() => {
    async function fetchFarm() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/frontend/farm/${slug}`);
        if (!res.ok) throw new Error("Farm not found")
        const data = await res.json()
        setFarm(data.farm)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchFarm()
  }, [slug])

  if (loading) return <div className="p-6 text-center">Loading farm details...</div>
  if (error || !farm) return <div className="p-6 text-center text-red-600">Farm not found</div>
  
  const images = Array.isArray(farm.images)
    ? farm.images
    : JSON.parse(farm.images || "[]");
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Farm Gallery */}
      <div className="relative h-80 md:h-96">
      <img
  src={`http://localhost:8000/farms/images/${images[currentImageIndex]}`}
  alt={`Image ${currentImageIndex + 1}`}
  className="w-full h-full object-cover rounded-lg"
/>



  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
    {currentImageIndex + 1} / {farm.images?.length}
  </div>

  <div className="absolute bottom-0 left-0 right-0 p-6">
    <h1 className="text-3xl font-bold text-white mb-2">{farm.farmName}</h1>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-1 rounded-md">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-bold">{farm.rating || "4.5"}</span>
      </div>
      <span className="text-white">(124 reviews)</span>
    </div>
  </div>
</div>


      {/* Farm Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {farm.name}</h2>
            <p className="text-gray-700 mb-6">{farm.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {farm.specialties?.map((specialty: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Farm Location</h2>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-green-600 border-green-600"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="h-4 w-4" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>

              {showMap ? (
                <MapView initialLocation={{ lat: 12.9716, lng: 77.5946, name: farm.location }} height="300px" />
              ) : (
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>{farm.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">{farm.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">{farm.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <p className="text-gray-600">{farm.website}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Hours</p>
                  <p className="text-gray-600">Weekdays: {farm.hours?.weekdays}</p>
                  <p className="text-gray-600">Weekends: {farm.hours?.weekends}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section Placeholder */}
        {/* You can add farm.products mapping if available */}
      </div>
    </div>
  )
}

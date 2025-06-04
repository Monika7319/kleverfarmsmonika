"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
const frontendBaseUrl = typeof window !== "undefined"
  ? window.location.origin
  : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  



type Farm = {
  id: number
  farmName: string
  city: string
  state: string
  description: string
  images: string[] // assuming images is an array of image URLs
  specialties: string[]
  slug: string
  
  
}


export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Error state

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/frontend/farms")
        if (!res.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await res.json()
        setFarms(data.farms || [])
      } catch (error: any) {
        setError("Failed to fetch farms") // Show error message
        console.error("Failed to fetch farms", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFarms()
  }, []) 
  

  // Conditional rendering for loading, error, or farms data
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-6">Our Partner Farms</h1>

        {farms.length === 0 ? (
          <p>No approved farms found.</p>
        ) : (
          // Dynamically fetched farms
          farms.map((farm) => (
            <div key={farm.id} className="mb-12 bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                <img
  src={farm.images?.[0] || '/default.webp'}
  alt={farm.farmName}
  className="w-full h-64 object-cover rounded-lg"
/>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-2">{farm.farmName}</h2>
                  <p className="text-gray-600 mb-4">{farm.city}, {farm.state}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {farm.specialties?.map((specialty, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{farm.description}</p>
                  
                  
                  <Link href={`http://localhost:3000/${farm.slug}`} legacyBehavior>
  <Button className="text-green-600">View Farm</Button>
</Link>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Static hardcoded farms */}
        </div>
    </div>
  )
}

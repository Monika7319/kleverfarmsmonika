"use client"

import Link from "next/link"
import { ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import FarmCard from "@/components/farm-card"

// Exactly the farms specified by the user
const featuredFarms = [
  {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    location: "Meadowbrook, CA",
    distance: "5.7 km",
    rating: 4.9,
    specialties: ["Dairy", "Organic", "Hormone-free"],
  },
  {
    id: "farm-2",
    name: "KleverEats",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    location: "Greenville, CA",
    distance: "3.2 km",
    rating: 4.8,
    specialties: ["Ready-to-cook", "Traditional", "Signature recipes"],
  },
  {
    id: "farm-3",
    name: "Soy for Joy Farm",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    location: "Riverside, CA",
    distance: "7.1 km",
    rating: 4.7,
    specialties: ["Organic", "Soy products", "Sustainable"],
  },
  {
    id: "farm-4",
    name: "Pearl Millets",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    location: "Wheatfield, CA",
    distance: "8.6 km",
    rating: 4.8,
    specialties: ["Millets", "Organic", "Gluten-free"],
  },
]

export default function FarmsSection() {
  return (
    <section id="farms-section" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Partner Farms</h2>
            <p className="text-gray-600 mt-1">Connect directly with our partner farmers and get the freshest produce</p>
          </div>
          <Link href="/farms">
            <Button variant="outline" className="flex items-center text-green-600 border-green-600 hover:bg-green-50">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">Showing farms near: </span>
          <button className="text-sm font-medium text-green-600">Greenville, CA</button>
          <span className="text-sm text-gray-400">(Change)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFarms.map((farm) => (
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
    </section>
  )
}

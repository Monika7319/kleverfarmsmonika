"use client"

import { useState } from "react"
import { ChevronLeft, MapPin, Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FarmCard from "@/components/farm-card"
import ProductCard from "@/components/product-card"

interface FarmsPageProps {
  onBack?: () => void
}

// Completely replaced farms data with exactly what the user specified
const farms = [
  {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    location: "Meadowbrook, CA",
    distance: "5.7 km",
    rating: 4.9,
    specialties: ["Dairy", "Organic", "Hormone-free"],
    products: [
      {
        id: "product-1",
        name: "Shrikhand",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop",
        description: "Traditional sweet yogurt dessert with saffron and cardamom",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.8,
        reviews: 124,
        inStock: true,
      },
      {
        id: "product-2",
        name: "Amarkhand",
        price: 6.49,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1000&auto=format&fit=crop",
        description: "Sweet mango-flavored yogurt dessert, rich and creamy",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.9,
        reviews: 87,
        inStock: true,
      },
      {
        id: "product-3",
        name: "Condensed Milk",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop",
        description: "Rich and creamy condensed milk, perfect for desserts",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.7,
        reviews: 156,
        inStock: true,
      },
      {
        id: "product-4",
        name: "Paneer",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
        description: "Fresh homemade cottage cheese, perfect for curries",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.9,
        reviews: 203,
        inStock: true,
      },
      {
        id: "product-5",
        name: "Lassi",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1626201850133-172e69bde290?q=80&w=1000&auto=format&fit=crop",
        description: "Traditional yogurt-based drink, available in sweet and salted varieties",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.8,
        reviews: 118,
        inStock: true,
      },
      {
        id: "product-6",
        name: "Organic Ghee",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?q=80&w=1000&auto=format&fit=crop",
        description: "Pure clarified butter made from organic milk",
        category: "Dairy",
        farmId: "farm-1",
        farmName: "Dr. Joy's Dairy Farm",
        rating: 4.9,
        reviews: 92,
        inStock: true,
      },
    ],
  },
  {
    id: "farm-2",
    name: "KleverEats",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    location: "Greenville, CA",
    distance: "3.2 km",
    rating: 4.8,
    specialties: ["Ready-to-cook", "Traditional", "Signature recipes"],
    products: [
      {
        id: "product-7",
        name: "Ragi Idli Mix",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?q=80&w=1000&auto=format&fit=crop",
        description: "Nutritious finger millet idli mix, ready to cook",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.7,
        reviews: 87,
        inStock: true,
      },
      {
        id: "product-8",
        name: "Dosa Mix",
        price: 4.49,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
        description: "Traditional dosa mix, just add water and cook",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.8,
        reviews: 124,
        inStock: true,
      },
      {
        id: "product-9",
        name: "Protein Paratha Mix",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
        description: "High-protein paratha mix with multigrain flour",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.6,
        reviews: 56,
        inStock: true,
      },
      {
        id: "product-10",
        name: "Masoor Pulav",
        price: 6.49,
        image: "https://images.unsplash.com/photo-1596797038530-2c107aa8e1fa?q=80&w=1000&auto=format&fit=crop",
        description: "Ready-to-cook masoor dal pulav mix with spices",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.7,
        reviews: 92,
        inStock: true,
      },
      {
        id: "product-11",
        name: "Rasam Khichadi Mix",
        price: 5.49,
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
        description: "Traditional rasam khichadi mix, ready in minutes",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.8,
        reviews: 78,
        inStock: true,
      },
      {
        id: "product-12",
        name: "Moong Dal Halwa",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1551881192-002e02ad3d87?q=80&w=1000&auto=format&fit=crop",
        description: "Traditional sweet moong dal halwa mix, easy to prepare",
        category: "Ready-to-cook",
        farmId: "farm-2",
        farmName: "KleverEats",
        rating: 4.9,
        reviews: 103,
        inStock: true,
      },
    ],
  },
  {
    id: "farm-3",
    name: "Soy for Joy Farm",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    location: "Riverside, CA",
    distance: "7.1 km",
    rating: 4.7,
    specialties: ["Organic", "Soy products", "Sustainable"],
    products: [
      {
        id: "product-13",
        name: "Organic Soybeans",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
        description: "Fresh organic soybeans, locally grown",
        category: "Soy Products",
        farmId: "farm-3",
        farmName: "Soy for Joy Farm",
        rating: 4.6,
        reviews: 87,
        inStock: true,
      },
      {
        id: "product-14",
        name: "Soyabean Gravy Powder",
        price: 4.49,
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        description: "Ready-to-use soyabean gravy powder for quick meals",
        category: "Soy Products",
        farmId: "farm-3",
        farmName: "Soy for Joy Farm",
        rating: 4.7,
        reviews: 124,
        inStock: true,
      },
      {
        id: "product-15",
        name: "Soyabean Crush",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
        description: "Crushed soyabeans for quick cooking and protein-rich meals",
        category: "Soy Products",
        farmId: "farm-3",
        farmName: "Soy for Joy Farm",
        rating: 4.8,
        reviews: 56,
        inStock: true,
      },
    ],
  },
  {
    id: "farm-4",
    name: "Pearl Millets",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    location: "Wheatfield, CA",
    distance: "8.6 km",
    rating: 4.8,
    specialties: ["Millets", "Organic", "Gluten-free"],
    products: [
      {
        id: "product-16",
        name: "Organic Jowar",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
        description: "Organic pearl millet (jowar) grains, high in nutrients",
        category: "Millets",
        farmId: "farm-4",
        farmName: "Pearl Millets",
        rating: 4.7,
        reviews: 92,
        inStock: true,
      },
      {
        id: "product-17",
        name: "Jowar Crush - Ready to Cook",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
        description: "Crushed jowar for quick cooking, perfect for porridge",
        category: "Millets",
        farmId: "farm-4",
        farmName: "Pearl Millets",
        rating: 4.8,
        reviews: 78,
        inStock: true,
      },
      {
        id: "product-18",
        name: "Jowar Flour",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1486887396153-fa416526c108?q=80&w=1000&auto=format&fit=crop",
        description: "Fine jowar flour, perfect for rotis and other baked goods",
        category: "Millets",
        farmId: "farm-4",
        farmName: "Pearl Millets",
        rating: 4.9,
        reviews: 103,
        inStock: true,
      },
    ],
  },
]

export default function FarmsPage({ onBack }: FarmsPageProps) {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedFarm = farms.find((farm) => farm.id === selectedFarmId)

  const handleBack = () => {
    if (selectedFarmId) {
      setSelectedFarmId(null)
    } else if (onBack) {
      onBack()
    }
  }

  if (selectedFarmId && selectedFarm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6 flex items-center text-green-600">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Farms
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64">
            <img
              src={selectedFarm.image || "/placeholder.svg"}
              alt={selectedFarm.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">{selectedFarm.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{selectedFarm.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center ml-3 text-white">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {selectedFarm.location} • {selectedFarm.distance} away
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedFarm.specialties.map((specialty, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold mb-4">Products from {selectedFarm.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedFarm.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    farmName={product.farmName}
                    rating={product.rating}
                    reviews={product.reviews}
                    category={product.category}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-6 flex items-center text-green-600">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <h1 className="text-3xl font-bold mb-2">Our Partner Farms</h1>
      <p className="text-gray-600 mb-6">Connect directly with our partner farmers and get the freshest produce</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search farms by name or specialty..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-sm text-gray-600">Showing farms near: </span>
        <button className="text-sm font-medium text-green-600">Greenville, CA</button>
        <span className="text-sm text-gray-400">(Change)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms
          .filter(
            (farm) =>
              farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              farm.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
          )
          .map((farm) => (
            <FarmCard
              key={farm.id}
              id={farm.id}
              name={farm.name}
              image={farm.image}
              location={farm.location}
              distance={farm.distance}
              rating={farm.rating}
              specialties={farm.specialties}
              onClick={() => setSelectedFarmId(farm.id)}
            />
          ))}
      </div>
    </div>
  )
}

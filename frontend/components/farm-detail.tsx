"use client"

import { useState } from "react"
import { Star, Phone, Mail, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { useCart } from "@/components/cart-context"
import MapView from "@/components/map-view"
import { MapPin } from "lucide-react"

const farmsData = {
  "farm-1": {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    description:
      "Dr. Joy's Dairy Farm is a family-owned farm specializing in organic, hormone-free dairy products. Our cows are grass-fed and treated with the utmost care to produce the highest quality milk, which we transform into delicious traditional dairy products.",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594761051656-153faa44a3f0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529476908217-b62bed0a6d36?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Meadowbrook, CA",
    distance: "5.7 km",
    rating: 4.9,
    reviews: 128,
    specialties: ["Dairy", "Organic", "Hormone-free"],
    contact: {
      phone: "+1 (555) 123-4567",
      email: "info@drjoysdairy.com",
      website: "www.drjoysdairy.com",
    },
    hours: {
      weekdays: "8:00 AM - 6:00 PM",
      weekends: "9:00 AM - 5:00 PM",
    },
    products: [
      {
        id: "dairy-1",
        name: "Shrikhand",
        price: 249.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1551893134-55fd5c273f21?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.8,
        featured: true,
        seasonal: false,
      },
      {
        id: "dairy-2",
        name: "Organic Paneer",
        price: 199.99,
        unit: "250g",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
        discount: 10,
        rating: 4.7,
        featured: true,
        seasonal: true,
      },
      {
        id: "dairy-3",
        name: "Ghee",
        price: 499.99,
        unit: "500ml",
        image: "https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.9,
        featured: true,
        seasonal: false,
      },
      {
        id: "dairy-4",
        name: "Lassi",
        price: 99.99,
        unit: "200ml",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.6,
        featured: false,
        seasonal: true,
      },
      {
        id: "dairy-5",
        name: "Butter",
        price: 179.99,
        unit: "200g",
        image: "https://images.unsplash.com/photo-1589985270958-bf087b2d8ed7?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.5,
        featured: false,
        seasonal: false,
      },
    ],
  },
  "farm-2": {
    id: "farm-2",
    name: "KleverEats",
    description:
      "KleverEats specializes in ready-to-cook traditional food mixes that make cooking authentic dishes quick and easy. Our products are made with high-quality ingredients and traditional recipes passed down through generations.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Greenville, CA",
    distance: "3.2 km",
    rating: 4.8,
    reviews: 96,
    specialties: ["Ready-to-cook", "Traditional", "Signature recipes"],
    contact: {
      phone: "+1 (555) 987-6543",
      email: "hello@klevereats.com",
      website: "www.klevereats.com",
    },
    hours: {
      weekdays: "9:00 AM - 7:00 PM",
      weekends: "10:00 AM - 6:00 PM",
    },
    products: [
      {
        id: "ke-1",
        name: "Idli Mix",
        price: 199.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-2",
        name: "Dosa Mix",
        price: 219.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?q=80&w=1000&auto=format&fit=crop",
        discount: 10,
        rating: 4.8,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-3",
        name: "Sambar Powder",
        price: 149.99,
        unit: "200g",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.9,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-4",
        name: "Upma Mix",
        price: 179.99,
        unit: "400g",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.6,
        featured: false,
        seasonal: true,
      },
      {
        id: "ke-5",
        name: "Rasam Khichadi Mix",
        price: 229.99,
        unit: "400g",
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
        discount: 15,
        rating: 4.7,
        featured: false,
        seasonal: true,
      },
    ],
  },
  "farm-3": {
    id: "farm-3",
    name: "Soy for Joy Farm",
    description:
      "Soy for Joy Farm is dedicated to producing high-quality, organic soy products. We grow our soybeans using sustainable farming practices and transform them into nutritious, protein-rich foods that are good for you and the planet.",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622623271333-5f3d0f8d7a42?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612258013652-d57d2a85c9a4?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Riverside, CA",
    distance: "7.1 km",
    rating: 4.7,
    reviews: 84,
    specialties: ["Organic", "Soy products", "Sustainable"],
    contact: {
      phone: "+1 (555) 456-7890",
      email: "contact@soyforjoy.com",
      website: "www.soyforjoy.com",
    },
    hours: {
      weekdays: "8:30 AM - 6:30 PM",
      weekends: "9:30 AM - 4:30 PM",
    },
    products: [
      {
        id: "soy-1",
        name: "Organic Tofu",
        price: 149.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1612258013652-d57d2a85c9a4?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.6,
        featured: true,
        seasonal: false,
      },
      {
        id: "soy-2",
        name: "Soyabean Gravy Powder",
        price: 199.99,
        unit: "250g",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        discount: 10,
        rating: 4.5,
        featured: true,
        seasonal: false,
      },
      {
        id: "soy-3",
        name: "Soy Milk",
        price: 129.99,
        unit: "1L",
        image: "https://images.unsplash.com/photo-1622623271333-5f3d0f8d7a42?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
      {
        id: "soy-4",
        name: "Soy Chunks",
        price: 179.99,
        unit: "400g",
        image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.8,
        featured: false,
        seasonal: true,
      },
      {
        id: "soy-5",
        name: "Soy Flour",
        price: 159.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.4,
        featured: false,
        seasonal: true,
      },
    ],
  },
  "farm-4": {
    id: "farm-4",
    name: "Pearl Millets",
    description:
      "Pearl Millets is dedicated to growing and processing nutritious, gluten-free millets. Our farm uses organic farming methods to produce high-quality millets that are packed with nutrients and perfect for a healthy lifestyle.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586201375761-83865001e8c7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Wheatfield, CA",
    distance: "8.6 km",
    rating: 4.8,
    reviews: 112,
    specialties: ["Millets", "Organic", "Gluten-free"],
    contact: {
      phone: "+1 (555) 789-0123",
      email: "info@pearlmillets.com",
      website: "www.pearlmillets.com",
    },
    hours: {
      weekdays: "8:00 AM - 5:00 PM",
      weekends: "9:00 AM - 3:00 PM",
    },
    products: [
      {
        id: "millet-1",
        name: "Jowar (Sorghum)",
        price: 199.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.5,
        featured: true,
        seasonal: false,
      },
      {
        id: "millet-2",
        name: "Bajra (Pearl Millet)",
        price: 189.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
      {
        id: "millet-3",
        name: "Ragi (Finger Millet)",
        price: 209.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e8c7?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.8,
        featured: true,
        seasonal: false,
      },
      {
        id: "millet-4",
        name: "Millet Flour Mix",
        price: 249.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
        discount: 10,
        rating: 4.6,
        featured: false,
        seasonal: true,
      },
      {
        id: "millet-5",
        name: "Millet Cookies",
        price: 179.99,
        unit: "250g",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.9,
        featured: false,
        seasonal: true,
      },
    ],
  },
}

interface FarmDetailProps {
  farmId: string
  onBack: () => void
}

export default function FarmDetail({ farmId, onBack }: FarmDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()
  const [showMap, setShowMap] = useState(false)

  // Get farm data based on farmId
  const farm = farmsData[farmId as keyof typeof farmsData]

  if (!farm) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4"></h2>
        <Button onClick={onBack} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % farm.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + farm.gallery.length) % farm.gallery.length)
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      unit: product.unit,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Farm Gallery */}
      <div className="relative h-80 md:h-96">
        <img
          src={farm.gallery[currentImageIndex] || "/placeholder.svg"}
          alt={`${farm.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {farm.gallery.length}
        </div>

        {/* Farm Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{farm.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">{farm.rating}</span>
            </div>
            <span className="text-white">({farm.reviews} reviews)</span>
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
                {farm.specialties.map((specialty, index) => (
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
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <MapView
                    initialLocation={{
                      lat: 12.9716,
                      lng: 77.5946,
                      name: farm.location || "Farm Location",
                    }}
                    height="300px"
                  />
                </div>
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
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{farm.location}</p>
                  <p className="text-sm text-green-600">{farm.distance} away</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">{farm.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">{farm.contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <p className="text-gray-600">{farm.contact.website}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Hours</p>
                  <p className="text-gray-600">Weekdays: {farm.hours.weekdays}</p>
                  <p className="text-gray-600">Weekends: {farm.hours.weekends}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Products */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products from {farm.name}</h2>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {farm.products.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard
                      product={product}
                      onClick={() => {}}
                      className="h-full transition-all hover:shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {farm.products
                  .filter((product) => product.featured)
                  .map((product) => (
                    <div key={product.id} className="relative">
                      <ProductCard
                        product={product}
                        onClick={() => {}}
                        className="h-full transition-all hover:shadow-lg"
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="seasonal">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {farm.products
                  .filter((product) => product.seasonal)
                  .map((product) => (
                    <div key={product.id} className="relative">
                      <ProductCard
                        product={product}
                        onClick={() => {}}
                        className="h-full transition-all hover:shadow-lg"
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"

interface SearchResultsProps {
  searchQuery: string
  onBack: () => void
}

// Sample product data for search
const allProducts = [
  // Fruits
  {
    id: "fruit-1",
    name: "Organic Apples",
    price: 199.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.7,
    category: "Fruits",
  },
  {
    id: "fruit-2",
    name: "Fresh Bananas",
    price: 149.99,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop",
    discount: 10,
    rating: 4.5,
    category: "Fruits",
  },
  {
    id: "fruit-3",
    name: "Strawberries",
    price: 399.99,
    unit: "box",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.8,
    category: "Fruits",
  },
  {
    id: "fruit-4",
    name: "Oranges",
    price: 179.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=1000&auto=format&fit=crop",
    discount: 15,
    rating: 4.6,
    category: "Fruits",
  },
  // Vegetables
  {
    id: "veg-1",
    name: "Fresh Broccoli",
    price: 129.49,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=1000&auto=format&fit=crop",
    discount: 15,
    rating: 4.5,
    category: "Vegetables",
  },
  {
    id: "veg-2",
    name: "Organic Carrots",
    price: 149.99,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.4,
    category: "Vegetables",
  },
  {
    id: "veg-3",
    name: "Bell Peppers",
    price: 199.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.2,
    category: "Vegetables",
  },
  // Dairy
  {
    id: "dairy-1",
    name: "Whole Milk",
    price: 249.99,
    unit: "gallon",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1000&auto=format&fit=crop",
    discount: 15,
    rating: 4.7,
    category: "Dairy",
  },
  {
    id: "dairy-2",
    name: "Greek Yogurt",
    price: 399.99,
    unit: "32oz",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1000&auto=format&fit=crop",
    discount: 10,
    rating: 4.6,
    category: "Dairy",
  },
  // Bakery
  {
    id: "bakery-1",
    name: "Whole Wheat Bread",
    price: 249.29,
    unit: "loaf",
    image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.8,
    category: "Bakery",
  },
  {
    id: "bakery-2",
    name: "Croissants",
    price: 299.99,
    unit: "pack of 4",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    discount: 10,
    rating: 4.9,
    category: "Bakery",
  },
  // Meat
  {
    id: "meat-1",
    name: "Chicken Breast",
    price: 499.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1000&auto=format&fit=crop",
    discount: 10,
    rating: 4.6,
    category: "Meat",
  },
  {
    id: "meat-2",
    name: "Ground Beef",
    price: 599.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.7,
    category: "Meat",
  },
  // Beverages
  {
    id: "bev-1",
    name: "Orange Juice",
    price: 199.99,
    unit: "bottle",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.5,
    category: "Beverages",
  },
  {
    id: "bev-2",
    name: "Almond Milk",
    price: 229.79,
    unit: "half gallon",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1000&auto=format&fit=crop",
    discount: 5,
    rating: 4.3,
    category: "Beverages",
  },
]

export default function SearchResults({ searchQuery, onBack }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allProducts.map((product) => product.category))
    return ["all", ...Array.from(uniqueCategories)]
  }, [])

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query)
      const matchesCategory = filterCategory === "all" || product.category === filterCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, filterCategory])

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0)
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
      // Default: sort by relevance (matching the search query more closely)
      return 0
    })
  }, [filteredProducts, sortBy])

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <span className="text-sm text-gray-500 ml-2">
            {sortedProducts.length} results for "{searchQuery}"
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Discount</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters */}
        <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-medium text-lg mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={`category-${category}`}
                    name="category"
                    checked={filterCategory === category}
                    onChange={() => setFilterCategory(category)}
                    className="mr-2"
                  />
                  <label htmlFor={`category-${category}`} className="text-gray-700 capitalize">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full border rounded-md px-3 py-1.5 text-sm" />
              <span>-</span>
              <input type="number" placeholder="Max" className="w-full border rounded-md px-3 py-1.5 text-sm" />
            </div>
            <Button className="w-full mt-2 bg-green-600 hover:bg-green-700">Apply</Button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Discount</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="discount-10" className="mr-2" />
                <label htmlFor="discount-10" className="text-gray-700">
                  10% or more
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="discount-20" className="mr-2" />
                <label htmlFor="discount-20" className="text-gray-700">
                  20% or more
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="discount-30" className="mr-2" />
                <label htmlFor="discount-30" className="text-gray-700">
                  30% or more
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">We couldn't find any products matching "{searchQuery}".</p>
              <div className="text-sm text-gray-600">
                <p>Try:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Checking your spelling</li>
                  <li>Using fewer or different keywords</li>
                  <li>Browsing our categories</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  image={product.image}
                  discount={product.discount}
                  rating={product.rating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

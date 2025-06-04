"use client"

import { useState, useEffect, useRef } from "react"
import ProductCard from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
  discount: number
  rating: number
}

const products: Product[] = [
  {
    id: "dairy-1",
    name: "Shrikhand",
    price: 249.99,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1551893134-55fd5c273f21?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.8,
  },
  {
    id: "dairy-2",
    name: "Amrakhand",
    price: 279.99,
    unit: "500g",
    image: "/images/products/amarkhand-1.jpeg",
    discount: 10,
    rating: 4.7,
  },
  {
    id: "soy-2",
    name: "Soyabean Gravy Powder",
    price: 199.99,
    unit: "250g",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
    discount: 10,
    rating: 4.5,
  },
  {
    id: "millet-1",
    name: "Jowar (Sorghum)",
    price: 199.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.5,
  },
  {
    id: "ke-5",
    name: "Rasam Khichadi Mix",
    price: 229.99,
    unit: "400g",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
    discount: 15,
    rating: 4.7,
  },
  {
    id: "dairy-6",
    name: "Organic Ghee",
    price: 499.99,
    unit: "200g",
    image: "/images/products/ghee-2.jpeg",
    discount: 0,
    rating: 4.8,
  },
  {
    id: "ke-3",
    name: "Idli Mix",
    price: 199.99,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.6,
  },
  {
    id: "soy-1",
    name: "Soy Milk",
    price: 149.99,
    unit: "1L",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    discount: 0,
    rating: 4.3,
  },
]

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [productsPerPage, setProductsPerPage] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle window resize to determine how many products to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(1)
      } else if (window.innerWidth < 768) {
        setProductsPerPage(2)
      } else if (window.innerWidth < 1024) {
        setProductsPerPage(3)
      } else {
        setProductsPerPage(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Update visible products when currentIndex or productsPerPage changes
  useEffect(() => {
    const endIndex = currentIndex + productsPerPage
    const visibleItems = products.slice(currentIndex, endIndex)

    // If we don't have enough items to fill the page, wrap around to the beginning
    if (visibleItems.length < productsPerPage) {
      const remainingCount = productsPerPage - visibleItems.length
      const wrappedItems = products.slice(0, remainingCount)
      setVisibleProducts([...visibleItems, ...wrappedItems])
    } else {
      setVisibleProducts(visibleItems)
    }
  }, [currentIndex, productsPerPage])

  // Set up auto-sliding
  useEffect(() => {
    const startAutoSlide = () => {
      autoSlideIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= products.length - productsPerPage) {
            return 0
          }
          return Math.min(products.length - 1, prevIndex + 1)
        })
      }, 5000) // Change slide every 5 seconds
    }

    startAutoSlide()

    // Clean up interval on unmount
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [productsPerPage])

  const handlePrev = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }

    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.max(0, products.length - productsPerPage)
      }
      return Math.max(0, prevIndex - 1)
    })
  }

  const handleNext = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }

    setCurrentIndex((prevIndex) => {
      if (prevIndex >= products.length - productsPerPage) {
        return 0
      }
      return Math.min(products.length - 1, prevIndex + 1)
    })
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Products container */}
      <div className="overflow-hidden">
        <div className="flex transition-all duration-300 ease-in-out gap-4">
          {visibleProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                unit={product.unit}
                image={product.image}
                discount={product.discount}
                rating={product.rating}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.min(products.length, Math.ceil(products.length / productsPerPage)) }).map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === Math.floor(currentIndex / productsPerPage) ? "w-8 bg-green-600" : "w-2 bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(i * productsPerPage)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

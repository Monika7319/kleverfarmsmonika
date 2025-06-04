"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, ShoppingCart, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist-context"
import { useToast } from "@/hooks/use-toast"

interface ProductDetailModalProps {
  product: {
    id: string
    name: string
    price: number
    unit: string
    image: string
    discount?: number
    rating?: number
    description?: string
    category?: string
    images?: string[]
  }
  onClose: () => void
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, getItemQuantity, updateQuantity } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(getItemQuantity(product.id) || 1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null)

  const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price

  // Use product.images if available, otherwise create an array with the main image
  const images = product.images || [product.image]

  // Auto-slide for product images
  useEffect(() => {
    if (images.length <= 1) return

    // Start auto-slide
    autoSlideInterval.current = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000) // Change slide every 4 seconds

    // Clean up interval on component unmount
    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current)
      }
    }
  }, [images.length])

  // Add keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextImage()
      } else if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  // Update the handleAddToCart function to properly stop event propagation
  const handleAddToCart = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()

      // Completely stop event propagation
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation()
      }
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
      unit: product.unit,
    }

    addToCart(productToAdd, quantity)
    console.log("Added to cart from modal:", productToAdd, "quantity:", quantity)

    // Show success toast notification
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name} has been added to your cart.`,
      variant: "success",
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)

    const currentQuantity = getItemQuantity(product.id)
    if (currentQuantity > 0) {
      updateQuantity(product.id, newQuantity)
    }
  }

  const nextImage = () => {
    // Reset auto-slide timer when manually changing slides
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current)
    }

    setActiveImageIndex((prev) => (prev + 1) % images.length)

    // Restart auto-slide
    if (images.length > 1) {
      autoSlideInterval.current = setInterval(() => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 4000)
    }
  }

  const prevImage = () => {
    // Reset auto-slide timer when manually changing slides
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current)
    }

    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)

    // Restart auto-slide
    if (images.length > 1) {
      autoSlideInterval.current = setInterval(() => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 4000)
    }
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const productForWishlist = {
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
      unit: product.unit,
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        variant: "default",
      })
    } else {
      addToWishlist(productForWishlist)
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
        variant: "success",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md hover-rotate"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Product Images */}
          <div className="md:w-1/2 relative">
            <div className="relative h-64 md:h-full">
              <img
                src={images[activeImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in transition-opacity duration-500 cursor-pointer"
                onClick={() => {
                  // Open the current image in a larger view
                  const img = new Image()
                  img.src = images[activeImageIndex]
                  const w = window.open("")
                  w?.document.write(img.outerHTML)
                }}
              />

              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 animate-heartbeat">{product.discount}% OFF</Badge>
              )}

              {/* Wishlist button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-20"
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 p-2 overflow-x-auto">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                      index === activeImageIndex ? "border-green-500" : "border-transparent"
                    } hover-lift transition-all duration-300`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            {product.category && (
              <div className="text-sm text-green-600 mb-2 font-medium animate-slide-in-right">{product.category}</div>
            )}

            <h2 className="text-2xl font-bold mb-2 animate-slide-in-right delay-100">{product.name}</h2>

            <div className="flex items-center mb-4 animate-slide-in-right delay-200">
              {product.rating && (
                <div className="flex items-center mr-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              )}
              <span className="text-gray-500">per {product.unit}</span>
            </div>

            <div className="flex items-center mb-4 animate-slide-in-right delay-300">
              <span className="text-2xl font-bold text-green-600 animate-pulsate-text">
                ₹{discountedPrice.toFixed(2)}
              </span>
              {product.discount && product.discount > 0 && (
                <>
                  <span className="ml-2 text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mb-6 animate-slide-in-right delay-400">
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6 animate-slide-in-right delay-500">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l hover-shadow"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
                    handleQuantityChange(quantity - 1)
                  }}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-16 text-center border-t border-b border-gray-300 py-2"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value)
                    if (!isNaN(val) && val > 0) {
                      handleQuantityChange(val)
                    }
                  }}
                  min="1"
                />
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r hover-shadow"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation()
                    handleQuantityChange(quantity + 1)
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 animate-slide-in-bottom">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 transition-colors duration-150"
                onClick={(e) => handleAddToCart(e)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className={`p-2 ${isInWishlist(product.id) ? "text-red-500 border-red-500 hover:bg-red-50" : "text-gray-500 hover:text-red-500"}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t animate-fade-in delay-500">
              <div className="flex items-center gap-2 mb-2 hover-lift">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Free delivery on orders above ₹499</span>
              </div>

              <div className="flex items-center gap-2 hover-lift">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Delivery within 2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

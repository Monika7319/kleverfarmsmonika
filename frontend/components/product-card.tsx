"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import WishlistButton from "@/components/wishlist-button"
import { useCart } from "@/components/cart-context"

interface ProductCardProps {
  id: string
  name: string
  price: number
  unit: string
  image: string
  discount?: number
  rating?: number
  onClick?: () => void
}

export default function ProductCard({
  id,
  name,
  price,
  unit,
  image,
  discount = 0,
  rating = 0,
  onClick,
}: ProductCardProps) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart()
  const quantity = getItemQuantity(id)
  // Simplify the hover state management
  const [isHovered, setIsHovered] = useState(false)

  // Use a more efficient approach to handle hover
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price

  // Fix potential error with event handling
  // Update the incrementQuantity function to properly handle events
  const incrementQuantity = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent handlers from firing
    if (e) {
      e.preventDefault()
      e.stopPropagation()

      // Completely stop event propagation
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation()
      }
    }

    // Add a visual feedback for better UX
    if (e && e.currentTarget) {
      const target = e.currentTarget as HTMLElement
      target.classList.add("animate-ping-once")
      setTimeout(() => target.classList.remove("animate-ping-once"), 300)
    }

    // Add to cart without opening cart drawer
    const item = {
      id,
      name,
      price: discountedPrice,
      image,
      unit,
    }

    addToCart(item)
    console.log("Added to cart:", item)
  }

  // Update the decrementQuantity function to properly handle events
  const decrementQuantity = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()

      // Completely stop event propagation
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation()
      }
    }

    updateQuantity(id, quantity - 1)
  }

  const product = {
    id,
    name,
    price: discountedPrice,
    image,
    unit,
  }

  return (
    <div
      data-product-id={id}
      className={`product-card bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-md transform -translate-y-1" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className={`product-image w-full h-48 object-cover ${isHovered ? "scale-105" : ""}`}
          loading="lazy"
          decoding="async"
        />
        {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse-slow">{discount}% OFF</Badge>}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton product={product} variant="icon" className="bg-white/90 shadow-md hover:bg-white" />
        </div>
        <div className="absolute top-2 right-12 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/90 shadow-md hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              addToCart(product)
            }}
          >
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </Button>
        </div>

        {/* Quick view button that appears on hover */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick && onClick()
          }}
        >
          <button
            className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium animate-pop-up hover:bg-gray-100 transition-colors shadow-md z-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClick && onClick()
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>

        <div className="flex items-center mb-2">
          {rating > 0 && (
            <div className="flex items-center mr-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} fill-current`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-sm text-gray-500">per {unit}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="font-semibold text-lg">
              {(discount > 0 && (
                <span className="text-red-500 animate-attention">₹{discountedPrice.toFixed(2)}</span>
              )) || <span>₹{discountedPrice.toFixed(2)}</span>}
            </span>
            {discount > 0 && <span className="text-sm text-gray-500 line-through ml-2">₹{price.toFixed(2)}</span>}
          </div>
        </div>

        {quantity === 0 ? (
          <Button
            onClick={incrementQuantity}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-150 z-30 relative shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div
            className="flex items-center justify-between border border-gray-200 rounded-md z-30 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={decrementQuantity}
              className={cn("rounded-r-none h-10 w-10", quantity === 1 && "text-red-500 hover:text-red-600")}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={incrementQuantity} className="rounded-l-none h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/components/wishlist-context"

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    unit: string
  }
  className?: string
  variant?: "icon" | "default"
}

export default function WishlistButton({ product, className, variant = "default" }: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  // Fix potential error with event handling
  // Update the toggleWishlist function to properly handle events
  const toggleWishlist = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()

      // Completely stop event propagation
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation()
      }
    }

    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  // Simplify button animations for better performance
  if (variant === "icon") {
    return (
      <button
        onClick={toggleWishlist}
        className={cn(
          "bg-white p-1.5 rounded-full shadow-sm transition-colors duration-150",
          isWishlisted ? "hover:bg-red-50" : "hover:bg-gray-100",
          className,
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>
    )
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    toggleWishlist(e)
  }

  return (
    <Button
      variant={variant === "icon" ? "ghost" : "outline"}
      size={variant === "icon" ? "icon" : "default"}
      className={cn(
        variant === "icon" ? "rounded-full" : "",
        isWishlisted ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600",
        "z-20 relative shadow-sm hover:shadow-md transform transition-transform hover:scale-110",
        className,
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        // Make sure the event doesn't bubble up
        if (e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation()
        }

        // Toggle wishlist status
        if (isInWishlist) {
          removeFromWishlist(product.id)
          console.log("Removed from wishlist:", product.id)
        } else {
          addToWishlist(product)
          console.log("Added to wishlist:", product)
        }
      }}
      data-wishlist-button="true"
    >
      <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500" : ""}`} />
      {isWishlisted ? "Wishlisted" : "Add to wishlist"}
    </Button>
  )
}

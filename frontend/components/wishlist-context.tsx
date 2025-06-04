"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  unit: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      try {
        const savedWishlist = localStorage.getItem("kleverfarms-wishlist")
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist))
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kleverfarms-wishlist", JSON.stringify(wishlistItems))
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error)
      }
    }
  }, [wishlistItems])

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id)
  }

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

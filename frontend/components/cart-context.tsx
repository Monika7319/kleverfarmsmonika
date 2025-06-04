"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  unit: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getItemQuantity: (id: string) => number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("kleverfarms-cart")
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kleverfarms-cart", JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [cartItems])

  // Simplified addToCart function
  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item to cart
        return [...prevItems, { ...item, quantity }]
      }
    })
  }

  // Simplified removeFromCart function
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Simplified updateQuantity function
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const getItemQuantity = (id: string) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

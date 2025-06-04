"use client"

import { X, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWishlist } from "@/components/wishlist-context"
import { useCart } from "@/components/cart-context"

interface WishlistDrawerProps {
  onClose: () => void
}

export default function WishlistDrawer({ onClose }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const moveToCart = (id: string) => {
    const item = wishlistItems.find((item) => item.id === id)
    if (item) {
      addToCart(item)
      removeFromWishlist(id)
    }
  }

  const moveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item)
      removeFromWishlist(item.id)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold">My Wishlist</h2>
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">{wishlistItems.length}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-4">Items added to your wishlist will appear here</p>
              <Button onClick={onClose}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex border rounded-lg p-3 gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600 font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => moveToCart(item.id)}>
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                        Move to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {wishlistItems.length > 0 && (
          <div className="p-4 border-t">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={moveAllToCart}>
              Move All to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

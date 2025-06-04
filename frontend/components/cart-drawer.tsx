"use client"

import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/components/cart-context"
import { Input } from "@/components/ui/input"

interface CartDrawerProps {
  onClose: () => void
  onCheckout?: () => void
}

export default function CartDrawer({ onClose, onCheckout }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? 49 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold">My Cart</h2>
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm">{cartItems.length}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add items to your cart to proceed to checkout</p>
              <Button onClick={onClose}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border rounded-lg p-3 gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 -mt-1 -mr-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-green-600 font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="font-bold">-</span>
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value)
                            if (!isNaN(val) && val > 0) {
                              updateQuantity(item.id, val)
                            }
                          }}
                          className="w-12 h-8 text-center p-0 border-0 rounded-none"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <span className="font-bold">+</span>
                        </Button>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              onClick={onCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

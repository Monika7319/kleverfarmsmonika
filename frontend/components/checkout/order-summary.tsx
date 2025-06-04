"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  unit: string
}

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  currentStep: number
}

export default function OrderSummary({ items, subtotal, deliveryFee, tax, total, currentStep }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <span className="text-sm text-gray-600">{items.length} items</span>
      </div>

      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b text-sm font-medium">
          <span className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Items in cart
          </span>
          <span className="text-gray-500">₹{subtotal.toFixed(2)}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="py-3 space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </span>
                    <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Have a coupon?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>
          By placing your order, you agree to our{" "}
          <a href="#" className="text-green-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

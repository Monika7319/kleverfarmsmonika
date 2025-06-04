"use client"

import { CheckCircle, Package, Truck, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderConfirmationProps {
  orderNumber: string
  deliveryDate: Date
  deliveryAddress: string
  paymentMethod: string
  orderTotal: number
  onContinueShopping: () => void
}

export default function OrderConfirmation({
  orderNumber,
  deliveryDate,
  deliveryAddress,
  paymentMethod,
  orderTotal,
  onContinueShopping,
}: OrderConfirmationProps) {
  // Format delivery date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(deliveryDate)

  // Get payment method display text
  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case "card":
        return "Credit/Debit Card"
      case "upi":
        return "UPI Payment"
      case "cod":
        return "Cash on Delivery"
      default:
        return "Online Payment"
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">
          Thank you for your order. We've received your order and will begin processing it soon.
        </p>
      </div>

      <div className="border-t border-b py-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <div className="flex items-start gap-3 mb-4">
              <Package className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Order Number</h3>
                <p className="text-gray-600">{orderNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Estimated Delivery</h3>
                <p className="text-gray-600">{formattedDate}</p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Delivery Address</h3>
                <p className="text-gray-600">{deliveryAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-gray-600">{getPaymentMethodText()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">Order Total</h3>
        <p className="text-2xl font-bold text-green-600">₹{orderTotal.toFixed(2)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-green-600 hover:bg-green-700" onClick={onContinueShopping}>
          Continue Shopping
        </Button>
        <Button variant="outline">Track Order</Button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>We've sent a confirmation email to your registered email address with all the order details.</p>
      </div>
    </div>
  )
}

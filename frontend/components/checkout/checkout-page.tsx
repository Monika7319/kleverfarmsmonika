"use client"

import { useState } from "react"
import { ChevronLeft, CreditCard, Truck, CheckCircle, MapPin, Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"
import AddressStep from "@/components/checkout/address-step"
import PaymentStep from "@/components/checkout/payment-step"
import OrderSummary from "@/components/checkout/order-summary"
import OrderConfirmation from "@/components/checkout/order-confirmation"

interface CheckoutPageProps {
  onBack: () => void
}

export default function CheckoutPage({ onBack }: CheckoutPageProps) {
  const { cartItems, totalItems } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState({
    address: {
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      saveAddress: false,
      addressType: "home",
    },
    deliveryOption: "standard",
    paymentMethod: "card",
    cardDetails: {
      cardNumber: "",
      nameOnCard: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
    upiId: "",
    orderNotes: "",
  })

  const updateCheckoutData = (field: string, value: any) => {
    setCheckoutData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = () => {
    // In a real app, you would send the order to your backend
    console.log("Order placed:", { items: cartItems, ...checkoutData })
    handleNextStep()
  }

  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = checkoutData.deliveryOption === "express" ? 99 : 49
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + deliveryFee + tax

  if (cartItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-gray-100 p-6 rounded-full inline-flex mb-4">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart to proceed to checkout</p>
        <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Address</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-green-600" : "bg-gray-200"}`}></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Delivery</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? "bg-green-600" : "bg-gray-200"}`}></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${currentStep >= 4 ? "bg-green-600" : "bg-gray-200"}`}></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 4 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Confirmation</span>
          </div>
        </div>
      </div>

      {currentStep === 4 ? (
        <OrderConfirmation
          orderNumber="KF-12345678"
          deliveryDate={new Date(Date.now() + 86400000)} // Tomorrow
          deliveryAddress={`${checkoutData.address.addressLine1}, ${checkoutData.address.city}, ${checkoutData.address.state} ${checkoutData.address.zipCode}`}
          paymentMethod={checkoutData.paymentMethod}
          orderTotal={total}
          onContinueShopping={onBack}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <AddressStep
                addressData={checkoutData.address}
                onUpdateAddress={(addressData) => updateCheckoutData("address", addressData)}
                deliveryOption={checkoutData.deliveryOption}
                onUpdateDeliveryOption={(option) => updateCheckoutData("deliveryOption", option)}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>

                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkoutData.deliveryOption === "standard"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => updateCheckoutData("deliveryOption", "standard")}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="standard-delivery"
                            checked={checkoutData.deliveryOption === "standard"}
                            onChange={() => updateCheckoutData("deliveryOption", "standard")}
                            className="mr-2"
                          />
                          <label htmlFor="standard-delivery" className="font-medium">
                            Standard Delivery
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-5">Delivery within 24 hours</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">₹49</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 ml-5 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated delivery: Tomorrow, 2:00 PM - 6:00 PM</span>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkoutData.deliveryOption === "express"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => updateCheckoutData("deliveryOption", "express")}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="express-delivery"
                            checked={checkoutData.deliveryOption === "express"}
                            onChange={() => updateCheckoutData("deliveryOption", "express")}
                            className="mr-2"
                          />
                          <label htmlFor="express-delivery" className="font-medium">
                            Express Delivery
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-5">Delivery within 2 hours</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">₹99</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 ml-5 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Estimated delivery: Today, within 2 hours</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="order-notes" className="block font-medium mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="order-notes"
                    placeholder="Add any special instructions for delivery..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm"
                    rows={3}
                    value={checkoutData.orderNotes}
                    onChange={(e) => updateCheckoutData("orderNotes", e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleNextStep}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <PaymentStep
                paymentMethod={checkoutData.paymentMethod}
                onUpdatePaymentMethod={(method) => updateCheckoutData("paymentMethod", method)}
                cardDetails={checkoutData.cardDetails}
                onUpdateCardDetails={(details) => updateCheckoutData("cardDetails", details)}
                upiId={checkoutData.upiId}
                onUpdateUpiId={(id) => updateCheckoutData("upiId", id)}
                onBack={handlePrevStep}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              currentStep={currentStep}
            />
          </div>
        </div>
      )}
    </div>
  )
}

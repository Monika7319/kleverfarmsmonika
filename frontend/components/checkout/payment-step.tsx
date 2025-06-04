"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Wallet, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CardDetails {
  cardNumber: string
  nameOnCard: string
  expiryDate: string
  cvv: string
  saveCard: boolean
}

interface PaymentStepProps {
  paymentMethod: string
  onUpdatePaymentMethod: (method: string) => void
  cardDetails: CardDetails
  onUpdateCardDetails: (details: CardDetails) => void
  upiId: string
  onUpdateUpiId: (id: string) => void
  onBack: () => void
  onPlaceOrder: () => void
}

export default function PaymentStep({
  paymentMethod,
  onUpdatePaymentMethod,
  cardDetails,
  onUpdateCardDetails,
  upiId,
  onUpdateUpiId,
  onBack,
  onPlaceOrder,
}: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdateCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const handleSaveCardChange = (checked: boolean) => {
    onUpdateCardDetails({
      ...cardDetails,
      saveCard: checked,
    })
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPlaceOrder()
    }, 2000)
  }

  const isFormValid = () => {
    if (paymentMethod === "card") {
      return (
        cardDetails.cardNumber.trim() !== "" &&
        cardDetails.nameOnCard.trim() !== "" &&
        cardDetails.expiryDate.trim() !== "" &&
        cardDetails.cvv.trim() !== ""
      )
    } else if (paymentMethod === "upi") {
      return upiId.trim() !== ""
    }

    return true // For COD
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

      <Tabs defaultValue={paymentMethod} onValueChange={onUpdatePaymentMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>UPI</span>
          </TabsTrigger>
          <TabsTrigger value="cod" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Cash on Delivery</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                name="nameOnCard"
                placeholder="Enter name as on card"
                value={cardDetails.nameOnCard}
                onChange={handleCardDetailsChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="saveCard" checked={cardDetails.saveCard} onCheckedChange={handleSaveCardChange} />
              <label
                htmlFor="saveCard"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save this card for future payments
              </label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upi">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => onUpdateUpiId(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Enter your UPI ID (e.g., yourname@okicici, yourname@ybl)</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-green-500">
                <img src="/placeholder.svg?height=40&width=40" alt="Google Pay" className="mx-auto mb-2 h-10" />
                <span className="text-xs">Google Pay</span>
              </div>
              <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-green-500">
                <img src="/placeholder.svg?height=40&width=40" alt="PhonePe" className="mx-auto mb-2 h-10" />
                <span className="text-xs">PhonePe</span>
              </div>
              <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-green-500">
                <img src="/placeholder.svg?height=40&width=40" alt="Paytm" className="mx-auto mb-2 h-10" />
                <span className="text-xs">Paytm</span>
              </div>
              <div className="border rounded-lg p-3 text-center cursor-pointer hover:border-green-500">
                <img src="/placeholder.svg?height=40&width=40" alt="BHIM" className="mx-auto mb-2 h-10" />
                <span className="text-xs">BHIM</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cod">
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-yellow-800 mb-2">Cash on Delivery</h3>
            <p className="text-sm text-yellow-700">
              Pay with cash upon delivery. Please have the exact amount ready for our delivery partner.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Important Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Cash on delivery is available for orders under ₹10,000</li>
              <li>Please keep exact change ready to ensure a smooth delivery experience</li>
              <li>Our delivery partner will provide a receipt upon payment</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handlePlaceOrder}
          disabled={isProcessing || !isFormValid()}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  )
}

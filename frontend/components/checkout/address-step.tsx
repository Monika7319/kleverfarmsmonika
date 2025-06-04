"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface AddressData {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  saveAddress: boolean
  addressType: string
}

interface AddressStepProps {
  addressData: AddressData
  onUpdateAddress: (data: AddressData) => void
  deliveryOption: string
  onUpdateDeliveryOption: (option: string) => void
  onNext: () => void
}

export default function AddressStep({
  addressData,
  onUpdateAddress,
  deliveryOption,
  onUpdateDeliveryOption,
  onNext,
}: AddressStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onUpdateAddress({
      ...addressData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (checked: boolean) => {
    onUpdateAddress({
      ...addressData,
      saveAddress: checked,
    })
  }

  const handleAddressTypeChange = (value: string) => {
    onUpdateAddress({
      ...addressData,
      addressType: value,
    })
  }

  const isFormValid = () => {
    return (
      addressData.fullName.trim() !== "" &&
      addressData.phoneNumber.trim() !== "" &&
      addressData.addressLine1.trim() !== "" &&
      addressData.city.trim() !== "" &&
      addressData.state.trim() !== "" &&
      addressData.zipCode.trim() !== ""
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            value={addressData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={addressData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          name="addressLine1"
          placeholder="House/Flat No., Building Name, Street"
          value={addressData.addressLine1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          name="addressLine2"
          placeholder="Landmark, Area"
          value={addressData.addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="City" value={addressData.city} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            placeholder="State"
            value={addressData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            placeholder="ZIP Code"
            value={addressData.zipCode}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <Label className="block mb-2">Address Type</Label>
        <RadioGroup value={addressData.addressType} onValueChange={handleAddressTypeChange} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="home" id="home" />
            <Label htmlFor="home">Home</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="work" id="work" />
            <Label htmlFor="work">Work</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox id="saveAddress" checked={addressData.saveAddress} onCheckedChange={handleCheckboxChange} />
        <label
          htmlFor="saveAddress"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Save this address for future orders
        </label>
      </div>

      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700" onClick={onNext} disabled={!isFormValid()}>
          Continue to Delivery
        </Button>
      </div>
    </div>
  )
}

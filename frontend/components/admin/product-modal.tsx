"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (productData: any) => void
  product: any | null
  isEditing: boolean
  farms: string[]
  categories: string[]
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  isEditing,
  farms,
  categories,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    farm: "",
    farmId: "",
    category: "",
    price: 0,
    unit: "",
    stock: 0,
    description: "",
    status: "active",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        description: product.description || "",
      })
    } else {
      setFormData({
        id: "",
        name: "",
        farm: "",
        farmId: "",
        category: "",
        price: 0,
        unit: "",
        stock: 0,
        description: "",
        status: "active",
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm">Farm</Label>
              <Select value={formData.farm} onValueChange={(value) => handleSelectChange("farm", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm} value={farm}>
                      {farm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {["kg", "gram", "liter", "piece", "bunch", "dozen", "pack", "jar"].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="status" checked={formData.status === "active"} onCheckedChange={handleStatusChange} />
            <Label htmlFor="status">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

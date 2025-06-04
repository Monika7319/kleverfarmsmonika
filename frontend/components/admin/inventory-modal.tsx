"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (itemData: any) => void
  item: any
}

export default function InventoryModal({ isOpen, onClose, onSave, item }: InventoryModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    currentStock: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    lastRestocked: "",
    status: "",
  })

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        currentStock: item.currentStock,
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel,
        lastRestocked: new Date().toISOString(),
        status: calculateStatus(item.currentStock, item.minStockLevel),
      })
    }
  }, [item])

  const calculateStatus = (currentStock: number, minStockLevel: number) => {
    if (currentStock === 0) return "out-of-stock"
    if (currentStock <= minStockLevel * 0.5) return "critical"
    if (currentStock <= minStockLevel) return "low-stock"
    return "in-stock"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue =
      name === "currentStock" || name === "minStockLevel" || name === "maxStockLevel" ? Number.parseInt(value) : value

    setFormData((prev) => {
      const newData = { ...prev, [name]: numValue }

      // Update status based on current stock if currentStock is being changed
      if (name === "currentStock" || name === "minStockLevel") {
        const currentStock = name === "currentStock" ? numValue : prev.currentStock
        const minStockLevel = name === "minStockLevel" ? numValue : prev.minStockLevel
        newData.status = calculateStatus(currentStock as number, minStockLevel as number)
      }

      return newData
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Inventory for {item.productName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentStock">Current Stock</Label>
            <Input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                min="0"
                value={formData.minStockLevel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
              <Input
                id="maxStockLevel"
                name="maxStockLevel"
                type="number"
                min="0"
                value={formData.maxStockLevel}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {formData.status === "in-stock" && <span className="text-green-600 font-medium">In Stock</span>}
              {formData.status === "low-stock" && <span className="text-yellow-600 font-medium">Low Stock</span>}
              {formData.status === "critical" && <span className="text-orange-600 font-medium">Critical</span>}
              {formData.status === "out-of-stock" && <span className="text-red-600 font-medium">Out of Stock</span>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Update Inventory
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, Plus, X } from "lucide-react"
import { toast } from "react-toastify"
import InventoryModal from "@/components/admin/inventory-modal"

// Mock inventory data
const mockInventory = [
  {
    id: "inv-1",
    productId: "prod-1",
    productName: "Organic Apples",
    farm: "Green Valley Organics",
    farmId: "farm-1",
    category: "Fruits",
    currentStock: 120,
    unit: "kg",
    minStockLevel: 50,
    maxStockLevel: 500,
    lastRestocked: "2023-04-05T10:30:00Z",
    status: "in-stock",
  },
  {
    id: "inv-2",
    productId: "prod-2",
    productName: "Fresh Milk",
    farm: "Sunrise Dairy Farm",
    farmId: "farm-2",
    category: "Dairy",
    currentStock: 50,
    unit: "liter",
    minStockLevel: 30,
    maxStockLevel: 200,
    lastRestocked: "2023-04-04T09:15:00Z",
    status: "in-stock",
  },
  {
    id: "inv-3",
    productId: "prod-3",
    productName: "Free-Range Eggs",
    farm: "Happy Hen Poultry",
    farmId: "farm-3",
    category: "Eggs",
    currentStock: 30,
    unit: "dozen",
    minStockLevel: 20,
    maxStockLevel: 100,
    lastRestocked: "2023-04-03T14:45:00Z",
    status: "low-stock",
  },
  {
    id: "inv-4",
    productId: "prod-4",
    productName: "Bartlett Pears",
    farm: "Riverside Orchards",
    farmId: "farm-4",
    category: "Fruits",
    currentStock: 80,
    unit: "kg",
    minStockLevel: 40,
    maxStockLevel: 300,
    lastRestocked: "2023-04-02T11:20:00Z",
    status: "in-stock",
  },
  {
    id: "inv-5",
    productId: "prod-5",
    productName: "Wildflower Honey",
    farm: "Mountain Meadow Honey",
    farmId: "farm-5",
    category: "Honey",
    currentStock: 15,
    unit: "jar",
    minStockLevel: 20,
    maxStockLevel: 100,
    lastRestocked: "2023-04-01T13:10:00Z",
    status: "low-stock",
  },
  {
    id: "inv-6",
    productId: "prod-6",
    productName: "Fresh Salmon",
    farm: "Coastal Seafood Co.",
    farmId: "farm-6",
    category: "Seafood",
    currentStock: 5,
    unit: "kg",
    minStockLevel: 10,
    maxStockLevel: 50,
    lastRestocked: "2023-03-31T10:30:00Z",
    status: "critical",
  },
  {
    id: "inv-7",
    productId: "prod-7",
    productName: "Organic Wheat Flour",
    farm: "Heartland Grains",
    farmId: "farm-7",
    category: "Grains",
    currentStock: 100,
    unit: "kg",
    minStockLevel: 50,
    maxStockLevel: 400,
    lastRestocked: "2023-03-30T15:40:00Z",
    status: "in-stock",
  },
  {
    id: "inv-8",
    productId: "prod-8",
    productName: "Microgreens Mix",
    farm: "Urban Microgreens",
    farmId: "farm-8",
    category: "Vegetables",
    currentStock: 0,
    unit: "pack",
    minStockLevel: 15,
    maxStockLevel: 60,
    lastRestocked: "2023-03-29T10:05:00Z",
    status: "out-of-stock",
  },
]

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [farmFilter, setFarmFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)

  // Get unique categories, farms, and statuses for filters
  const categories = Array.from(new Set(inventory.map((item) => item.category)))
  const farms = Array.from(new Set(inventory.map((item) => item.farm)))
  const statuses = Array.from(new Set(inventory.map((item) => item.status)))

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true
    const matchesFarm = farmFilter ? item.farm === farmFilter : true
    const matchesStatus = statusFilter ? item.status === statusFilter : true

    return matchesSearch && matchesCategory && matchesFarm && matchesStatus
  })

  const handleUpdateInventory = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId)
    if (item) {
      setCurrentItem(item)
      setIsModalOpen(true)
    }
  }

  const handleSaveInventory = (itemData: any) => {
    setInventory(inventory.map((item) => (item.id === itemData.id ? { ...item, ...itemData } : item)))
    setIsModalOpen(false)
    toast.success("Inventory updated successfully")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStockStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      "in-stock": "bg-green-500",
      "low-stock": "bg-yellow-500",
      critical: "bg-orange-500",
      "out-of-stock": "bg-red-500",
    }

    const statusLabels: Record<string, string> = {
      "in-stock": "In Stock",
      "low-stock": "Low Stock",
      critical: "Critical",
      "out-of-stock": "Out of Stock",
    }

    return <Badge className={statusColors[status] || "bg-gray-500"}>{statusLabels[status]}</Badge>
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setFarmFilter("")
    setStatusFilter("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products or farms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={farmFilter} onValueChange={setFarmFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Farm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Farms</SelectItem>
              {farms.map((farm) => (
                <SelectItem key={farm} value={farm}>
                  {farm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "in-stock"
                    ? "In Stock"
                    : status === "low-stock"
                      ? "Low Stock"
                      : status === "critical"
                        ? "Critical"
                        : "Out of Stock"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm || categoryFilter || farmFilter || statusFilter) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No inventory items found</p>
          </div>
        ) : (
          filteredInventory.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{item.productName}</h3>
                      {getStockStatusBadge(item.status)}
                      {item.status === "low-stock" || item.status === "critical" || item.status === "out-of-stock" ? (
                        <div className="ml-2 text-red-500">
                          <AlertTriangle size={16} />
                        </div>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-500">
                      Farm: {item.farm} • Category: {item.category}
                    </p>
                    <div className="flex flex-wrap gap-x-4 text-sm">
                      <p>
                        <span className="font-medium">Current Stock:</span> {item.currentStock} {item.unit}s
                      </p>
                      <p>
                        <span className="font-medium">Min Level:</span> {item.minStockLevel} {item.unit}s
                      </p>
                      <p>
                        <span className="font-medium">Last Restocked:</span> {formatDate(item.lastRestocked)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateInventory(item.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Update Stock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && currentItem && (
        <InventoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInventory}
          item={currentItem}
        />
      )}
    </div>
  )
}

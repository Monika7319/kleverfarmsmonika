"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, CheckCircle, Clock, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Demo data
  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      price: 80,
      unit: "kg",
      stock: 50,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: true,
    },
    {
      id: 2,
      name: "Fresh Milk",
      category: "Dairy",
      price: 60,
      unit: "liter",
      stock: 20,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: false,
    },
    {
      id: 3,
      name: "Wheat Flour",
      category: "Grains",
      price: 45,
      unit: "kg",
      stock: 100,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: true,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getApprovalBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending Approval
        </Badge>
      )
    }
  }

  const filteredProducts = products.filter((product) => {
    if (activeTab === "approved") return product.is_approved
    if (activeTab === "pending") return !product.is_approved
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your farm's product inventory</p>
        </div>
        <Link href="/farmer-dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">{getApprovalBadge(product.is_approved)}</div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">{formatCurrency(product.price)}</span>
                    <span className="text-sm text-gray-500">/{product.unit}</span>
                  </div>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

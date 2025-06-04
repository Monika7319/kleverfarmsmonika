"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Search, X } from "lucide-react"
import { toast } from "react-toastify"
import ProductModal from "@/components/admin/product-modal"

// Mock product data
const mockProducts = [
  {
    id: "prod-1",
    name: "Organic Apples",
    farm: "Green Valley Organics",
    farmId: "farm-1",
    category: "Fruits",
    price: 4.99,
    unit: "kg",
    stock: 120,
    status: "active",
  },
  {
    id: "prod-2",
    name: "Fresh Milk",
    farm: "Sunrise Dairy Farm",
    farmId: "farm-2",
    category: "Dairy",
    price: 3.49,
    unit: "liter",
    stock: 50,
    status: "active",
  },
  {
    id: "prod-3",
    name: "Free-Range Eggs",
    farm: "Happy Hen Poultry",
    farmId: "farm-3",
    category: "Eggs",
    price: 5.99,
    unit: "dozen",
    stock: 30,
    status: "active",
  },
  {
    id: "prod-4",
    name: "Bartlett Pears",
    farm: "Riverside Orchards",
    farmId: "farm-4",
    category: "Fruits",
    price: 3.99,
    unit: "kg",
    stock: 80,
    status: "active",
  },
  {
    id: "prod-5",
    name: "Wildflower Honey",
    farm: "Mountain Meadow Honey",
    farmId: "farm-5",
    category: "Honey",
    price: 8.99,
    unit: "jar",
    stock: 25,
    status: "active",
  },
  {
    id: "prod-6",
    name: "Fresh Salmon",
    farm: "Coastal Seafood Co.",
    farmId: "farm-6",
    category: "Seafood",
    price: 15.99,
    unit: "kg",
    stock: 15,
    status: "active",
  },
  {
    id: "prod-7",
    name: "Organic Wheat Flour",
    farm: "Heartland Grains",
    farmId: "farm-7",
    category: "Grains",
    price: 4.49,
    unit: "kg",
    stock: 100,
    status: "active",
  },
  {
    id: "prod-8",
    name: "Microgreens Mix",
    farm: "Urban Microgreens",
    farmId: "farm-8",
    category: "Vegetables",
    price: 6.99,
    unit: "pack",
    stock: 20,
    status: "inactive",
  },
]

export default function ProductsManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [farmFilter, setFarmFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Get unique categories, farms, and statuses for filters
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const farms = Array.from(new Set(products.map((p) => p.farm)))
  const statuses = Array.from(new Set(products.map((p) => p.status)))

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true
    const matchesFarm = farmFilter ? product.farm === farmFilter : true
    const matchesStatus = statusFilter ? product.status === statusFilter : true

    return matchesSearch && matchesCategory && matchesFarm && matchesStatus
  })

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
      toast.success("Product deleted successfully")
    }
  }

  const handleSaveProduct = (productData: any) => {
    if (isEditing) {
      // Update existing product
      setProducts(products.map((p) => (p.id === productData.id ? { ...p, ...productData } : p)))
      toast.success("Product updated successfully")
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: `prod-${Date.now()}`,
      }
      setProducts([...products, newProduct])
      toast.success("Product added successfully")
    }
    setIsModalOpen(false)
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
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
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
                  {status.charAt(0).toUpperCase() + status.slice(1)}
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

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <Badge className={`ml-2 ${product.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                      {product.stock < 20 && <Badge className="ml-2 bg-red-500">Low Stock</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">
                      Farm: {product.farm} • Category: {product.category}
                    </p>
                    <p className="text-sm font-medium">
                      ${product.price.toFixed(2)} per {product.unit} • Stock: {product.stock} {product.unit}s
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={currentProduct}
          isEditing={isEditing}
          farms={farms}
          categories={categories}
        />
      )}
    </div>
  )
}

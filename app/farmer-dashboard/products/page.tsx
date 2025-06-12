"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Filter, Package, ArrowUpDown, Loader2, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/app/hooks/use-debounce"
import Link from "next/link"

interface Product {
  id: number
  farm_id: number
  name: string
  category: string
  price: number
  unit: string
  discount: number
  description: string | null
  stock: number
  image: string | null
  is_featured: boolean
  is_seasonal: boolean
  is_approved: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Add this helper function at the top of the component
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/placeholder.svg?height=400&width=400"

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) return imagePath

  // If it starts with /storage/, it's a Laravel storage path
  if (imagePath.startsWith("/storage/")) return `${API_BASE_URL}${imagePath}`

  // If it's just a filename, construct the full path
  if (!imagePath.startsWith("/")) return `${API_BASE_URL}/storage/products/${imagePath}`

  return imagePath
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [categories, setCategories] = useState<string[]>([])
  const { toast } = useToast()
  const debouncedSearch = useDebounce(searchTerm, 500)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      params.append("sort_by", sortBy)
      params.append("sort_order", sortOrder)

      const response = await fetch(`${API_BASE_URL}/api/farmer/products?${params}`, {
        headers: authHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.products.map((p: Product) => p.category)))
        setCategories(uniqueCategories)
      } else {
        throw new Error(data.message || "Failed to fetch products")
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, categoryFilter, sortBy, sortOrder, toast])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/farmer/products/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        toast({
          title: "Product Deleted",
          description: "Product has been deleted successfully.",
        })
      } else {
        throw new Error(data.message || "Failed to delete product")
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) => {
    // Filter by tab
    if (activeTab === "approved" && !product.is_approved) return false
    if (activeTab === "pending" && product.is_approved) return false

    return true
  })

  const getApprovalBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Approved
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
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

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-")
                  setSortBy(field)
                  setSortOrder(order)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
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
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== "all" || activeTab !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first product."}
            </p>
            <Link href="/farmer-dashboard/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(product.image) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=400&width=400"
                  }}
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

                  {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">{formatCurrency(product.price)}</span>
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    </div>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

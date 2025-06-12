"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, Package, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductModal } from "./components/product-modal"
import { ProductCard } from "./components/product-card"
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog"
import { Pagination } from "./components/pagination"
import { DemoLogin } from "./components/demo-login"
import React from "react"

export interface Product {
  id: number
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

// Mock API functions
const API_BASE_URL = "http://localhost:8000"

const authHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

const authHeadersFormData = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function FarmerProductDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [categories, setCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)

      // Check if user is logged in
      const token = localStorage.getItem("token")
      if (!token) {
        // Use demo data if not logged in
        const demoProducts: Product[] = [
          {
            id: 1,
            name: "Organic Tomatoes",
            category: "Vegetables",
            price: 80,
            unit: "kg",
            discount: 10,
            description: "Fresh organic tomatoes grown without pesticides",
            stock: 50,
            image: "/placeholder.svg?height=400&width=400&text=Tomatoes",
            is_featured: true,
            is_seasonal: false,
            is_approved: true,
            is_active: true,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
          },
          {
            id: 2,
            name: "Farm Fresh Milk",
            category: "Dairy",
            price: 60,
            unit: "liter",
            discount: 0,
            description: "Pure cow milk from grass-fed cows",
            stock: 25,
            image: "/placeholder.svg?height=400&width=400&text=Milk",
            is_featured: false,
            is_seasonal: false,
            is_approved: true,
            is_active: true,
            created_at: "2024-01-14T08:15:00Z",
            updated_at: "2024-01-14T08:15:00Z",
          },
          {
            id: 3,
            name: "Seasonal Mangoes",
            category: "Fruits",
            price: 120,
            unit: "kg",
            discount: 15,
            description: "Sweet and juicy seasonal mangoes",
            stock: 30,
            image: "/placeholder.svg?height=400&width=400&text=Mangoes",
            is_featured: true,
            is_seasonal: true,
            is_approved: false,
            is_active: true,
            created_at: "2024-01-13T14:20:00Z",
            updated_at: "2024-01-13T14:20:00Z",
          },
          {
            id: 4,
            name: "Organic Carrots",
            category: "Vegetables",
            price: 45,
            unit: "kg",
            discount: 5,
            description: "Crunchy organic carrots rich in vitamins",
            stock: 40,
            image: "/placeholder.svg?height=400&width=400&text=Carrots",
            is_featured: false,
            is_seasonal: false,
            is_approved: true,
            is_active: true,
            created_at: "2024-01-12T11:45:00Z",
            updated_at: "2024-01-12T11:45:00Z",
          },
          {
            id: 5,
            name: "Free Range Eggs",
            category: "Dairy",
            price: 8,
            unit: "piece",
            discount: 0,
            description: "Fresh eggs from free-range chickens",
            stock: 100,
            image: "/placeholder.svg?height=400&width=400&text=Eggs",
            is_featured: false,
            is_seasonal: false,
            is_approved: true,
            is_active: true,
            created_at: "2024-01-11T09:30:00Z",
            updated_at: "2024-01-11T09:30:00Z",
          },
          {
            id: 6,
            name: "Organic Spinach",
            category: "Vegetables",
            price: 35,
            unit: "bunch",
            discount: 0,
            description: "Fresh organic spinach leaves",
            stock: 20,
            image: "/placeholder.svg?height=400&width=400&text=Spinach",
            is_featured: false,
            is_seasonal: false,
            is_approved: false,
            is_active: true,
            created_at: "2024-01-10T16:00:00Z",
            updated_at: "2024-01-10T16:00:00Z",
          },
        ]

        setProducts(demoProducts)
        const uniqueCategories = Array.from(new Set(demoProducts.map((p) => p.category)))
        setCategories(uniqueCategories)
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      params.append("sort_by", sortBy)
      params.append("sort_order", sortOrder)

      const response = await fetch(`${API_BASE_URL}/api/farmer/products?${params}`, {
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
        const uniqueCategories = Array.from(new Set(data.products.map((p: Product) => p.category)))
        setCategories(uniqueCategories)
      } else {
        throw new Error(data.message || "Failed to fetch products")
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Showing demo data.",
        variant: "destructive",
      })

      // Fallback to demo data
      const demoProducts: Product[] = [
        {
          id: 1,
          name: "Organic Tomatoes",
          category: "Vegetables",
          price: 80,
          unit: "kg",
          discount: 10,
          description: "Fresh organic tomatoes grown without pesticides",
          stock: 50,
          image: "/placeholder.svg?height=400&width=400&text=Tomatoes",
          is_featured: true,
          is_seasonal: false,
          is_approved: true,
          is_active: true,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          name: "Farm Fresh Milk",
          category: "Dairy",
          price: 60,
          unit: "liter",
          discount: 0,
          description: "Pure cow milk from grass-fed cows",
          stock: 25,
          image: "/placeholder.svg?height=400&width=400&text=Milk",
          is_featured: false,
          is_seasonal: false,
          is_approved: true,
          is_active: true,
          created_at: "2024-01-14T08:15:00Z",
          updated_at: "2024-01-14T08:15:00Z",
        },
        {
          id: 3,
          name: "Seasonal Mangoes",
          category: "Fruits",
          price: 120,
          unit: "kg",
          discount: 15,
          description: "Sweet and juicy seasonal mangoes",
          stock: 30,
          image: "/placeholder.svg?height=400&width=400&text=Mangoes",
          is_featured: true,
          is_seasonal: true,
          is_approved: false,
          is_active: true,
          created_at: "2024-01-13T14:20:00Z",
          updated_at: "2024-01-13T14:20:00Z",
        },
      ]

      setProducts(demoProducts)
      const uniqueCategories = Array.from(new Set(demoProducts.map((p) => p.category)))
      setCategories(uniqueCategories)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder])

  const initialFetchRef = React.useRef(false)

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchProducts()
      initialFetchRef.current = true
    }
  }, [fetchProducts])

  useEffect(() => {
    if (initialFetchRef.current) {
      // Only fetch when filters change and after initial load
      fetchProducts()
    }
  }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder])

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // Demo mode - just add to local state
        const newProduct: Product = {
          id: Math.max(...products.map((p) => p.id)) + 1,
          name: productData.name!,
          category: productData.category!,
          price: productData.price!,
          unit: productData.unit!,
          discount: productData.discount || 0,
          description: productData.description || null,
          stock: productData.stock || 0,
          image: productData.image || null,
          is_featured: productData.is_featured || false,
          is_seasonal: productData.is_seasonal || false,
          is_approved: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setProducts((prev) => [newProduct, ...prev])
        toast({
          title: "Product Added",
          description: `${newProduct.name} has been added successfully.`,
        })
        return
      }

      const formData = new FormData()
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        method: "POST",
        headers: authHeadersFormData(),
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => [data.product, ...prev])
        toast({
          title: "Product Added",
          description: `${data.product.name} has been added successfully.`,
        })
      } else {
        throw new Error(data.message || "Failed to add product")
      }
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // Demo mode - just update local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  ...productData,
                  updated_at: new Date().toISOString(),
                }
              : p,
          ),
        )
        toast({
          title: "Product Updated",
          description: `${productData.name} has been updated successfully.`,
        })
        return
      }

      const formData = new FormData()
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_BASE_URL}/api/farmer/products/${editingProduct.id}`, {
        method: "PUT",
        headers: authHeadersFormData(),
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)))
        toast({
          title: "Product Updated",
          description: `${data.product.name} has been updated successfully.`,
        })
      } else {
        throw new Error(data.message || "Failed to update product")
      }
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // Demo mode - just remove from local state
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
        toast({
          title: "Product Deleted",
          description: `${deleteProduct.name} has been deleted successfully.`,
        })
        setDeleteProduct(null)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/farmer/products/${deleteProduct.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
        toast({
          title: "Product Deleted",
          description: `${deleteProduct.name} has been deleted successfully.`,
        })
      } else {
        throw new Error(data.message || "Failed to delete product")
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteProduct(null)
    }
  }

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      if (
        !product.name.toLowerCase().includes(query) &&
        !product.category.toLowerCase().includes(query) &&
        !product.description?.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Filter by category
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false
    }

    // Filter by status
    if (statusFilter === "approved" && !product.is_approved) return false
    if (statusFilter === "pending" && product.is_approved) return false
    if (statusFilter === "featured" && !product.is_featured) return false
    if (statusFilter === "seasonal" && !product.is_seasonal) return false
    if (statusFilter === "low-stock" && product.stock > 10) return false
    if (statusFilter === "out-of-stock" && product.stock > 0) return false

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Product]
    let bValue: any = b[sortBy as keyof Product]

    // Handle different data types
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const getStatusBadge = (product: Product) => {
    if (!product.is_approved) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Pending Approval
        </Badge>
      )
    }
    if (product.stock === 0) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Out of Stock
        </Badge>
      )
    }
    if (product.stock <= 10) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800">
          Low Stock
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800">
        In Stock
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Demo Login Component */}
      <DemoLogin />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
          <p className="text-muted-foreground">Manage your farm's product inventory</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                  <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                  <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first product."}
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => {
                  setEditingProduct(product)
                  setIsModalOpen(true)
                }}
                onDelete={() => setDeleteProduct(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={sortedProducts.length}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProduct(null)
        }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        initialData={editingProduct}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        description={editingProduct ? "Update your product information." : "Add a new product to your inventory."}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteProduct}
        productName={deleteProduct?.name}
      />
    </div>
  )
}

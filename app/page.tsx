"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, Search, Filter, Package, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ProductCard } from "./components/product-card"
import { ProductModal } from "./components/product-modal"
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog"
import { Pagination } from "./components/pagination"
import { useDebounce } from "./hooks/use-debounce"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { DemoLogin } from "./components/demo-login"
import { ConnectionTroubleshooter } from "./components/connection-troubleshooter"

// Product interface matching your backend
export interface Product {
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

// API response interface
interface ApiResponse {
  success: boolean
  products: Product[]
  message?: string
}

// Mock data generator - moved outside component to prevent recreation
const generateMockProducts = (): Product[] => {
  const mockCategories = ["Vegetables", "Fruits", "Dairy", "Grains", "Herbs"]
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    farm_id: 1,
    name: `Product ${i + 1}`,
    category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
    price: Math.floor(Math.random() * 500) + 10,
    unit: ["kg", "g", "piece", "dozen", "liter"][Math.floor(Math.random() * 5)],
    discount: Math.floor(Math.random() * 30),
    description: `This is a sample product description for Product ${i + 1}. It's a placeholder for when the API is unavailable.`,
    stock: Math.floor(Math.random() * 100),
    image: `/placeholder.svg?height=400&width=400&query=product${i + 1}`,
    is_featured: Math.random() > 0.7,
    is_seasonal: Math.random() > 0.7,
    is_approved: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
}

export default function FarmerProductDashboard() {
  // State
  const [allProducts, setAllProducts] = useState<Product[]>([]) // Store all products
  const [products, setProducts] = useState<Product[]>([]) // Displayed products after filtering/sorting
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(9)
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  const { toast } = useToast()
  const debouncedSearch = useDebounce(searchTerm, 500)

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  // Get auth headers
  const getAuthHeaders = () => {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Extract categories from products
  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.category)))
  }, [allProducts])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(debouncedSearch.toLowerCase())),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "stock") {
        return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock
      } else {
        // Default sort by created_at
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [allProducts, debouncedSearch, categoryFilter, sortBy, sortOrder])

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * perPage
    const end = start + perPage
    return filteredAndSortedProducts.slice(start, end)
  }, [filteredAndSortedProducts, currentPage, perPage])

  // Calculate pagination info
  const totalProducts = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalProducts / perPage)

  // Update displayed products when pagination changes
  useEffect(() => {
    setProducts(paginatedProducts)
  }, [paginatedProducts])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, categoryFilter, sortBy, sortOrder])

  // Load mock data
  const loadMockData = useCallback(() => {
    const mockProducts = generateMockProducts()
    setAllProducts(mockProducts)
    setIsUsingMockData(true)
    setError("Could not connect to server. Showing sample products for demonstration.")

    if (!isUsingMockData) {
      toast({
        title: "Demo Mode",
        description: "Could not connect to server. Showing sample products for demonstration.",
        variant: "default",
      })
    }
  }, [isUsingMockData, toast])

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No authentication token found, using mock data")
        loadMockData()
        return
      }

      console.log("Fetching from:", `${API_BASE_URL}/api/farmer/products`)

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        headers: getAuthHeaders(),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. API might be down or misconfigured.")
      }

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          console.log("Authentication failed, using mock data")
          loadMockData()
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      console.log("API Response:", data)

      if (!data.success) {
        throw new Error(data.message || "API request failed")
      }

      setAllProducts(data.products || [])
      setIsUsingMockData(false)
      setError(null)

      toast({
        title: "Connected",
        description: "Successfully connected to server",
      })
    } catch (err: any) {
      console.error("Error fetching products:", err)
      loadMockData()
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [API_BASE_URL, loadMockData])

  // Initial data fetch
  useEffect(() => {
    fetchProducts()
  }, []) // Only run once on mount

  // Handle add product
  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add products.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to add product")
      }

      // Update all products
      setAllProducts((prev) => [data.product, ...prev])

      setIsAddModalOpen(false)
      toast({
        title: "Product Added",
        description: `${data.product.name} has been added successfully.`,
      })
    } catch (err: any) {
      console.error("Error adding product:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle edit product
  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return

    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to edit products.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/farmer/products/${editingProduct.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to update product")
      }

      // Update all products
      setAllProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data.product : p)))

      setEditingProduct(null)
      toast({
        title: "Product Updated",
        description: `${data.product.name} has been updated successfully.`,
      })
    } catch (err: any) {
      console.error("Error updating product:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return

    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to delete products.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/farmer/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
          })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to delete product")
      }

      // Update all products
      setAllProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))

      setDeletingProduct(null)
      toast({
        title: "Product Deleted",
        description: `${deletingProduct.name} has been deleted successfully.`,
      })

      // If we deleted the last item on the page, go to previous page
      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    } catch (err: any) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: perPage }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-[200px] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Connection Troubleshooter */}
        <ConnectionTroubleshooter />

        {/* Demo Login Component */}
        <DemoLogin />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600 mt-1">
              {!loading && `Showing ${products.length} of ${totalProducts} products`}
              {isUsingMockData && " (Demo Mode)"}
            </p>
          </div>

          <Button className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)} disabled={loading}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Package className="h-4 w-4" />
              <span className="font-medium">Demo Mode:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={initialLoading}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={initialLoading}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
                disabled={initialLoading}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
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
        </Card>

        {/* Loading Indicator */}
        {loading && !initialLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Products Grid */}
        {initialLoading ? (
          renderSkeleton()
        ) : products.length === 0 ? (
          <Card className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Package className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first product."}
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => setEditingProduct(product)}
                  onDelete={() => setDeletingProduct(product)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalProducts}
                itemsPerPage={perPage}
                onItemsPerPageChange={setPerPage}
              />
            )}
          </>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProduct}
          title="Add New Product"
          description="Fill in the details to add a new product to your inventory."
        />

        {/* Edit Modal */}
        <ProductModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleEditProduct}
          initialData={editingProduct}
          title="Edit Product"
          description="Update the details of your product."
        />

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteProduct}
          productName={deletingProduct?.name}
        />
      </div>
    </div>
  )
}

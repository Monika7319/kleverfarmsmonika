"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency } from "@/lib/utils"
import {
  Plus,
  Package,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FarmerProfile {
  id: number
  name: string
  email: string
  phone: string
  farm: {
    id: number
    name: string
    address: string
    city: string
    state: string
    is_verified: boolean
  }
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  unit: string
  description: string | null
  stock: number
  image: string | null
  image_url?: string
  is_approved: boolean
  is_active: boolean
  created_at: string
}

export default function FarmerDashboardPage() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      console.log("Fetching dashboard data...")

      // Fetch farmer profile and products
      const [profileRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/farmer/dashboard`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/api/farmer/products`, { headers: authHeaders() }),
      ])

      console.log("Profile response status:", profileRes.status)
      console.log("Products response status:", productsRes.status)

      // Check for authentication errors
      if (profileRes.status === 401 || productsRes.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive",
        })
        window.location.href = "/login"
        return
      }

      // Handle profile response
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        console.log("Profile data:", profileData)
        if (profileData.success) {
          setFarmer({
            id: profileData.user.id,
            name: profileData.user.name,
            email: profileData.user.email,
            phone: profileData.user.phone || "Not provided",
            farm: profileData.farm,
          })
        }
      }

      // Handle products response
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        console.log("Products data:", productsData)
        if (productsData.success) {
          setProducts(productsData.products || [])

          if (showRefreshing) {
            toast({
              title: "Dashboard Refreshed",
              description: `Loaded ${productsData.products?.length || 0} products`,
            })
          }
        }
      }

      // If any request failed, show error but don't break the page
      if (!profileRes.ok || !productsRes.ok) {
        throw new Error("Some data could not be loaded")
      }
    } catch (error: any) {
      console.error("Dashboard fetch error:", error)
      setError(error.message)
      toast({
        title: "Error loading dashboard",
        description: "Some data may not be available. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData(true)
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const handleRefresh = () => {
    fetchDashboardData(true)
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

  const getImageUrl = (product: Product) => {
    if (product.image_url) return product.image_url
    if (product.image) return `${API_BASE_URL}/products/images/${product.image}`
    return "/placeholder.svg?height=48&width=48"
  }

  const approvedProducts = products.filter((p) => p.is_approved)
  const pendingProducts = products.filter((p) => !p.is_approved)
  const totalStockValue = products.reduce((total, product) => total + product.price * product.stock, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your farm's performance.</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Farm Page
          </Button>
          <Link href="/farmer-dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Package className="h-4 w-4" />
              <span className="font-medium">Notice:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Farmer Profile Card */}
      {farmer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Farmer Profile
              {farmer.farm?.is_verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg">{farmer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Farm Name</p>
                  <p className="text-lg">{farmer.farm?.name || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{farmer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{farmer.phone}</span>
                </div>
                {farmer.farm && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {farmer.farm.address}, {farmer.farm.city}, {farmer.farm.state}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">All your products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Products</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedProducts.length}</div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingProducts.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting admin review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Approved Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Approved Products
            </CardTitle>
            <CardDescription>Products approved by admin and available for sale</CardDescription>
          </CardHeader>
          <CardContent>
            {approvedProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No approved products yet</p>
            ) : (
              <div className="space-y-4">
                {approvedProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(product) || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      {getApprovalBadge(product.is_approved)}
                      <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
                {approvedProducts.length > 3 && (
                  <Link href="/farmer-dashboard/products?tab=approved">
                    <Button variant="outline" className="w-full">
                      View All Approved Products ({approvedProducts.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Approval
            </CardTitle>
            <CardDescription>Products waiting for admin approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products pending approval</p>
            ) : (
              <div className="space-y-4">
                {pendingProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(product) || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      {getApprovalBadge(product.is_approved)}
                      <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
                {pendingProducts.length > 3 && (
                  <Link href="/farmer-dashboard/products?tab=pending">
                    <Button variant="outline" className="w-full">
                      View All Pending Products ({pendingProducts.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/farmer-dashboard/products/new">
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex flex-col items-start gap-2">
                  <Plus className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Add New Product</p>
                    <p className="text-xs text-gray-500">Create a new product listing</p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/farmer-dashboard/products">
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex flex-col items-start gap-2">
                  <Package className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Manage Products</p>
                    <p className="text-xs text-gray-500">View and edit your products</p>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/farmer-dashboard/profile">
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex flex-col items-start gap-2">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Update Profile</p>
                    <p className="text-xs text-gray-500">Edit your farm information</p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

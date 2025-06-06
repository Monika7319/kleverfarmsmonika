"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency } from "@/lib/utils"
import { Plus, Package, CheckCircle, Clock, User, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FarmerProfile {
  id: number
  name: string
  email: string
  phone: string
  farm_name: string
  farm_address: string
  farm_city: string
  farm_state: string
  is_verified: boolean
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
  is_approved: boolean
  is_active: boolean
  created_at: string
}

export default function FarmerDashboardPage() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch farmer profile and products
      const [profileRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/farmer/profile`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/api/farmer/products`, { headers: authHeaders() }),
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setFarmer(profileData.farmer)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }
    } catch (error: any) {
      console.error("Dashboard fetch error:", error)
      toast({
        title: "Error loading dashboard",
        description: "Using demo data. Please check your connection.",
        variant: "destructive",
      })

      // Demo data
      setFarmer({
        id: 1,
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        farm_name: "Green Valley Farm",
        farm_address: "Village Rampur, Tehsil Kharkhoda",
        farm_city: "Sonipat",
        farm_state: "Haryana",
        is_verified: true,
      })

      setProducts([
        {
          id: 1,
          name: "Organic Tomatoes",
          category: "Vegetables",
          price: 80,
          unit: "kg",
          description: "Fresh organic tomatoes grown without pesticides",
          stock: 50,
          image: "/placeholder.svg?height=200&width=200",
          is_approved: true,
          is_active: true,
          created_at: "2023-05-15T10:30:00Z",
        },
        {
          id: 2,
          name: "Fresh Milk",
          category: "Dairy",
          price: 60,
          unit: "liter",
          description: "Pure cow milk from grass-fed cows",
          stock: 20,
          image: "/placeholder.svg?height=200&width=200",
          is_approved: false,
          is_active: true,
          created_at: "2023-05-16T14:45:00Z",
        },
        {
          id: 3,
          name: "Wheat Flour",
          category: "Grains",
          price: 45,
          unit: "kg",
          description: "Stone ground wheat flour",
          stock: 100,
          image: "/placeholder.svg?height=200&width=200",
          is_approved: true,
          is_active: true,
          created_at: "2023-05-17T09:15:00Z",
        },
      ])
    } finally {
      setLoading(false)
    }
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

  const approvedProducts = products.filter((p) => p.is_approved)
  const pendingProducts = products.filter((p) => !p.is_approved)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Manage your farm and products.</p>
        </div>
        <Link href="/farmer-dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Farmer Profile Card */}
      {farmer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Farmer Profile
              {farmer.is_verified && (
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
                  <p className="text-lg">{farmer.farm_name}</p>
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
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>
                    {farmer.farm_address}, {farmer.farm_city}, {farmer.farm_state}
                  </span>
                </div>
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
            <div className="text-2xl font-bold">
              {formatCurrency(products.reduce((total, product) => total + product.price * product.stock, 0))}
            </div>
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
                        src={product.image || "/placeholder.svg?height=48&width=48"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
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
                  <Link href="/farmer-dashboard/products">
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
                        src={product.image || "/placeholder.svg?height=48&width=48"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
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
                  <Link href="/farmer-dashboard/products">
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

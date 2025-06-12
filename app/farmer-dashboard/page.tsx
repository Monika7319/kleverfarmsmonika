"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency } from "@/lib/utils"
import { Plus, Package, CheckCircle, User, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"

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

interface Order {
  id: string
  customer_name: string
  total: number
  status: string
  payment_status: string
  created_at: string
  items_count: number
}

export default function FarmerDashboardPage() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch farmer profile and products
      const [profileRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/farmer/dashboard`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/api/farmer/products`, { headers: authHeaders() }),
      ])

      // Check for authentication errors
      if (profileRes.status === 401 || productsRes.status === 401) {
        window.location.href = "/login"
        return
      }

      // Handle profile response
      if (profileRes.ok) {
        const profileData = await profileRes.json()
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
        if (productsData.success) {
          setProducts(productsData.products || [])
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
    }
  }

  // Add this after the existing useEffect
  useEffect(() => {
    // Listen for focus events to refresh data when user returns to dashboard
    const handleFocus = () => {
      fetchDashboardData()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }

    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800"
    return (
      <Badge variant="outline" className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your farm.</p>
        </div>
        <Link href="/farmer-dashboard/products/new" className="mt-4 md:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
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

      {/* Simplified Farmer Details */}
      {farmer && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5" />
              Farmer Details
              {farmer.farm?.is_verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Name:</span>
                  <span>{farmer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Farm:</span>
                  <span>{farmer.farm?.name || "Not provided"}</span>
                </div>
              </div>
              <div className="space-y-1">
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

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <Link href="/farmer-dashboard/orders">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {order.customer_name} • {order.items_count} items
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{formatCurrency(order.total)}</div>
                    <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

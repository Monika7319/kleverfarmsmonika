"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency, formatDateTime } from "@/lib/utils"
import { Plus, User, MapPin, Phone, Mail, Loader2, CheckCircle, Eye, Truck } from "lucide-react"
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
  customer_email: string
  customer_phone: string
  total: number
  status: string
  payment_status: string
  payment_method: string
  created_at: string
  items_count: number
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
}

export default function FarmerDashboardPage() {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch farmer profile and orders
      const [profileRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/farmer/dashboard`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/api/farmer/orders`, { headers: authHeaders() }),
      ])

      // Check for authentication errors
      if (profileRes.status === 401 || ordersRes.status === 401) {
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

      // Handle orders response
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      } else {
        // Demo orders data
        setOrders([
          {
            id: "ORD-2023-1001",
            customer_name: "Rahul Sharma",
            customer_email: "rahul@example.com",
            customer_phone: "+91 98765 43210",
            total: 1249.97,
            status: "delivered",
            payment_status: "paid",
            payment_method: "UPI",
            created_at: "2023-05-15T10:30:00Z",
            items_count: 3,
          },
          {
            id: "ORD-2023-1002",
            customer_name: "Priya Patel",
            customer_email: "priya@example.com",
            customer_phone: "+91 87654 32109",
            total: 779.98,
            status: "processing",
            payment_status: "paid",
            payment_method: "Credit Card",
            created_at: "2023-05-16T14:45:00Z",
            items_count: 2,
          },
        ])
      }
    } catch (error: any) {
      console.error("Dashboard fetch error:", error)
      toast({
        title: "Error loading dashboard",
        description: "Some data may not be available. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
    return (
      <Badge variant="outline" className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const colorClass = paymentStatusColors[status as keyof typeof paymentStatusColors] || "bg-gray-100 text-gray-800"
    return (
      <Badge variant="outline" className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your farm and orders.</p>
        </div>
        <Link href="/farmer-dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Farmer Details */}
      {farmer && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{farmer.name}</h2>
                  {farmer.farm?.is_verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-600">{farmer.farm?.name || "Farm Name"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    {farmer.farm.city}, {farmer.farm.state}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <Link href="/farmer-dashboard/orders">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders yet. Orders will appear here when customers place them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{order.id}</h4>
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Customer:</span> {order.customer_name}
                      </div>
                      <div>
                        <span className="font-medium">Items:</span> {order.items_count} items
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {formatCurrency(order.total)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDateTime(order.created_at)} • {order.payment_method}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-1" />
                      Update
                    </Button>
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

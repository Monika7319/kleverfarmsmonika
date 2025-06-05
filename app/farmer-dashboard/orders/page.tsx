"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL, formatCurrency, formatDateTime } from "@/lib/utils"
import { Search, ArrowUpDown, Eye, Truck, Package, Download, Printer, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/farmer/orders`, {
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Using demo data.",
        variant: "destructive",
      })

      // Demo data
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
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      // Filter by tab
      if (activeTab !== "all" && order.status !== activeTab) return false

      // Filter by search
      if (searchTerm) {
        const query = searchTerm.toLowerCase()
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer_name.toLowerCase().includes(query) ||
          order.customer_email.toLowerCase().includes(query) ||
          order.customer_phone.includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "total":
          return sortOrder === "asc" ? a.total - b.total : b.total - a.total
        case "customer_name":
          return sortOrder === "asc"
            ? a.customer_name.localeCompare(b.customer_name)
            : b.customer_name.localeCompare(a.customer_name)
        case "status":
          return sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
        default:
          return sortOrder === "asc"
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

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
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
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
                  <SelectItem value="total-desc">Amount: High to Low</SelectItem>
                  <SelectItem value="total-asc">Amount: Low to High</SelectItem>
                  <SelectItem value="customer_name-asc">Customer: A to Z</SelectItem>
                  <SelectItem value="customer_name-desc">Customer: Z to A</SelectItem>
                  <SelectItem value="status-asc">Status: A to Z</SelectItem>
                  <SelectItem value="status-desc">Status: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || activeTab !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Orders will appear here when customers place them."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{order.id}</h3>
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
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
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

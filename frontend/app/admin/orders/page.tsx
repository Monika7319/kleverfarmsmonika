"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, X, Truck, Package, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"
import OrderDetailsModal from "@/components/admin/order-details-modal"

// Mock order data
const mockOrders = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2023-04-10T14:30:00Z",
    total: 78.95,
    status: "pending",
    items: [
      { id: "prod-1", name: "Organic Apples", quantity: 2, price: 4.99, farm: "Green Valley Organics" },
      { id: "prod-5", name: "Wildflower Honey", quantity: 1, price: 8.99, farm: "Mountain Meadow Honey" },
      { id: "prod-3", name: "Free-Range Eggs", quantity: 2, price: 5.99, farm: "Happy Hen Poultry" },
    ],
    shippingAddress: "123 Main St, Portland, OR 97201",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-1002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    date: "2023-04-09T10:15:00Z",
    total: 45.47,
    status: "processing",
    items: [
      { id: "prod-2", name: "Fresh Milk", quantity: 3, price: 3.49, farm: "Sunrise Dairy Farm" },
      { id: "prod-4", name: "Bartlett Pears", quantity: 2, price: 3.99, farm: "Riverside Orchards" },
    ],
    shippingAddress: "456 Oak Ave, Seattle, WA 98101",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-1003",
    customer: "Robert Johnson",
    email: "robert.johnson@example.com",
    date: "2023-04-08T16:45:00Z",
    total: 112.85,
    status: "shipped",
    items: [
      { id: "prod-6", name: "Fresh Salmon", quantity: 2, price: 15.99, farm: "Coastal Seafood Co." },
      { id: "prod-7", name: "Organic Wheat Flour", quantity: 3, price: 4.49, farm: "Heartland Grains" },
      { id: "prod-8", name: "Microgreens Mix", quantity: 2, price: 6.99, farm: "Urban Microgreens" },
    ],
    shippingAddress: "789 Pine St, San Francisco, CA 94101",
    paymentMethod: "Credit Card",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-1004",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    date: "2023-04-07T09:20:00Z",
    total: 67.92,
    status: "delivered",
    items: [
      { id: "prod-1", name: "Organic Apples", quantity: 3, price: 4.99, farm: "Green Valley Organics" },
      { id: "prod-3", name: "Free-Range Eggs", quantity: 2, price: 5.99, farm: "Happy Hen Poultry" },
    ],
    shippingAddress: "321 Maple Dr, Austin, TX 78701",
    paymentMethod: "Credit Card",
    deliveryDate: "2023-04-10T11:30:00Z",
  },
  {
    id: "ORD-1005",
    customer: "Michael Wilson",
    email: "michael.wilson@example.com",
    date: "2023-04-06T13:10:00Z",
    total: 93.45,
    status: "cancelled",
    items: [
      { id: "prod-5", name: "Wildflower Honey", quantity: 3, price: 8.99, farm: "Mountain Meadow Honey" },
      { id: "prod-6", name: "Fresh Salmon", quantity: 2, price: 15.99, farm: "Coastal Seafood Co." },
    ],
    shippingAddress: "654 Birch Ln, Chicago, IL 60601",
    paymentMethod: "PayPal",
    cancellationReason: "Customer requested cancellation",
  },
]

export default function OrdersManagement() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter ? order.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              ...(newStatus === "shipped" ? { trackingNumber: `TRK${Math.floor(Math.random() * 1000000000)}` } : {}),
              ...(newStatus === "delivered" ? { deliveryDate: new Date().toISOString() } : {}),
            }
          : order,
      ),
    )
    setIsModalOpen(false)
    toast.success(`Order ${orderId} status updated to ${newStatus}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    }

    return (
      <Badge className={statusColors[status] || "bg-gray-500"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || statusFilter) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Customer: {order.customer} • {order.email}
                    </p>
                    <p className="text-sm text-gray-500">Date: {formatDate(order.date)}</p>
                    <p className="text-sm font-medium">Total: {formatCurrency(order.total)}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUpdateStatus(order.id, "processing")}
                      >
                        <Package className="h-4 w-4 mr-1" /> Process
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleUpdateStatus(order.id, "shipped")}
                      >
                        <Truck className="h-4 w-4 mr-1" /> Ship
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, ArrowUpDown, Eye, Truck, Package, CheckCircle, XCircle, Clock, Calendar, Download, Printer, MessageSquare, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

// Sample order data
const initialOrders = [
  {
    id: "ORD-2023-1001",
    customer: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
    },
    date: "2023-05-15T10:30:00",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    total: 1249.97,
    items: [
      { id: "dairy-1", name: "Shrikhand", quantity: 2, price: 249.99, total: 499.98 },
      { id: "dairy-6", name: "Organic Ghee", quantity: 1, price: 499.99, total: 499.99 },
      { id: "dairy-4", name: "Paneer", quantity: 1, price: 199.99, total: 199.99 },
    ],
    notes: "Please leave at the front door",
  },
  {
    id: "ORD-2023-1002",
    customer: {
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 87654 32109",
      address: "456 Park Avenue, Delhi, Delhi 110001",
    },
    date: "2023-05-16T14:45:00",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    total: 779.98,
    items: [
      { id: "dairy-2", name: "Amarkhand", quantity: 2, price: 279.99, total: 559.98 },
      { id: "dairy-4", name: "Paneer", quantity: 1, price: 199.99, total: 199.99 },
    ],
    notes: "",
  },
  {
    id: "ORD-2023-1003",
    customer: {
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 76543 21098",
      address: "789 Lake View, Bangalore, Karnataka 560001",
    },
    date: "2023-05-16T16:20:00",
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    total: 499.99,
    items: [{ id: "dairy-6", name: "Organic Ghee", quantity: 1, price: 499.99, total: 499.99 }],
    notes: "Call before delivery",
  },
  {
    id: "ORD-2023-1004",
    customer: {
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      phone: "+91 65432 10987",
      address: "101 Hill Road, Hyderabad, Telangana 500001",
    },
    date: "2023-05-17T09:15:00",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Cash on Delivery",
    total: 729.97,
    items: [
      { id: "dairy-1", name: "Shrikhand", quantity: 1, price: 249.99, total: 249.99 },
      { id: "dairy-4", name: "Paneer", quantity: 2, price: 199.99, total: 399.98 },
      { id: "dairy-2", name: "Amarkhand", quantity: 1, price: 279.99, total: 279.99 },
    ],
    notes: "",
  },
  {
    id: "ORD-2023-1005",
    customer: {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      phone: "+91 54321 09876",
      address: "222 Green Park, Chennai, Tamil Nadu 600001",
    },
    date: "2023-05-17T11:30:00",
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "UPI",
    total: 1029.97,
    items: [
      { id: "dairy-6", name: "Organic Ghee", quantity: 1, price: 499.99, total: 499.99 },
      { id: "dairy-1", name: "Shrikhand", quantity: 1, price: 249.99, total: 249.99 },
      { id: "dairy-4", name: "Paneer", quantity: 1, price: 199.99, total: 199.99 },
    ],
    notes: "Customer requested cancellation",
  },
]

// Define sort options
type SortField = "date" | "id" | "customer" | "total" | "status"
type SortDirection = "asc" | "desc"

interface SortOption {
  field: SortField
  direction: SortDirection
  label: string
}

export default function FarmerOrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState(initialOrders)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const { toast } = useToast()

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Sort options
  const sortOptions: SortOption[] = [
    { field: "date", direction: "desc", label: "Newest First" },
    { field: "date", direction: "asc", label: "Oldest First" },
    { field: "id", direction: "asc", label: "Order ID (A-Z)" },
    { field: "id", direction: "desc", label: "Order ID (Z-A)" },
    { field: "customer", direction: "asc", label: "Customer Name (A-Z)" },
    { field: "customer", direction: "desc", label: "Customer Name (Z-A)" },
    { field: "total", direction: "desc", label: "Amount (High to Low)" },
    { field: "total", direction: "asc", label: "Amount (Low to High)" },
    { field: "status", direction: "asc", label: "Status (A-Z)" },
    { field: "status", direction: "desc", label: "Status (Z-A)" },
  ]

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.field === sortField && opt.direction === sortDirection)
    return option ? option.label : "Sort"
  }

  // Handle sort change
  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field)
    setSortDirection(direction)

    toast({
      title: "Orders Sorted",
      description: `Sorted by ${field} in ${direction === "asc" ? "ascending" : "descending"} order`,
    })
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by tab
      if (activeTab === "pending" && order.status !== "pending") return false
      if (activeTab === "processing" && order.status !== "processing") return false
      if (activeTab === "shipped" && order.status !== "shipped") return false
      if (activeTab === "delivered" && order.status !== "delivered") return false
      if (activeTab === "cancelled" && order.status !== "cancelled") return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.customer.phone.includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected field and direction
      switch (sortField) {
        case "date":
          return sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()

        case "id":
          return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)

        case "customer":
          return sortDirection === "asc"
            ? a.customer.name.localeCompare(b.customer.name)
            : b.customer.name.localeCompare(a.customer.name)

        case "total":
          return sortDirection === "asc" ? a.total - b.total : b.total - a.total

        case "status":
          return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)

        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
            Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            Refunded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const viewOrderDetails = (order: any) => {
    setCurrentOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const openUpdateStatusDialog = (order: any) => {
    setCurrentOrder(order)
    setNewStatus(order.status)
    setIsUpdateStatusOpen(true)
  }

  const handleUpdateStatus = () => {
    if (!currentOrder || !newStatus) return

    // Update order status
    const updatedOrders = orders.map((order) => {
      if (order.id === currentOrder.id) {
        return { ...order, status: newStatus }
      }
      return order
    })

    setOrders(updatedOrders)
    setIsUpdateStatusOpen(false)

    // Show success toast
    toast({
      title: "Order Status Updated",
      description: `Order ${currentOrder.id} has been updated to ${newStatus}.`,
    })
  }

  const printOrder = (orderId: string) => {
    toast({
      title: "Print Initiated",
      description: `Printing order ${orderId}...`,
    })
    // In a real app, this would trigger a print dialog or generate a printable document
  }

  const downloadInvoice = (orderId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice for order ${orderId}...`,
    })
    // In a real app, this would generate and download an invoice PDF
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print List
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 flex-shrink-0">
          <Card>
            <CardHeader style={{ position: "relative", zIndex: 50 }}>
              <CardTitle>Filter Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search orders..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="date" className="pl-8" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="date" className="pl-8" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <div className="space-y-1">
                  {["Paid", "Pending", "Refunded", "Failed"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`payment-${status}`}
                        className="rounded text-green-600 focus:ring-green-600"
                        defaultChecked
                      />
                      <label htmlFor={`payment-${status}`} className="text-sm">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="space-y-1">
                  {["UPI", "Credit Card", "Debit Card", "Cash on Delivery", "Bank Transfer"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`method-${method}`}
                        className="rounded text-green-600 focus:ring-green-600"
                        defaultChecked
                      />
                      <label htmlFor={`method-${method}`} className="text-sm">
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Order List</CardTitle>
                <div className="flex items-center gap-2 relative z-[9997]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 relative z-[9998]">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <span>{getCurrentSortLabel()}</span>
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 z-[9999]"
                      style={{ position: "relative", zIndex: 9999 }}
                    >
                      <DropdownMenuLabel>Sort Orders</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={sortField === "date" && sortDirection === "desc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("date", "desc")}
                      >
                        <span>Newest First</span>
                        {sortField === "date" && sortDirection === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortField === "date" && sortDirection === "asc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("date", "asc")}
                      >
                        <span>Oldest First</span>
                        {sortField === "date" && sortDirection === "asc" && <ArrowUp className="h-3.5 w-3.5 ml-auto" />}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={sortField === "id" && sortDirection === "asc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("id", "asc")}
                      >
                        <span>Order ID (A-Z)</span>
                        {sortField === "id" && sortDirection === "asc" && <ArrowUp className="h-3.5 w-3.5 ml-auto" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortField === "id" && sortDirection === "desc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("id", "desc")}
                      >
                        <span>Order ID (Z-A)</span>
                        {sortField === "id" && sortDirection === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={sortField === "customer" && sortDirection === "asc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("customer", "asc")}
                      >
                        <span>Customer Name (A-Z)</span>
                        {sortField === "customer" && sortDirection === "asc" && (
                          <ArrowUp className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortField === "customer" && sortDirection === "desc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("customer", "desc")}
                      >
                        <span>Customer Name (Z-A)</span>
                        {sortField === "customer" && sortDirection === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={sortField === "total" && sortDirection === "desc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("total", "desc")}
                      >
                        <span>Amount (High to Low)</span>
                        {sortField === "total" && sortDirection === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortField === "total" && sortDirection === "asc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("total", "asc")}
                      >
                        <span>Amount (Low to High)</span>
                        {sortField === "total" && sortDirection === "asc" && (
                          <ArrowUp className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={sortField === "status" && sortDirection === "asc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("status", "asc")}
                      >
                        <span>Status (A-Z)</span>
                        {sortField === "status" && sortDirection === "asc" && (
                          <ArrowUp className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={sortField === "status" && sortDirection === "desc" ? "bg-accent" : ""}
                        onClick={() => handleSortChange("status", "desc")}
                      >
                        <span>Status (Z-A)</span>
                        {sortField === "status" && sortDirection === "desc" && (
                          <ArrowDown className="h-3.5 w-3.5 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" className="md:hidden flex items-center gap-1 relative z-10">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No orders found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{order.id}</h3>
                              {getStatusBadge(order.status)}
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.date)} at {formatTime(order.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => viewOrderDetails(order)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => openUpdateStatusDialog(order)}
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Update
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => printOrder(order.id)}
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Customer</p>
                            <p className="text-sm font-medium">{order.customer.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Items</p>
                            <p className="text-sm">
                              {order.items.length} items, ₹{order.total.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm">{order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-medium text-lg">{currentOrder.id}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentOrder.date)} at {formatTime(currentOrder.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(currentOrder.status)}
                  {getPaymentStatusBadge(currentOrder.paymentStatus)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{currentOrder.customer.name}</p>
                    <p>{currentOrder.customer.email}</p>
                    <p>{currentOrder.customer.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Shipping Address</h4>
                  <p className="text-sm">{currentOrder.customer.address}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            ₹{item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          Subtotal:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ₹{currentOrder.total.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          Shipping:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">₹0.00</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ₹{currentOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-500">Method:</span> {currentOrder.paymentMethod}
                    </p>
                    <p>
                      <span className="text-gray-500">Status:</span> {currentOrder.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Additional Notes</h4>
                  <p className="text-sm">{currentOrder.notes || "No notes provided"}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => downloadInvoice(currentOrder.id)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                <Button
                  variant="outline"
                  onClick={() => printOrder(currentOrder.id)}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Order
                </Button>
                <Button onClick={() => openUpdateStatusDialog(currentOrder)} className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-medium">{currentOrder.id}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(currentOrder.date)} - {currentOrder.customer.name}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="processing">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span>Processing</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="shipped">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-purple-500" />
                        <span>Shipped</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="delivered">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Delivered</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>Cancelled</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Status Update Notes (Optional)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input id="notes" placeholder="Add notes about this status update..." className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notify-customer"
                    className="rounded text-green-600 focus:ring-green-600"
                    defaultChecked
                  />
                  <label htmlFor="notify-customer" className="text-sm">
                    Notify customer about this update
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

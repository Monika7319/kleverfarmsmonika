"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Eye, Mail } from "lucide-react"
import CustomerDetailsModal from "@/components/admin/customer-details-modal"

// Mock customer data
const mockCustomers = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Portland, OR 97201",
    joinDate: "2023-01-15T10:30:00Z",
    orderCount: 12,
    totalSpent: 478.95,
    status: "active",
    lastOrder: "2023-04-10T14:30:00Z",
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Seattle, WA 98101",
    joinDate: "2023-02-20T09:15:00Z",
    orderCount: 8,
    totalSpent: 345.47,
    status: "active",
    lastOrder: "2023-04-09T10:15:00Z",
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    address: "789 Pine St, San Francisco, CA 94101",
    joinDate: "2023-01-05T16:45:00Z",
    orderCount: 15,
    totalSpent: 612.85,
    status: "active",
    lastOrder: "2023-04-08T16:45:00Z",
  },
  {
    id: "cust-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-789-0123",
    address: "321 Maple Dr, Austin, TX 78701",
    joinDate: "2023-03-10T09:20:00Z",
    orderCount: 5,
    totalSpent: 267.92,
    status: "active",
    lastOrder: "2023-04-07T09:20:00Z",
  },
  {
    id: "cust-5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "555-234-5678",
    address: "654 Birch Ln, Chicago, IL 60601",
    joinDate: "2023-02-15T13:10:00Z",
    orderCount: 10,
    totalSpent: 493.45,
    status: "inactive",
    lastOrder: "2023-03-15T13:10:00Z",
  },
  {
    id: "cust-6",
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    phone: "555-345-6789",
    address: "987 Cedar Rd, Denver, CO 80201",
    joinDate: "2023-01-25T11:30:00Z",
    orderCount: 7,
    totalSpent: 312.5,
    status: "active",
    lastOrder: "2023-04-05T11:30:00Z",
  },
  {
    id: "cust-7",
    name: "David Garcia",
    email: "david.garcia@example.com",
    phone: "555-456-7890",
    address: "246 Elm St, Miami, FL 33101",
    joinDate: "2023-03-05T15:40:00Z",
    orderCount: 3,
    totalSpent: 145.75,
    status: "active",
    lastOrder: "2023-04-04T15:40:00Z",
  },
  {
    id: "cust-8",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    phone: "555-567-8901",
    address: "135 Walnut Ave, Boston, MA 02101",
    joinDate: "2023-02-10T10:05:00Z",
    orderCount: 0,
    totalSpent: 0,
    status: "inactive",
    lastOrder: null,
  },
]

export default function CustomersManagement() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  // Filter customers based on search and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter ? customer.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, email, or phone..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || statusFilter) && (
            <Button variant="outline" onClick={clearFilters} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{customer.name}</h3>
                      <Badge className={`ml-2 ${customer.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Email: {customer.email} • Phone: {customer.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined: {formatDate(customer.joinDate)} • Last Order: {formatDate(customer.lastOrder)}
                    </p>
                    <p className="text-sm font-medium">
                      Orders: {customer.orderCount} • Total Spent: {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = `mailto:${customer.email}`)}
                    >
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <CustomerDetailsModal customer={selectedCustomer} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

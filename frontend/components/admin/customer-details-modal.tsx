"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from "lucide-react"

interface CustomerDetailsModalProps {
  customer: any
  isOpen: boolean
  onClose: () => void
}

export default function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  // Mock order history
  const orderHistory = [
    {
      id: "ORD-1001",
      date: "2023-04-10T14:30:00Z",
      total: 78.95,
      status: "delivered",
      items: 5,
    },
    {
      id: "ORD-982",
      date: "2023-03-25T11:15:00Z",
      total: 45.5,
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-943",
      date: "2023-03-10T09:45:00Z",
      total: 62.75,
      status: "delivered",
      items: 4,
    },
    {
      id: "ORD-912",
      date: "2023-02-22T16:30:00Z",
      total: 35.25,
      status: "delivered",
      items: 2,
    },
  ].slice(0, customer.orderCount > 0 ? 4 : 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <Badge className={`ml-2 ${customer.status === "active" ? "bg-green-500" : "bg-gray-500"}`}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-500">Customer ID: {customer.id}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-sm text-gray-500">Joined: {formatDate(customer.joinDate)}</p>
              <p className="text-sm text-gray-500">Last Order: {formatDate(customer.lastOrder)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <p>{customer.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <p>{customer.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                    <p>{customer.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Customer Summary</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500">Member For</p>
                    </div>
                    <p className="text-lg font-medium mt-1">
                      {Math.floor(
                        (new Date().getTime() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
                      )}{" "}
                      months
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                    <p className="text-lg font-medium mt-1">{customer.orderCount}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-purple-500 mr-2" />
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                    <p className="text-lg font-medium mt-1">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
                      <p className="text-sm text-gray-500">Avg. Order Value</p>
                    </div>
                    <p className="text-lg font-medium mt-1">
                      {customer.orderCount > 0 ? formatCurrency(customer.totalSpent / customer.orderCount) : "$0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
              {orderHistory.length > 0 ? (
                <div className="space-y-3">
                  {orderHistory.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.total)}</p>
                            <p className="text-sm text-gray-500">{order.items} items</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No order history</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

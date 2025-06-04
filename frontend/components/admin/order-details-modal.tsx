"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: string, status: string) => void
}

export default function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus }: OrderDetailsModalProps) {
  const [newStatus, setNewStatus] = useState(order.status)

  const formatDate = (dateString: string) => {
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

  const calculateSubtotal = () => {
    return order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // Assuming 8% tax
  }

  const calculateShipping = () => {
    return 5.99 // Flat shipping rate
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold">{order.id}</h2>
              <p className="text-gray-500">Placed on {formatDate(order.date)}</p>
            </div>
            <div className="flex flex-col items-end mt-2 md:mt-0">
              {getStatusBadge(order.status)}
              {order.status === "shipped" && order.trackingNumber && (
                <p className="text-sm mt-1">Tracking: {order.trackingNumber}</p>
              )}
              {order.status === "delivered" && order.deliveryDate && (
                <p className="text-sm mt-1">Delivered: {formatDate(order.deliveryDate)}</p>
              )}
              {order.status === "cancelled" && order.cancellationReason && (
                <p className="text-sm mt-1 text-red-500">{order.cancellationReason}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="mt-2 space-y-1">
                  <p>{order.customer}</p>
                  <p>{order.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <p className="mt-2">{order.shippingAddress}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Payment Information</h3>
                <p className="mt-2">Method: {order.paymentMethod}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.price)} from {item.farm}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{formatCurrency(calculateSubtotal())}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>{formatCurrency(calculateTax())}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>{formatCurrency(calculateShipping())}</p>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <p>Total</p>
                  <p>{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>

          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>
              <div className="flex items-center space-x-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => onUpdateStatus(order.id, newStatus)}
                  disabled={newStatus === order.status}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
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

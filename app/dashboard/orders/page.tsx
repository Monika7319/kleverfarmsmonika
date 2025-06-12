"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Calendar, CreditCard } from "lucide-react"

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  total: number
  product: {
    id: number
    name: string
    image: string
  }
}

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  payment_status: string
  payment_method: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_phone: string
  created_at: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchOrders()
    }
  }, [token, toast])

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      delivered: "bg-green-100 text-green-800 hover:bg-green-100",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
    }

    const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"

    return (
      <Badge className={style} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(amount))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground">When you place orders, they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Order #{order.order_number}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(order.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-2xl font-bold">{formatCurrency(order.total_amount)}</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <Badge variant="outline" className="bg-gray-100">
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Method
                    </h3>
                    <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                      <br />
                      Phone: {order.shipping_phone}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                              {item.product?.image ? (
                                <img
                                  src={item.product.image || "/placeholder.svg"}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x {formatCurrency(item.price.toString())}
                              </p>
                            </div>
                          </div>
                          <div className="font-medium">{formatCurrency(item.total.toString())}</div>
                        </div>
                      ))}
                    </div>
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

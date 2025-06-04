"use client"

import { useAuth } from "@/components/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingBag, Heart, Settings, User, MapPin, Package, Clock, CheckCircle, Truck, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1249.99,
    items: [
      { name: "Organic Shrikhand", quantity: 2, price: 249.99 },
      { name: "Fresh Paneer", quantity: 1, price: 199.99 },
      { name: "Organic Ghee", quantity: 1, price: 549.99 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "shipped",
    total: 899.99,
    items: [
      { name: "Ragi Idli Mix", quantity: 3, price: 199.99 },
      { name: "Mix Dal Dhokla", quantity: 2, price: 100.0 },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-25",
    status: "processing",
    total: 679.99,
    items: [
      { name: "Amarkhand", quantity: 1, price: 279.99 },
      { name: "Organic Soybeans", quantity: 2, price: 149.99 },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "processing":
      return <Clock className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-green-600">KleverFarms</span>
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{user?.name}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      {user?.role === "customer" ? "Customer" : user?.role}
                    </Badge>
                  </div>

                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === "orders" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                    <Button
                      variant={activeTab === "wishlist" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("wishlist")}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button
                      variant={activeTab === "profile" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("profile")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile & Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
                      <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <ShoppingBag className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Total Orders</p>
                              <p className="text-2xl font-bold">{mockOrders.length}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <Package className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Active Orders</p>
                              <p className="text-2xl font-bold">
                                {mockOrders.filter((o) => o.status !== "delivered").length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                              <p className="text-2xl font-bold">5</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Orders */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockOrders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                {getStatusIcon(order.status)}
                                <div>
                                  <p className="font-medium">{order.id}</p>
                                  <p className="text-sm text-gray-600">{order.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₹{order.total.toFixed(2)}</p>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full" onClick={() => setActiveTab("orders")}>
                            View All Orders
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mockOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{order.id}</h3>
                                <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-lg">₹{order.total.toFixed(2)}</p>
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{order.status}</span>
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                                >
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  </div>
                                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                              {order.status === "delivered" && (
                                <Button variant="outline" size="sm">
                                  <Star className="h-4 w-4 mr-1" />
                                  Rate & Review
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Wishlist Tab */}
                <TabsContent value="wishlist">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-600 mb-4">Save items you love to buy them later</p>
                        <Link href="/">
                          <Button>Continue Shopping</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <p className="p-2 bg-gray-50 rounded border">{user?.name}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <p className="p-2 bg-gray-50 rounded border">{user?.email}</p>
                          </div>
                        </div>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Delivery Addresses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                          <p className="text-gray-600 mb-4">Add a delivery address to get started</p>
                          <Button>
                            <MapPin className="h-4 w-4 mr-2" />
                            Add Address
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

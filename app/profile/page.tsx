"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/auth-context"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  Edit,
  Save,
  Package,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react"
import Image from "next/image"

interface WishlistItem {
  id: number
  product: {
    id: number
    name: string
    price: number
    unit: string
    image: string
    discount: number
    farm: {
      name: string
    }
  }
  created_at: string
}

interface OrderItem {
  id: number
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_unit: string
  product: {
    id: number
    name: string
    image: string
  }
}

interface Order {
  id: number
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string
  delivery_address: string
  delivery_city: string
  delivery_state: string
  delivery_zip_code: string
  delivery_phone: string
  ordered_at: string
  delivered_at: string | null
  order_items: OrderItem[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function ProfilePage() {
  const { customer, token, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  })

  useEffect(() => {
    if (customer) {
      setProfileData({
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zip_code: customer.zip_code || "",
      })
    }
  }, [customer])

  useEffect(() => {
    if (token) {
      fetchWishlist()
      fetchOrders()
    }
  }, [token])

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setWishlist(data.wishlist)
        }
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setWishlist((prev) => prev.filter((item) => item.product.id !== productId))
        toast({
          title: "Success",
          description: "Product removed from wishlist",
        })
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and view your activity</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details and contact information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input id="email" value={customer.email} disabled className="bg-gray-50" />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="zip_code"
                      value={profileData.zip_code}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, zip_code: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, state: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your state"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                My Wishlist ({wishlist.length})
              </CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600">Start adding products you love to your wishlist</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={item.product.image || "/placeholder.svg?height=200&width=300&query=product"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        {item.product.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500">{item.product.discount}% OFF</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">by {item.product.farm.name}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-600">
                              {formatCurrency(item.product.price * (1 - item.product.discount / 100))}
                            </span>
                            <span className="text-sm text-gray-500">per {item.product.unit}</span>
                          </div>
                          {item.product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(item.product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.product.id)}>
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                My Orders ({orders.length})
              </CardTitle>
              <CardDescription>Track your order history and status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-pulse" />
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">When you place orders, they'll appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(order.ordered_at)}
                              </span>
                              <span className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-1" />
                                {order.payment_method}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(order.total_amount)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusBadge(order.status)}
                              <Badge
                                variant="outline"
                                className={order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}
                              >
                                {order.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Truck className="h-4 w-4 mr-2" />
                                Delivery Address
                              </h4>
                              <p className="text-sm text-gray-600">
                                {order.delivery_address}
                                <br />
                                {order.delivery_city}, {order.delivery_state} {order.delivery_zip_code}
                                <br />
                                Phone: {order.delivery_phone}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {order.order_items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                          src={
                                            item.product?.image || "/placeholder.svg?height=32&width=32&query=product"
                                          }
                                          alt={item.product_name}
                                          width={32}
                                          height={32}
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-gray-500">
                                          {item.quantity} × {formatCurrency(item.unit_price)} per {item.product_unit}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="font-medium">{formatCurrency(item.total_price)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, CheckCircle, Clock, User, MapPin, Phone, Mail, Tractor } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FarmerDashboardPreview() {
  // Demo data
  const farmer = {
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    farm_name: "Green Valley Farm",
    farm_address: "Village Rampur, Tehsil Kharkhoda",
    farm_city: "Sonipat",
    farm_state: "Haryana",
    is_verified: true,
  }

  const approvedProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      price: 80,
      unit: "kg",
      stock: 50,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: true,
    },
    {
      id: 3,
      name: "Wheat Flour",
      category: "Grains",
      price: 45,
      unit: "kg",
      stock: 100,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: true,
    },
  ]

  const pendingProducts = [
    {
      id: 2,
      name: "Fresh Milk",
      category: "Dairy",
      price: 60,
      unit: "liter",
      stock: 20,
      image: "/placeholder.svg?height=200&width=200",
      is_approved: false,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getApprovalBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending Approval
        </Badge>
      )
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-white">
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Tractor className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">KleverFarms</span>
            </div>
          </div>

          <div className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-green-100 text-green-900">
                <User className="mr-3 h-4 w-4" />
                Dashboard
              </div>
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Tractor className="mr-3 h-4 w-4" />
                Farm Profile
              </div>
              <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Package className="mr-3 h-4 w-4" />
                Products
              </div>
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Rajesh Kumar</span>
                <span className="text-xs text-muted-foreground">rajesh@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Welcome back! Manage your farm and products.</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Farmer Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Farmer Profile
                {farmer.is_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg">{farmer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Farm Name</p>
                    <p className="text-lg">{farmer.farm_name}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{farmer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{farmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {farmer.farm_address}, {farmer.farm_city}, {farmer.farm_state}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedProducts.length + pendingProducts.length}</div>
                <p className="text-xs text-muted-foreground">All your products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Products</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedProducts.length}</div>
                <p className="text-xs text-muted-foreground">Ready for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingProducts.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting admin review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    [...approvedProducts, ...pendingProducts].reduce(
                      (total, product) => total + product.price * product.stock,
                      0,
                    ),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Current inventory value</p>
              </CardContent>
            </Card>
          </div>

          {/* Products Sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Approved Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Approved Products
                </CardTitle>
                <CardDescription>Products approved by admin and available for sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(product.price)}/{product.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        {getApprovalBadge(product.is_approved)}
                        <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending Approval
                </CardTitle>
                <CardDescription>Products waiting for admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No products pending approval</p>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <p className="text-sm font-medium text-green-600">
                            {formatCurrency(product.price)}/{product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          {getApprovalBadge(product.is_approved)}
                          <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="w-full justify-start h-auto p-4" variant="outline">
                  <div className="flex flex-col items-start gap-2">
                    <Plus className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Add New Product</p>
                      <p className="text-xs text-gray-500">Create a new product listing</p>
                    </div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-auto p-4" variant="outline">
                  <div className="flex flex-col items-start gap-2">
                    <Package className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Manage Products</p>
                      <p className="text-xs text-gray-500">View and edit your products</p>
                    </div>
                  </div>
                </Button>
                <Button className="w-full justify-start h-auto p-4" variant="outline">
                  <div className="flex flex-col items-start gap-2">
                    <User className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Update Profile</p>
                      <p className="text-xs text-gray-500">Edit your farm information</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

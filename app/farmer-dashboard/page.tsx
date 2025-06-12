"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Package, CheckCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

interface Product {
  id: number
  name: string
  category: string
  price: number
  unit: string
  stock: number
  image: string | null
  image_url: string | null
  is_approved: boolean
}

export default function FarmerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("farm_token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProducts(data.products || [])
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const approvedProducts = products.filter((p) => p.is_approved)
  const pendingProducts = products.filter((p) => !p.is_approved)
  const totalStockValue = products.reduce((total, product) => total + product.price * product.stock, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getImageUrl = (product: Product) => {
    if (product.image_url) return product.image_url
    if (product.image) return `${API_BASE_URL}/storage/products/${product.image}`
    return "/placeholder.svg?height=48&width=48"
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your farm's overview.</p>
        </div>
        <Link href="/farmer-dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
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
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Recent Approved Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No approved products yet</p>
            ) : (
              <div className="space-y-4">
                {approvedProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={getImageUrl(product) || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </div>
                ))}
                {approvedProducts.length > 3 && (
                  <Link href="/farmer-dashboard/products">
                    <Button variant="outline" className="w-full">
                      View All Products
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending products</p>
            ) : (
              <div className="space-y-4">
                {pendingProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={getImageUrl(product) || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

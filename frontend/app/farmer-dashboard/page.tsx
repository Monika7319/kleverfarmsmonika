import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Package, ShoppingBag, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import Link from "next/link"

export default function FarmerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Dr. Madhura Joshi! Here's an overview of your farm's performance.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">Download Reports</Button>
          <Button>
            View Farm Page <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+4</span> new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500">5</span> pending delivery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your farm's sales performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-gray-400" />
              <span className="ml-2 text-gray-500">Sales chart will appear here</span>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your most recent customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "ORD-001",
                  customer: "Rahul Sharma",
                  date: "2023-05-15",
                  status: "delivered",
                  total: "₹1,249.95",
                },
                { id: "ORD-002", customer: "Priya Patel", date: "2023-05-18", status: "processing", total: "₹839.97" },
                { id: "ORD-003", customer: "Amit Desai", date: "2023-05-20", status: "shipped", total: "₹1,199.97" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Organic Ghee", sales: 42, revenue: "₹20,999.58" },
                { name: "Shrikhand", sales: 38, revenue: "₹9,499.62" },
                { name: "Amarkhand", sales: 31, revenue: "₹8,679.69" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Products that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Organic Ghee", stock: 5, status: "low" },
                { name: "Paneer", stock: 8, status: "low" },
                { name: "Amarkhand", stock: 0, status: "out" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center ${product.status === "out" ? "bg-red-100" : "bg-amber-100"}`}
                    >
                      <AlertCircle
                        className={`h-5 w-5 ${product.status === "out" ? "text-red-600" : "text-amber-600"}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className={`text-sm ${product.status === "out" ? "text-red-500" : "text-amber-500"}`}>
                        {product.status === "out" ? "Out of stock" : `Low stock: ${product.stock} left`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Restock
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/farmer/products/new">
                <Button className="w-full justify-start" variant="outline">
                  Add New Product
                </Button>
              </Link>
              <Link href="/farmer/orders">
                <Button className="w-full justify-start" variant="outline">
                  Process Orders
                </Button>
              </Link>
              <Link href="/farmer/profile">
                <Button className="w-full justify-start" variant="outline">
                  Update Farm Profile
                </Button>
              </Link>
              <Link href="/farmer/media">
                <Button className="w-full justify-start" variant="outline">
                  Upload New Photos
                </Button>
              </Link>
              <Link href="/farmer/analytics">
                <Button className="w-full justify-start" variant="outline">
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

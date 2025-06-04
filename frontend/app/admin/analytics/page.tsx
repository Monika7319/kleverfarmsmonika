"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

// Mock data for analytics
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
  { name: "Aug", value: 6500 },
  { name: "Sep", value: 8000 },
  { name: "Oct", value: 7500 },
  { name: "Nov", value: 9000 },
  { name: "Dec", value: 10000 },
]

const visitorData = [
  { name: "Week 1", value: 1000 },
  { name: "Week 2", value: 1200 },
  { name: "Week 3", value: 1500 },
  { name: "Week 4", value: 1300 },
  { name: "Week 5", value: 1600 },
  { name: "Week 6", value: 2000 },
  { name: "Week 7", value: 1800 },
  { name: "Week 8", value: 2200 },
  { name: "Week 9", value: 2500 },
  { name: "Week 10", value: 2300 },
  { name: "Week 11", value: 2600 },
  { name: "Week 12", value: 3000 },
]

const categoryData = [
  { name: "Vegetables", value: 35 },
  { name: "Fruits", value: 25 },
  { name: "Dairy", value: 20 },
  { name: "Meat", value: 15 },
  { name: "Others", value: 5 },
]

const farmPerformanceData = [
  { name: "Green Valley Organics", sales: 12500, orders: 250, products: 15 },
  { name: "Sunrise Dairy Farm", sales: 9800, orders: 180, products: 8 },
  { name: "Happy Hen Poultry", sales: 8500, orders: 160, products: 6 },
  { name: "Riverside Orchards", sales: 11200, orders: 210, products: 12 },
  { name: "Mountain Meadow Honey", sales: 7500, orders: 140, products: 5 },
]

const customerAcquisitionData = [
  { name: "Jan", organic: 120, referral: 80, social: 40 },
  { name: "Feb", organic: 140, referral: 70, social: 50 },
  { name: "Mar", organic: 160, referral: 90, social: 60 },
  { name: "Apr", organic: 180, referral: 100, social: 70 },
  { name: "May", organic: 200, referral: 110, social: 80 },
  { name: "Jun", organic: 220, referral: 120, social: 90 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="farms">Farms</TabsTrigger>
        </TabsList>

        {/* Sales Analytics */}
        <TabsContent value="sales" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sales (MTD)</p>
                    <h3 className="text-2xl font-bold mt-1">$24,500</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Orders (MTD)</p>
                    <h3 className="text-2xl font-bold mt-1">458</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+8.2%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold mt-1">$53.49</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+3.7%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                   
                  <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
  <Bar dataKey="value" fill="#4ade80" />
</BarChart>





                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visitors Analytics */}
        <TabsContent value="visitors" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Visitors (MTD)</p>
                    <h3 className="text-2xl font-bold mt-1">15,782</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+18.3%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <h3 className="text-2xl font-bold mt-1">2.9%</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+0.5%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                    <h3 className="text-2xl font-bold mt-1">42.1%</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">-3.2%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerAcquisitionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="organic" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="referral" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="social" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Analytics */}
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <h3 className="text-2xl font-bold mt-1">248</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+15</span>
                  <span className="text-gray-500 ml-1">new this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">+3</span>
                  <span className="text-gray-500 ml-1">since last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Top Selling Category</p>
                    <h3 className="text-2xl font-bold mt-1">Vegetables</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">35% of total sales</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Farm</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Units Sold</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Organic Apples</td>
                      <td className="py-3 px-4">Green Valley Organics</td>
                      <td className="py-3 px-4">Fruits</td>
                      <td className="py-3 px-4 text-right">1,245</td>
                      <td className="py-3 px-4 text-right">$6,212.55</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Fresh Milk</td>
                      <td className="py-3 px-4">Sunrise Dairy Farm</td>
                      <td className="py-3 px-4">Dairy</td>
                      <td className="py-3 px-4 text-right">980</td>
                      <td className="py-3 px-4 text-right">$3,420.20</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Free-Range Eggs</td>
                      <td className="py-3 px-4">Happy Hen Poultry</td>
                      <td className="py-3 px-4">Eggs</td>
                      <td className="py-3 px-4 text-right">875</td>
                      <td className="py-3 px-4 text-right">$5,241.25</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Organic Carrots</td>
                      <td className="py-3 px-4">Green Valley Organics</td>
                      <td className="py-3 px-4">Vegetables</td>
                      <td className="py-3 px-4 text-right">750</td>
                      <td className="py-3 px-4 text-right">$2,992.50</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Wildflower Honey</td>
                      <td className="py-3 px-4">Mountain Meadow Honey</td>
                      <td className="py-3 px-4">Honey</td>
                      <td className="py-3 px-4 text-right">620</td>
                      <td className="py-3 px-4 text-right">$5,573.80</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farms Analytics */}
        <TabsContent value="farms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Farms</p>
                    <h3 className="text-2xl font-bold mt-1">42</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+5</span>
                  <span className="text-gray-500 ml-1">new this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                    <h3 className="text-2xl font-bold mt-1">7</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-orange-500 font-medium">+3</span>
                  <span className="text-gray-500 ml-1">since last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Top Performing Farm</p>
                    <h3 className="text-2xl font-bold mt-1">Green Valley Organics</h3>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-500">$12,500 in sales this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Farm Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={farmPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                    <Legend />
                    <Bar dataKey="sales" fill="#4ade80" name="Sales ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag, Store } from "lucide-react"

// Mock data for the dashboard
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
]

const visitorData = [
  { name: "Mon", value: 1000 },
  { name: "Tue", value: 1200 },
  { name: "Wed", value: 1500 },
  { name: "Thu", value: 1300 },
  { name: "Fri", value: 1600 },
  { name: "Sat", value: 2000 },
  { name: "Sun", value: 1800 },
]

const categoryData = [
  { name: "Vegetables", value: 35 },
  { name: "Fruits", value: 25 },
  { name: "Dairy", value: 20 },
  { name: "Meat", value: 15 },
  { name: "Others", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminDashboard() {
  const [pendingFarms, setPendingFarms] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [lowStockItems, setLowStockItems] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setPendingFarms(5)
    setPendingOrders(12)
    setLowStockItems(8)
    setUnreadMessages(3)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Farm Approvals</p>
                <h3 className="text-2xl font-bold mt-1">{pendingFarms}</h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="text-gray-500 ml-1">since yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                <h3 className="text-2xl font-bold mt-1">{pendingOrders}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-3</span>
              <span className="text-gray-500 ml-1">since yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold mt-1">{lowStockItems}</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+1</span>
              <span className="text-gray-500 ml-1">since yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                <h3 className="text-2xl font-bold mt-1">{unreadMessages}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-2</span>
              <span className="text-gray-500 ml-1">since yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
                  <Tooltip />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New farm registration",
                  description: "Green Valley Organics submitted a registration request",
                  time: "10 minutes ago",
                },
                {
                  title: "Order #1234 status updated",
                  description: "Order marked as delivered by Farm Fresh Delivery",
                  time: "1 hour ago",
                },
                {
                  title: "Low stock alert",
                  description: "Organic Apples (5kg) is running low on stock",
                  time: "2 hours ago",
                },
                {
                  title: "New customer message",
                  description: "Jane Smith has a question about her recent order",
                  time: "3 hours ago",
                },
                {
                  title: "Farm approved",
                  description: "Sunshine Dairy Farm was approved by admin",
                  time: "5 hours ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

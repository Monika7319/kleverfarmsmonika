"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  ShoppingBasket,
  Truck,
  Package,
  MessageSquare,
  Users,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Farm Approvals", href: "/admin/farms", icon: Store },
    { name: "Products", href: "/admin/products", icon: ShoppingBasket },
    { name: "Orders", href: "/admin/orders", icon: Truck },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-green-600 text-white md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">KleverFarms</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        isActive ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                      {item.name === "Messages" && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                A
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">admin@kleverfarms.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

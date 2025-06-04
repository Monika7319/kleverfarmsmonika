"use client"

import { useAuth } from "@/components/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-green-600">KleverFarms</span>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
            <p className="text-gray-600 mb-6">
              You are logged in as a <span className="font-semibold capitalize">{user?.role}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
                <p className="text-gray-600 mb-4">Manage your account settings and preferences</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">View Profile</Button>
              </div>

              {user?.role === "customer" && (
                <>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Your Orders</h2>
                    <p className="text-gray-600 mb-4">Track, manage, and review your orders</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View Orders</Button>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Your Wishlist</h2>
                    <p className="text-gray-600 mb-4">View and manage your saved items</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">View Wishlist</Button>
                  </div>
                </>
              )}

              {user?.role === "farmer" && (
                <>
                  <div className="bg-amber-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Your Farm</h2>
                    <p className="text-gray-600 mb-4">Manage your farm details and products</p>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Manage Farm</Button>
                  </div>
                  <div className="bg-cyan-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Sales Analytics</h2>
                    <p className="text-gray-600 mb-4">View your sales performance and statistics</p>
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700">View Analytics</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

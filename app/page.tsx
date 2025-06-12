"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShoppingBag, Heart, User } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-green-600">KleverFarms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect directly with local farmers and get fresh, organic produce delivered to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <User className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Manage Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep your personal information up to date and manage your account settings
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Track Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View your order history and track the status of your current orders</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <CardTitle>Save Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create a wishlist of your favorite products for easy ordering later</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

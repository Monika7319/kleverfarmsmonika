"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/utils"

export function DemoLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [email, setEmail] = useState("rajesh@example.com")
  const [password, setPassword] = useState("password")
  const { toast } = useToast()

  const handleRealLogin = async () => {
    setIsLoggingIn(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/farmer/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.token) {
        // Store the token with the correct key
        localStorage.setItem("token", data.token)
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("farm_token", data.token)

        toast({
          title: "Login Successful",
          description: "You are now logged in.",
        })

        // Refresh the page to trigger data fetch
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Could not connect to server",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoLogin = () => {
    // Simulate a demo token for testing
    const demoToken = "demo_token_" + Date.now()
    localStorage.setItem("token", demoToken)
    localStorage.setItem("auth_token", demoToken)
    localStorage.setItem("farm_token", demoToken)

    toast({
      title: "Demo Login Successful",
      description: "You are now logged in with demo credentials.",
    })

    // Refresh the page to trigger data fetch
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("farm_token")
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    })
    window.location.reload()
  }

  const isLoggedIn =
    typeof window !== "undefined" &&
    (localStorage.getItem("token") || localStorage.getItem("auth_token") || localStorage.getItem("farm_token"))

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          {isLoggedIn ? "You are currently logged in." : "Log in to access the farmer dashboard."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRealLogin} disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login with Backend"}
              </Button>
              <Button onClick={handleDemoLogin} variant="outline" disabled={isLoggingIn}>
                Demo Login
              </Button>
            </div>
            <p className="text-sm text-gray-500">Default credentials: rajesh@example.com / password</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

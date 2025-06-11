"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function DemoLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { toast } = useToast()

  const handleDemoLogin = () => {
    setIsLoggingIn(true)

    // Simulate a demo token for testing
    const demoToken = "demo_token_" + Date.now()
    localStorage.setItem("token", demoToken)

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
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    })
    window.location.reload()
  }

  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token")

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Demo Authentication</CardTitle>
        <CardDescription>
          {isLoggedIn
            ? "You are currently logged in with demo credentials."
            : "Log in with demo credentials to test the farmer dashboard."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoggedIn ? (
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        ) : (
          <Button onClick={handleDemoLogin} disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login as Demo Farmer"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

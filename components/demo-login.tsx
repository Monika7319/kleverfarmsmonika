"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface DemoLoginProps {
  children?: React.ReactNode
}

const DemoLogin: React.FC<DemoLoginProps> = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleDemoLogin = () => {
    setIsLoggingIn(true)

    // Simulate a demo token for testing
    const demoToken = "demo_token_" + Date.now()
    localStorage.setItem("token", demoToken)

    toast({
      title: "Demo Login Successful",
      description: "You are now logged in with demo credentials.",
    })

    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      setIsLoggingIn(false)
      window.location.href = window.location.pathname
    }, 1000)
  }

  return (
    <Button variant="outline" disabled={isLoggingIn} onClick={handleDemoLogin}>
      {isLoggingIn ? "Logging in..." : "Demo Login"}
    </Button>
  )
}

export default DemoLogin

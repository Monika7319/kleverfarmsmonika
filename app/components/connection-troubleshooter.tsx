"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: any
}

export function ConnectionTroubleshooter() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: TestResult["status"], message: string, details?: any) => {
    setTests((prev) => {
      const existing = prev.find((t) => t.name === name)
      const newTest = { name, status, message, details }

      if (existing) {
        return prev.map((t) => (t.name === name ? newTest : t))
      } else {
        return [...prev, newTest]
      }
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setTests([])

    // Test 1: Check environment configuration
    updateTest("Environment Config", "pending", "Checking configuration...")
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!apiUrl) {
      updateTest("Environment Config", "error", "NEXT_PUBLIC_API_BASE_URL not set in .env.local")
    } else {
      updateTest("Environment Config", "success", `API URL: ${apiUrl}`)
    }

    // Test 2: Basic network connectivity
    updateTest("Network Connectivity", "pending", "Testing basic connectivity...")
    const baseUrl = apiUrl || "http://localhost:8000"

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(baseUrl, {
        method: "GET",
        signal: controller.signal,
        mode: "cors",
      })

      clearTimeout(timeoutId)
      updateTest("Network Connectivity", "success", `Server responded with status: ${response.status}`)
    } catch (error: any) {
      if (error.name === "AbortError") {
        updateTest("Network Connectivity", "error", "Connection timeout - server may be down")
      } else if (error.message.includes("CORS")) {
        updateTest("Network Connectivity", "warning", "CORS error - server is running but CORS not configured")
      } else if (error.message.includes("Failed to fetch")) {
        updateTest("Network Connectivity", "error", "Cannot reach server - check if Laravel is running")
      } else {
        updateTest("Network Connectivity", "error", `Network error: ${error.message}`)
      }
    }

    // Test 3: Laravel API health check
    updateTest("Laravel API", "pending", "Testing Laravel API endpoints...")
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        updateTest("Laravel API", "success", "Laravel API is responding", data)
      } else {
        updateTest("Laravel API", "warning", `API responded with status: ${response.status}`)
      }
    } catch (error: any) {
      updateTest("Laravel API", "error", `Laravel API error: ${error.message}`)
    }

    // Test 4: Authentication endpoint
    updateTest("Auth Endpoint", "pending", "Testing authentication endpoint...")
    try {
      const response = await fetch(`${baseUrl}/api/auth/farmer/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "wrongpassword",
        }),
      })

      if (response.status === 401 || response.status === 422) {
        updateTest("Auth Endpoint", "success", "Auth endpoint is working (returned expected error)")
      } else if (response.ok) {
        updateTest("Auth Endpoint", "success", "Auth endpoint is working")
      } else {
        updateTest("Auth Endpoint", "warning", `Auth endpoint returned: ${response.status}`)
      }
    } catch (error: any) {
      updateTest("Auth Endpoint", "error", `Auth endpoint error: ${error.message}`)
    }

    // Test 5: Products endpoint (with mock token)
    updateTest("Products Endpoint", "pending", "Testing products endpoint...")
    try {
      const response = await fetch(`${baseUrl}/api/farmer/products`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      })

      if (response.status === 401) {
        updateTest("Products Endpoint", "success", "Products endpoint is working (requires auth)")
      } else if (response.ok) {
        updateTest("Products Endpoint", "success", "Products endpoint is working")
      } else {
        updateTest("Products Endpoint", "warning", `Products endpoint returned: ${response.status}`)
      }
    } catch (error: any) {
      updateTest("Products Endpoint", "error", `Products endpoint error: ${error.message}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "pending":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
      pending: "outline",
    } as const

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Connection Troubleshooter</CardTitle>
        <CardDescription>Diagnose connection issues between frontend and Laravel backend</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            "Run Connection Tests"
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">{getStatusIcon(test.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{test.name}</span>
                    {getStatusBadge(test.status)}
                  </div>
                  <p className="text-sm text-gray-600">{test.message}</p>
                  {test.details && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tests.length > 0 && !isRunning && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {tests.some((t) => t.name === "Environment Config" && t.status === "error") && (
                <li>• Create .env.local file with NEXT_PUBLIC_API_BASE_URL=http://localhost:8000</li>
              )}
              {tests.some((t) => t.name === "Network Connectivity" && t.status === "error") && (
                <li>• Start your Laravel server: php artisan serve</li>
              )}
              {tests.some((t) => t.message.includes("CORS")) && <li>• Configure CORS in Laravel (config/cors.php)</li>}
              {tests.some((t) => t.name === "Laravel API" && t.status === "error") && (
                <li>• Check Laravel routes and ensure API endpoints exist</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

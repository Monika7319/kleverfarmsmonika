"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { API_BASE_URL, authHeaders } from "@/lib/utils"

export function DebugInfo() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult("Testing connection...")

    try {
      // Test basic connection
      const response = await fetch(`${API_BASE_URL}/api/farmer/dashboard`, {
        headers: authHeaders(),
      })

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      }

      if (response.ok) {
        const data = await response.json()
        setTestResult(`✅ Connection successful!\n${JSON.stringify({ ...result, data }, null, 2)}`)
      } else {
        const errorText = await response.text()
        setTestResult(`❌ Connection failed!\n${JSON.stringify({ ...result, error: errorText }, null, 2)}`)
      }
    } catch (error: any) {
      setTestResult(`❌ Network error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("auth_token") || localStorage.getItem("farm_token")
      : null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
        <CardDescription>Connection and authentication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>API Base URL:</strong> {API_BASE_URL}
          </div>
          <div>
            <strong>Token Present:</strong> {token ? "✅ Yes" : "❌ No"}
          </div>
        </div>

        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test API Connection"}
        </Button>

        {testResult && <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">{testResult}</pre>}
      </CardContent>
    </Card>
  )
}

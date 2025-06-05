"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ProductForm } from "../../../components/product-form"
import type { Product } from "../../../page"

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

  // Get auth headers
  const getAuthHeaders = () => {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Handle form submission
  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const data = await response.json()

      toast({
        title: "Product Added",
        description: `${data.product.name} has been added successfully.`,
      })

      // Redirect back to products list
      router.push("/farmer-dashboard/products")
    } catch (err: any) {
      console.error("Error adding product:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.push("/farmer-dashboard/products")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Fill in the details to add a new product to your inventory.</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Provide detailed information about your product. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardContent>
        </Card>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium">Adding product...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

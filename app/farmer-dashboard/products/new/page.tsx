"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authHeaders, API_BASE_URL } from "@/lib/utils"

interface ProductFormData {
  name: string
  category: string
  price: string
  unit: string
  discount: string
  description: string
  stock: string
  is_featured: boolean
  is_seasonal: boolean
  image: string
}

const categories = ["Vegetables", "Fruits", "Dairy", "Grains", "Herbs", "Honey", "Preserves", "Other"]

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "Vegetables",
    price: "",
    unit: "",
    discount: "0",
    description: "",
    stock: "0",
    is_featured: false,
    is_seasonal: false,
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setPreviewUrl(URL.createObjectURL(file))

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required"
    }

    if (
      formData.discount &&
      (isNaN(Number(formData.discount)) || Number(formData.discount) < 0 || Number(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100"
    }

    if (formData.stock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = "Stock must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const form = new FormData()
      form.append("name", formData.name)
      form.append("category", formData.category)
      form.append("price", formData.price)
      form.append("unit", formData.unit)
      form.append("discount", formData.discount)
      form.append("stock", formData.stock)
      form.append("description", formData.description)
      form.append("is_featured", String(formData.is_featured))
      form.append("is_seasonal", String(formData.is_seasonal))
      if (image) form.append("image", image)

      const response = await fetch(`${API_BASE_URL}/api/farmer/products`, {
        method: "POST",
        headers: {
          Authorization: authHeaders().Authorization, // Don't set Content-Type for FormData
        },
        body: form,
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">Create a new product to sell from your farm</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Basic details about your product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                  Product Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className={errors.category ? "text-red-500" : ""}>
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={3}
              />
            </div>

            {/* Price, Unit, Discount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className={errors.price ? "text-red-500" : ""}>
                  Price (₹) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className={errors.unit ? "text-red-500" : ""}>
                  Unit *
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="kg, piece, liter"
                  className={errors.unit ? "border-red-500" : ""}
                />
                {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className={errors.stock ? "text-red-500" : ""}>
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className={errors.image ? "text-red-500" : ""}>Product Image</Label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer">
                    <Button variant="outline" type="button" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="text-sm text-gray-500">Recommended: 800×800px or larger, JPG or PNG format</p>
                  {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleSwitchChange("is_featured", checked)}
                />
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_seasonal"
                  checked={formData.is_seasonal}
                  onCheckedChange={(checked) => handleSwitchChange("is_seasonal", checked)}
                />
                <Label htmlFor="is_seasonal">Seasonal Product</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

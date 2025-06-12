"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Loader2 } from "lucide-react"
import type { Product } from "../page"

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: Partial<Product>) => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "Vegetables",
    price: initialData?.price?.toString() || "",
    unit: initialData?.unit || "",
    discount: initialData?.discount?.toString() || "0",
    description: initialData?.description || "",
    stock: initialData?.stock?.toString() || "0",
    image: initialData?.image || "",
    is_featured: initialData?.is_featured || false,
    is_seasonal: initialData?.is_seasonal || false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image ? initialData.image : null)

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

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }))
      return
    }

    // Store the actual file for upload
    setImageFile(file)

    // Create a preview URL
    const imageUrl = URL.createObjectURL(file)
    setPreviewUrl(imageUrl)

    // Clear error when file is selected
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl(null)
    setFormData((prev) => ({ ...prev, image: "" }))

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("name", formData.name)
      formData.append("category", formData.category)
      formData.append("price", formData.price)
      formData.append("unit", formData.unit)
      formData.append("discount", formData.discount || "0")
      formData.append("description", formData.description || "")
      formData.append("stock", formData.stock || "0")
      formData.append("is_featured", String(formData.is_featured))
      formData.append("is_seasonal", String(formData.is_seasonal))

      // Add image file if selected
      if (imageFile) {
        formData.append("image", imageFile)
      }

      await onSubmit(formData as any)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
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
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Dairy">Dairy Products</SelectItem>
                <SelectItem value="Grains">Grains & Cereals</SelectItem>
                <SelectItem value="Herbs">Herbs & Spices</SelectItem>
                <SelectItem value="Honey">Honey & Bee Products</SelectItem>
                <SelectItem value="Preserves">Jams & Preserves</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>
        </div>

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
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4">
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
            <Label htmlFor="discount" className={errors.discount ? "text-red-500" : ""}>
              Discount (%)
            </Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              max="100"
              className={errors.discount ? "border-red-500" : ""}
            />
            {errors.discount && <p className="text-xs text-red-500">{errors.discount}</p>}
          </div>
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
      <div className="space-y-4">
        <Label className={errors.image ? "text-red-500" : ""}>Product Image</Label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-dashed border-gray-300">
            {previewUrl ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-xs">No image</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Button type="button" variant="outline" onClick={handleUploadClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {previewUrl ? "Change Image" : "Upload Image"}
            </Button>
            {previewUrl && (
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Remove Image
              </Button>
            )}
            <p className="text-sm text-gray-500">Recommended: 800x800px or larger, JPG or PNG format (max 5MB)</p>
            {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
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
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? "Updating..." : "Adding..."}
            </>
          ) : initialData ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  )
}

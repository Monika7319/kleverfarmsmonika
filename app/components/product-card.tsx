"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Product } from "../page"

interface ProductCardProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  // Calculate discounted price
  const discountedPrice = product.discount > 0 ? product.price - (product.price * product.discount) / 100 : null

  // Handle image URL - support both local and remote images
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "/placeholder.svg?height=400&width=400"

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath

    // If it starts with /storage/, it's a Laravel storage path
    if (imagePath.startsWith("/storage/")) return `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`

    // If it's just a filename, construct the full path
    if (!imagePath.startsWith("/")) return `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/products/${imagePath}`

    return imagePath
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product.image) || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=400&width=400"
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.is_featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
          {product.is_seasonal && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Seasonal
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
            {product.stock > 0 ? `${product.stock} ${product.unit}` : "Out of Stock"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.category}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {product.description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{discountedPrice?.toFixed(2) || product.price.toFixed(2)}
            </span>
            {discountedPrice && <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>}
            <span className="text-sm text-gray-500">/{product.unit}</span>
            {product.discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

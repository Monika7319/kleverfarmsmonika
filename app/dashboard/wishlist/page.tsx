"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Heart, ShoppingCart, Trash2, Package } from "lucide-react"

interface WishlistItem {
  id: number
  product: {
    id: number
    name: string
    description: string
    price: string
    image: string
    stock: number
  }
}

export default function WishlistPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist")
        }

        const data = await response.json()
        if (data.success) {
          setWishlist(data.wishlist)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch wishlist",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchWishlist()
    }
  }, [token, toast])

  const removeFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      const data = await response.json()
      if (data.success) {
        setWishlist((prev) => prev.filter((item) => item.product.id !== productId))
        toast({
          title: "Success",
          description: "Product removed from wishlist",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from wishlist",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.parseFloat(amount))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground">Save items you like to your wishlist</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {item.product.image ? (
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {item.product.stock <= 0 && <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">{formatCurrency(item.product.price)}</span>
                  <Badge variant="outline" className={item.product.stock > 0 ? "bg-green-100" : "bg-red-100"}>
                    {item.product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" disabled={item.product.stock <= 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => removeFromWishlist(item.product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Package, Search, Plus, Edit, Trash2, Star, Calendar, ArrowUpDown, Filter, Eye, Upload } from "lucide-react"
import Image from "next/image"

// Sample product data
const initialProducts = [
  {
    id: "dairy-1",
    name: "Shrikhand",
    price: 249.99,
    unit: "500g",
    image: "/images/products/shrikhand-1.jpeg",
    description: "Premium quality Shrikhand made with strained yogurt, sugar, and cardamom.",
    discount: 0,
    rating: 4.8,
    featured: true,
    seasonal: false,
    stock: 25,
    category: "Dairy",
    status: "active",
  },
  {
    id: "dairy-2",
    name: "Amarkhand",
    price: 279.99,
    unit: "500g",
    image: "/images/products/amarkhand-1.jpeg",
    description: "Delicious Amarkhand made with strained yogurt, sugar, and Alphonso mango pulp.",
    discount: 10,
    rating: 4.7,
    featured: true,
    seasonal: true,
    stock: 0,
    category: "Dairy",
    status: "out-of-stock",
  },
  {
    id: "dairy-4",
    name: "Paneer",
    price: 199.99,
    unit: "250g",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
    description: "Fresh homemade paneer, soft and perfect for all your favorite recipes.",
    discount: 0,
    rating: 4.9,
    featured: false,
    seasonal: false,
    stock: 8,
    category: "Dairy",
    status: "low-stock",
  },
  {
    id: "dairy-6",
    name: "Organic Ghee",
    price: 499.99,
    unit: "200g",
    image: "/images/products/ghee-2.jpeg",
    description: "Premium quality buffalo ghee made from 100% pure buffalo milk fat with no additives.",
    discount: 5,
    rating: 4.9,
    featured: true,
    seasonal: false,
    stock: 15,
    category: "Dairy",
    status: "active",
  },
]

export default function FarmerProductsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState(initialProducts)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    unit: "",
    category: "Dairy",
    description: "",
    discount: 0,
    stock: 0,
    featured: false,
    seasonal: false,
    image: "",
  })
  const { toast } = useToast()

  const filteredProducts = products.filter((product) => {
    // Filter by tab
    if (activeTab === "featured" && !product.featured) return false
    if (activeTab === "seasonal" && !product.seasonal) return false
    if (activeTab === "out-of-stock" && product.stock > 0) return false
    if (activeTab === "low-stock" && (product.stock === 0 || product.stock > 10)) return false

    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

    return true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setNewProduct((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddProduct = () => {
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new product
    const productToAdd = {
      ...newProduct,
      id: `product-${Date.now()}`,
      rating: 5.0,
      status: newProduct.stock === 0 ? "out-of-stock" : newProduct.stock < 10 ? "low-stock" : "active",
      image: newProduct.image || "/placeholder.svg?height=300&width=300",
    }

    // Add to products list
    setProducts((prev) => [...prev, productToAdd])

    // Reset form and close dialog
    setNewProduct({
      name: "",
      price: 0,
      unit: "",
      category: "Dairy",
      description: "",
      discount: 0,
      stock: 0,
      featured: false,
      seasonal: false,
      image: "",
    })
    setIsAddProductOpen(false)

    // Show success toast
    toast({
      title: "Product Added",
      description: `${productToAdd.name} has been added to your inventory.`,
    })
  }

  const openEditProductDialog = (product: any) => {
    setCurrentProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price,
      unit: product.unit,
      category: product.category,
      description: product.description || "",
      discount: product.discount,
      stock: product.stock,
      featured: product.featured,
      seasonal: product.seasonal,
      image: product.image,
    })
    setIsEditProductOpen(true)
  }

  const handleEditProduct = () => {
    if (!currentProduct) return

    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Update product
    const updatedProduct = {
      ...currentProduct,
      ...newProduct,
      status: newProduct.stock === 0 ? "out-of-stock" : newProduct.stock < 10 ? "low-stock" : "active",
    }

    // Update products list
    setProducts((prev) => prev.map((product) => (product.id === currentProduct.id ? updatedProduct : product)))

    // Reset form and close dialog
    setNewProduct({
      name: "",
      price: 0,
      unit: "",
      category: "Dairy",
      description: "",
      discount: 0,
      stock: 0,
      featured: false,
      seasonal: false,
      image: "",
    })
    setCurrentProduct(null)
    setIsEditProductOpen(false)

    // Show success toast
    toast({
      title: "Product Updated",
      description: `${updatedProduct.name} has been updated.`,
    })
  }

  const openDeleteDialog = (product: any) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProduct = () => {
    if (!currentProduct) return

    // Remove product from list
    setProducts((prev) => prev.filter((product) => product.id !== currentProduct.id))

    // Reset and close dialog
    setCurrentProduct(null)
    setIsDeleteDialogOpen(false)

    // Show success toast
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your inventory.",
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this to your server/cloud storage
    // For this demo, we'll create a fake URL
    const imageUrl = URL.createObjectURL(file)

    setNewProduct((prev) => ({
      ...prev,
      image: imageUrl,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your farm's products, inventory, and pricing</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddProductOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Filter Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-1">
                  {["Dairy", "Vegetables", "Fruits", "Grains", "Honey"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        className="rounded text-green-600 focus:ring-green-600"
                        defaultChecked={category === "Dairy"}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" type="number" defaultValue={0} />
                  <Input placeholder="Max" type="number" defaultValue={1000} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-1">
                  {["In Stock", "Low Stock", "Out of Stock"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`status-${status}`}
                        className="rounded text-green-600 focus:ring-green-600"
                        defaultChecked
                      />
                      <label htmlFor={`status-${status}`} className="text-sm">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Product List</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    Sort
                  </Button>
                  <Button variant="outline" size="sm" className="md:hidden flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
                  <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                  <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No products found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden">
                      <div className="relative w-full md:w-32 h-32">
                        <Image
                          src={product.image || "/placeholder.svg?height=128&width=128&query=product"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {product.name}
                              {product.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                              {product.seasonal && <Calendar className="h-4 w-4 text-green-500" />}
                            </h3>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => openEditProductDialog(product)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-500 hover:text-red-600"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            ₹{product.price.toFixed(2)} / {product.unit}
                          </Badge>
                          <Badge variant="outline">{product.category}</Badge>
                          {product.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : product.stock < 10 ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                              Low Stock: {product.stock} left
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                              In Stock: {product.stock}
                            </Badge>
                          )}
                          {product.discount > 0 && (
                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="required">
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="required">
                  Category
                </Label>
                <Select value={newProduct.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy">Dairy Products</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Grains">Grains & Cereals</SelectItem>
                    <SelectItem value="Honey">Honey & Bee Products</SelectItem>
                    <SelectItem value="Herbs">Herbs & Spices</SelectItem>
                    <SelectItem value="Preserves">Jams & Preserves</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="required">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="required">
                  Unit
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={newProduct.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., kg, g, piece"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={newProduct.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="seasonal"
                  checked={newProduct.seasonal}
                  onCheckedChange={(checked) => handleSwitchChange("seasonal", checked)}
                />
                <Label htmlFor="seasonal">Seasonal Product</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={newProduct.image || "/placeholder.svg?height=80&width=80&query=product"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <Upload size={14} />
                    Upload Image
                  </Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="required">
                  Product Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="required">
                  Category
                </Label>
                <Select value={newProduct.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy">Dairy Products</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Grains">Grains & Cereals</SelectItem>
                    <SelectItem value="Honey">Honey & Bee Products</SelectItem>
                    <SelectItem value="Herbs">Herbs & Spices</SelectItem>
                    <SelectItem value="Preserves">Jams & Preserves</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="required">
                  Price (₹)
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit" className="required">
                  Unit
                </Label>
                <Input
                  id="edit-unit"
                  name="unit"
                  value={newProduct.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., kg, g, piece"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Discount (%)</Label>
                <Input
                  id="edit-discount"
                  name="discount"
                  type="number"
                  value={newProduct.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                name="stock"
                type="number"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-seasonal"
                  checked={newProduct.seasonal}
                  onCheckedChange={(checked) => handleSwitchChange("seasonal", checked)}
                />
                <Label htmlFor="edit-seasonal">Seasonal Product</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={newProduct.image || "/placeholder.svg?height=80&width=80&query=product"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <Upload size={14} />
                    Change Image
                  </Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            {currentProduct && (
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                  <img
                    src={currentProduct.image || "/placeholder.svg?height=48&width=48&query=product"}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{currentProduct.name}</div>
                  <div className="text-sm text-gray-500">
                    ₹{currentProduct.price.toFixed(2)} per {currentProduct.unit}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

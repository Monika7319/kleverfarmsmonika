"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useCart } from "@/components/cart-context"
import WishlistButton from "@/components/wishlist-button"

interface CategoryPageProps {
  category: string
  onBack: () => void
}

interface Product {
  id: string
  name: string
  price: number
  unit: string
  image: string
  discount?: number
  rating?: number
  description?: string
}

interface SubCategory {
  id: string
  name: string
  image: string
  description: string
  products: Product[]
}

// Sample product data by category
const categoryProducts = {
  Fruits: [
    {
      id: "fruit-1",
      name: "Organic Apples",
      price: 199.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.7,
      description: "Fresh, crisp organic apples. Perfect for snacking, baking, or adding to salads.",
    },
    {
      id: "fruit-2",
      name: "Fresh Bananas",
      price: 149.99,
      unit: "dozen",
      image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.5,
      description: "Sweet and nutritious bananas, rich in potassium and perfect for smoothies.",
    },
    {
      id: "fruit-3",
      name: "Strawberries",
      price: 399.99,
      unit: "box",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.8,
      description: "Juicy, sweet strawberries. Excellent source of vitamin C and antioxidants.",
    },
    {
      id: "fruit-4",
      name: "Oranges",
      price: 179.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=1000&auto=format&fit=crop",
      discount: 15,
      rating: 4.6,
      description: "Juicy oranges packed with vitamin C. Great for juicing or eating fresh.",
    },
    {
      id: "fruit-5",
      name: "Avocado",
      price: 99.99,
      unit: "each",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.3,
      description: "Creamy, nutritious avocados. Perfect for guacamole, salads, or toast.",
    },
    {
      id: "fruit-6",
      name: "Mangoes",
      price: 299.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.9,
      description: "Sweet, tropical mangoes. Delicious on their own or in smoothies and desserts.",
    },
  ],
  Vegetables: [
    {
      id: "veg-1",
      name: "Fresh Broccoli",
      price: 129.49,
      unit: "bunch",
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=1000&auto=format&fit=crop",
      discount: 15,
      rating: 4.5,
      description: "Nutritious broccoli florets, rich in vitamins and minerals. Great for stir-fries and salads.",
    },
    {
      id: "veg-2",
      name: "Organic Carrots",
      price: 149.99,
      unit: "bag",
      image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.4,
      description: "Sweet, crunchy organic carrots. Perfect for snacking, cooking, or juicing.",
    },
    {
      id: "veg-3",
      name: "Bell Peppers",
      price: 199.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.2,
      description: "Colorful bell peppers, sweet and crunchy. Great for salads, stir-fries, or stuffing.",
    },
    {
      id: "veg-4",
      name: "Tomatoes",
      price: 129.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.6,
      description: "Ripe, juicy tomatoes. Perfect for salads, sauces, or sandwiches.",
    },
    {
      id: "veg-5",
      name: "Spinach",
      price: 89.99,
      unit: "bunch",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.3,
      description: "Fresh, leafy spinach. Packed with iron and other nutrients. Great for salads and cooking.",
    },
    {
      id: "veg-6",
      name: "Potatoes",
      price: 119.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.5,
      description: "Versatile potatoes, perfect for roasting, mashing, or frying.",
    },
  ],
  "Dairy Farms": [
    {
      id: "dairy-1",
      name: "Shrikhand",
      price: 249.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1551893134-55fd5c273f21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.8,
      description: "Traditional sweet yogurt dessert flavored with saffron and cardamom.",
    },
    {
      id: "dairy-2",
      name: "Amrakhand",
      price: 279.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.7,
      description: "Delicious mango-flavored shrikhand, a perfect sweet treat.",
    },
    {
      id: "dairy-3",
      name: "Condensed Milk",
      price: 199.99,
      unit: "400g",
      image: "https://images.unsplash.com/photo-1629213428121-fda95f5c49fd?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.6,
      description: "Sweet, thick condensed milk. Perfect for desserts and coffee.",
    },
    {
      id: "dairy-4",
      name: "Paneer",
      price: 349.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
      discount: 15,
      rating: 4.9,
      description: "Fresh, homemade paneer. Soft and perfect for curries and grilling.",
    },
    {
      id: "dairy-5",
      name: "Lassi",
      price: 149.99,
      unit: "1L",
      image: "https://images.unsplash.com/photo-1626078299034-58de8f3e5e9f?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Refreshing yogurt-based drink. Available in sweet and salted varieties.",
    },
    {
      id: "dairy-6",
      name: "Ghee",
      price: 499.99,
      unit: "500ml",
      image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.8,
      description: "Pure, clarified butter. Traditional cooking ingredient with rich flavor.",
    },
  ],
  "Soy for Joy Farm": [
    {
      id: "soy-1",
      name: "Organic Soybeans",
      price: 299.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.7,
      description: "High-protein organic soybeans. Perfect for homemade tofu and soy milk.",
    },
    {
      id: "soy-2",
      name: "Soyabean Gravy Powder",
      price: 199.99,
      unit: "250g",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.5,
      description: "Ready-to-use soybean gravy powder. Just add water for a delicious gravy.",
    },
    {
      id: "soy-3",
      name: "Soyabean Crush",
      price: 249.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.6,
      description: "Coarsely crushed soybeans. Great for adding texture and protein to dishes.",
    },
    {
      id: "soy-4",
      name: "Soy Milk",
      price: 179.99,
      unit: "1L",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.4,
      description: "Fresh, homemade soy milk. Dairy-free alternative rich in protein.",
    },
  ],
  "Pearl Millets": [
    {
      id: "millet-1",
      name: "Jowar (Sorghum)",
      price: 199.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Nutritious jowar grains. Gluten-free and high in fiber and protein.",
    },
    {
      id: "millet-2",
      name: "Jowar Crush - Ready to Cook",
      price: 249.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.6,
      description: "Pre-crushed jowar for quick cooking. Perfect for porridge and savory dishes.",
    },
    {
      id: "millet-3",
      name: "Jowar Flour",
      price: 179.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Finely ground jowar flour. Great for making rotis, bhakri, and other flatbreads.",
    },
    {
      id: "millet-4",
      name: "Bajra (Pearl Millet)",
      price: 189.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Nutritious pearl millet grains. Rich in iron and protein.",
    },
  ],
  "Klever Eats": [
    {
      id: "klever-1",
      name: "Ragi Idli Mix",
      price: 199.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.7,
      description: "Ready-to-cook ragi idli mix. Just add water and steam for nutritious idlis.",
    },
    {
      id: "klever-2",
      name: "Dosa Mix",
      price: 219.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.8,
      description: "Instant dosa mix. Quick and easy to prepare for a delicious breakfast.",
    },
    {
      id: "klever-3",
      name: "Protein Paratha Mix",
      price: 249.99,
      unit: "400g",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.6,
      description: "High-protein paratha mix. Just add water, roll, and cook for nutritious parathas.",
    },
    {
      id: "klever-4",
      name: "Masoor Pulav",
      price: 279.99,
      unit: "500g",
      image: "https://images.unsplash.com/photo-1596797038530-2c107aa8e1fa?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Ready-to-cook masoor dal pulav. Just add water and cook for a complete meal.",
    },
    {
      id: "klever-5",
      name: "Rasam Khichadi Mix",
      price: 229.99,
      unit: "400g",
      image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
      discount: 15,
      rating: 4.7,
      description: "Comforting rasam khichadi mix. Perfect for a quick, nutritious meal.",
    },
    {
      id: "klever-6",
      name: "Moong Dal Halwa",
      price: 299.99,
      unit: "300g",
      image: "https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.9,
      description: "Ready-to-cook moong dal halwa. Just add ghee and cook for a delicious dessert.",
    },
  ],
  Grains: [
    {
      id: "grain-1",
      name: "Organic Quinoa",
      price: 349.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.8,
      description: "Nutrient-rich organic quinoa. High in protein and all nine essential amino acids.",
    },
    {
      id: "grain-2",
      name: "Brown Rice",
      price: 199.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.6,
      description: "Wholesome brown rice. Rich in fiber and nutrients with a nutty flavor.",
    },
    {
      id: "grain-3",
      name: "Organic Oats",
      price: 249.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Hearty organic oats. Perfect for breakfast porridge or baking.",
    },
    {
      id: "grain-4",
      name: "Barley",
      price: 179.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Versatile barley grains. Great for soups, stews, and salads.",
    },
    {
      id: "grain-5",
      name: "Millet",
      price: 229.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.4,
      description: "Nutritious millet grains. Gluten-free and easy to digest.",
    },
    {
      id: "grain-6",
      name: "Amaranth",
      price: 399.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 15,
      rating: 4.9,
      description: "Protein-rich pseudocereal",
    },
    {
      id: "grain-7",
      name: "Buckwheat",
      price: 279.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.6,
      description: "Gluten-free buckwheat. Great for pancakes, noodles, and porridge.",
    },
    {
      id: "grain-8",
      name: "Rye",
      price: 219.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.5,
      description: "Hearty rye grain. Perfect for bread making and traditional dishes.",
    },
    {
      id: "grain-9",
      name: "Farro",
      price: 329.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.7,
      description: "Ancient grain farro. Nutty flavor and chewy texture, perfect for salads and soups.",
    },
    {
      id: "grain-10",
      name: "Spelt",
      price: 299.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.6,
      description: "Ancient grain spelt. Nutty flavor and high in protein and fiber.",
    },
    {
      id: "grain-11",
      name: "Teff",
      price: 449.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.8,
      description: "Tiny teff grains. Used in Ethiopian cuisine and rich in nutrients.",
    },
    {
      id: "grain-12",
      name: "Freekeh",
      price: 379.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Young green wheat. Smoky flavor and high in protein and fiber.",
    },
    {
      id: "grain-13",
      name: "Kamut",
      price: 419.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.6,
      description: "Ancient khorasan wheat. Buttery flavor and rich in nutrients.",
    },
    {
      id: "grain-14",
      name: "Wild Rice",
      price: 499.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.9,
      description: "Nutritious wild rice. Chewy texture and nutty flavor.",
    },
    {
      id: "grain-15",
      name: "Sorghum",
      price: 259.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Gluten-free sorghum. Versatile grain for various dishes.",
    },
    {
      id: "grain-16",
      name: "Einkorn",
      price: 429.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Ancient einkorn wheat. Rich in protein and minerals.",
    },
    {
      id: "grain-17",
      name: "Bulgur",
      price: 199.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.6,
      description: "Parboiled cracked wheat. Quick-cooking and perfect for tabbouleh.",
    },
    {
      id: "grain-18",
      name: "Couscous",
      price: 229.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 10,
      rating: 4.8,
      description: "Tiny pasta made from semolina. Quick-cooking and versatile.",
    },
    {
      id: "grain-19",
      name: "Triticale",
      price: 289.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 0,
      rating: 4.5,
      description: "Hybrid of wheat and rye. Nutritious and versatile grain.",
    },
    {
      id: "grain-20",
      name: "Emmer",
      price: 399.99,
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      discount: 5,
      rating: 4.7,
      description: "Ancient grain emmer. Rich in fiber and protein.",
    },
  ],
}

// Grain subcategories
const grainSubcategories: SubCategory[] = [
  {
    id: "quinoa",
    name: "Quinoa",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
    description: "High-protein ancient grain",
    products: [categoryProducts.Grains[0], categoryProducts.Grains[9], categoryProducts.Grains[10]],
  },
  {
    id: "rice",
    name: "Rice",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1000&auto=format&fit=crop",
    description: "Brown, white, and wild varieties",
    products: [categoryProducts.Grains[1], categoryProducts.Grains[13], categoryProducts.Grains[16]],
  },
  {
    id: "oats",
    name: "Oats",
    image: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?q=80&w=1000&auto=format&fit=crop",
    description: "Steel-cut, rolled, and instant",
    products: [categoryProducts.Grains[2], categoryProducts.Grains[11], categoryProducts.Grains[12]],
  },
  {
    id: "barley",
    name: "Barley",
    image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    description: "Versatile and nutritious grain",
    products: [categoryProducts.Grains[3], categoryProducts.Grains[8], categoryProducts.Grains[15]],
  },
  {
    id: "millet",
    name: "Millet",
    image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    description: "Gluten-free ancient grain",
    products: [categoryProducts.Grains[4], categoryProducts.Grains[14], categoryProducts.Grains[19]],
  },
  {
    id: "amaranth",
    name: "Amaranth",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    description: "Protein-rich pseudocereal",
    products: [categoryProducts.Grains[5], categoryProducts.Grains[6], categoryProducts.Grains[7]],
  },
]

export default function CategoryPage({ category, onBack }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null)
  const { addToCart } = useCart()

  // Handle product selection
  const handleProductSelect = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Find the product by ID
    const products = categoryProducts[category as keyof typeof categoryProducts] || []
    const product = products.find((p) => p.id === productId)
    if (product) {
      setSelectedProduct(product)
    }
  }

  // Special handling for Grains category to show subcategories
  if (category === "Grains" && !selectedSubcategory && !selectedProduct) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{category}</h1>
            <span className="text-sm text-gray-500 ml-2">(6 subcategories)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {grainSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <img
                src={subcategory.image || "/placeholder.svg"}
                alt={subcategory.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-medium text-lg mb-1">{subcategory.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{subcategory.description}</p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                Explore
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">All Grain Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryProducts.Grains.map((product) => (
              <div key={product.id} className="cursor-pointer">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  image={product.image}
                  discount={product.discount}
                  rating={product.rating}
                  onClick={() => handleProductSelect(product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show subcategory products
  if (selectedSubcategory) {
    return (
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelectedSubcategory(null)} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{selectedSubcategory.name}</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedSubcategory.products.map((product) => (
            <div key={product.id} className="cursor-pointer">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                unit={product.unit}
                image={product.image}
                discount={product.discount}
                rating={product.rating}
                onClick={() => handleProductSelect(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show product detail
  if (selectedProduct) {
    const discountedPrice = selectedProduct.discount
      ? selectedProduct.price - (selectedProduct.price * selectedProduct.discount) / 100
      : selectedProduct.price

    return (
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Product Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                <WishlistButton
                  product={{
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: discountedPrice,
                    image: selectedProduct.image,
                    unit: selectedProduct.unit,
                  }}
                  variant="icon"
                />
              </div>

              <div className="flex items-center mb-4">
                {selectedProduct.rating && (
                  <div className="flex items-center mr-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "text-yellow-400" : "text-gray-300"} fill-current`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-gray-500">per {selectedProduct.unit}</span>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-green-600">₹{discountedPrice.toFixed(2)}</span>
                {selectedProduct.discount && (
                  <>
                    <span className="ml-2 text-gray-500 line-through">₹{selectedProduct.price.toFixed(2)}</span>
                    <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedProduct.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: discountedPrice,
                    image: selectedProduct.image,
                    unit: selectedProduct.unit,
                  })
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular category display
  const products = categoryProducts[category as keyof typeof categoryProducts] || []

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0)
    // Default: sort by popularity (rating)
    return (b.rating || 0) - (a.rating || 0)
  })

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{category}</h1>
          <span className="text-sm text-gray-500 ml-2">({products.length} items)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm bg-white"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Discount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedProducts.map((product) => (
          <div key={product.id} className="cursor-pointer">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              unit={product.unit}
              image={product.image}
              discount={product.discount}
              rating={product.rating}
              onClick={() => handleProductSelect(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

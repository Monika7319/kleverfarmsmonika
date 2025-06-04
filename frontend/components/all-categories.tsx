"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import CategoryCard from "@/components/category-card"

interface AllCategoriesProps {
  onSelectCategory: (category: string) => void
  onBack: () => void
}

const categories = [
  {
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1000&auto=format&fit=crop",
    count: 42,
  },
  {
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop",
    count: 56,
  },
  {
    name: "Dairy Farms",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    count: 24,
  },
  {
    name: "Grains",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    count: 20,
  },
  {
    name: "Pearl Millets",
    image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    count: 15,
  },
  {
    name: "Klever Eats",
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1000&auto=format&fit=crop",
    count: 18,
  },
  {
    name: "Soy for Joy Farm",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    count: 12,
  },
]

export default function AllCategories({ onSelectCategory, onBack }: AllCategoriesProps) {
  return (
    <div className="py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">All Categories</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div key={category.name} onClick={() => onSelectCategory(category.name)} className="cursor-pointer">
            <CategoryCard name={category.name} image={category.image} count={category.count} />
          </div>
        ))}
      </div>
    </div>
  )
}

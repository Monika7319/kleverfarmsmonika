"use client"

interface CategoryCardProps {
  name: string
  image: string
  count: number
}

export default function CategoryCard({ name, image, count }: CategoryCardProps) {
  return (
    <button className="block w-full">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-4 text-center transition-all duration-200 hover:shadow-md hover:border-green-200">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto overflow-hidden mb-3">
          <img src={image || "/placeholder.svg"} alt={name} className="h-16 w-16 object-cover" />
        </div>
        <h3 className="font-medium text-gray-900 hover:text-green-600">{name}</h3>
        <p className="text-sm text-gray-500">{count} items</p>
      </div>
    </button>
  )
}

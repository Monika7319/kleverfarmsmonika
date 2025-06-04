"use client"

interface FarmCardProps {
  id: string
  name: string
  image: string
  location: string
  distance: string
  rating: number
  specialties: string[]
  onClick?: () => void
}

export default function FarmCard({ id, name, image, location, distance, rating, specialties, onClick }: FarmCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          {distance} away
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-lg mb-1">{name}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">{location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {specialties.map((specialty, index) => (
            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

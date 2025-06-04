interface PromoBannerProps {
  title: string
  description: string
  buttonText: string
  image: string
}

export default function PromoBanner({ title, description, buttonText, image }: PromoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg overflow-hidden shadow-md">
      <div className="flex flex-col md:flex-row items-center">
        <div className="p-6 md:p-8 md:w-2/3 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
          <p className="text-green-100 mb-4">{description}</p>
          <button className="bg-white text-green-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium">
            {buttonText}
          </button>
        </div>
        <div className="md:w-1/3">
          <img src={image || "/placeholder.svg"} alt="Promotion" className="w-full h-40 md:h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

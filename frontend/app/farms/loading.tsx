export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

      <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="flex gap-2 mt-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

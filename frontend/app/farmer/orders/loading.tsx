export default function OrdersLoading() {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="border rounded-lg p-6 space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

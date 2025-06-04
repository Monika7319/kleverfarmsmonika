export default function ProfileLoading() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Farm Profile Card Skeleton */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 flex justify-between items-center border-b">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Farm Settings Card Skeleton */}
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

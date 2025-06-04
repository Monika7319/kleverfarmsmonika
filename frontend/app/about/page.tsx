import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">KleverFarms</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Kleverfarms is not just about eCommerce and eLogistics. It is a mission to promote a klever way of
                building an eco-system of farmers, farm produce processors and end consumers. Our aim is to build a
                sustainable, scalable and systemic food chain supply system.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We, at Kleverfarms, believe that there is enormous amount of excellence (in Agri Sphere) available in
                rural India in producing quality farm output with eco-friendly farming practices. But it does not get
                noticed and there is no platform to make it visible across the people. Many small farmers produce
                excellent output but it gets absorbed/consumed in a local sauda market at unreasonably low prices with
                middlemen getting major portion with little efforts. Farmers who have sweated out whole time gets a real
                raw deal. Moreover, end consumer ends up buying a guava or drumsticks or jowar/urad dal at high prices
                at local market when it is grown in their near vicinity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Kleverfarms is trying to break the traditional barriers and exploring new possibilities. End users will
                know their grower/farmer, will develop long lasting relationship. This would truly be a win-win
                scenario. It gives opportunity to farmers and consumers to connect with each other. No commissions for
                such connections as we will not know about them. Alternatively farmers/agri-preneurs can partner with us
                for online sales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">Our Mission</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      To promote natural, organic and tech-assisted/mechanistic farming practices which are Systemic,
                      Sustainable and Scalable for greater environmental impact overall and financial benefits at
                      individual farmer level.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      To encourage and empower small farmers to showcase their farm produce/products and to allow them
                      to make direct linkages with local and nearby customers and end users thereby obviating the
                      necessity of having middlemen using predictive forecasting models of demand/supply and optimised
                      use of existing logistics/delivery network.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To become a nation-wide online food/farm ecosystem of farmers, farm-produce processors and end
                  consumers which will be organically growing, self-sustaining and traceable in nature, and will ensure
                  optimised profits for all stake holders, help strengthening rural economies and eliminate the
                  dominance of middlemen.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Transparency</h3>
                  <p className="text-gray-700">
                    We believe in complete transparency in our operations, pricing, and sourcing, allowing customers to
                    know exactly where their food comes from.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Sustainability</h3>
                  <p className="text-gray-700">
                    We promote sustainable farming practices that protect the environment and ensure long-term viability
                    for farmers and communities.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Empowerment</h3>
                  <p className="text-gray-700">
                    We empower farmers with fair prices, technology, and direct market access, helping them build
                    sustainable businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Join Our Movement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">For Consumers</h3>
                <p className="text-gray-700 mb-4">
                  Join KleverFarms to access fresh, farm-direct produce while supporting local farmers and sustainable
                  agriculture.
                </p>
                <Link href="/">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up as Consumer</Button>
                </Link>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">For Farmers</h3>
                <p className="text-gray-700 mb-4">
                  List your farm on KleverFarms to reach customers directly, get better prices, and grow your business.
                </p>
                <Link href="/">
                  <Button className="w-full bg-green-600 hover:bg-green-700">List Your Farm Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} KleverFarms. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              Home
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white mx-2">
              About Us
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              Contact
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              Privacy Policy
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Users, ShoppingCart, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800">KleverFarms</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-green-600">
              Products
            </Link>
            <Link href="/farmers" className="text-gray-600 hover:text-green-600">
              Farmers
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/farmer-dashboard">
              <Button variant="outline">Farmer Login</Button>
            </Link>
            <Button>Shop Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fresh from Farm to
            <span className="text-green-600"> Your Table</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect directly with local farmers and enjoy the freshest produce, dairy, and artisanal products delivered
            straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Start Shopping
            </Button>
            <Link href="/farmer-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Users className="mr-2 h-5 w-5" />
                Join as Farmer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose KleverFarms?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Fresh & Organic</CardTitle>
                <CardDescription>
                  Directly sourced from local farms, ensuring maximum freshness and quality
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Support Local Farmers</CardTitle>
                <CardDescription>
                  Your purchases directly support local farming communities and sustainable agriculture
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Quality Guaranteed</CardTitle>
                <CardDescription>
                  Every product is carefully selected and quality-checked before reaching you
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of customers who trust KleverFarms for their fresh produce needs
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Browse Products
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">KleverFarms</span>
              </div>
              <p className="text-gray-400">Connecting farmers and consumers for a sustainable future.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products">Products</Link>
                </li>
                <li>
                  <Link href="/farmers">Farmers</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Farmers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/farmer-dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/farmer-signup">Join Us</Link>
                </li>
                <li>
                  <Link href="/farmer-support">Support</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: hello@kleverfarms.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Farm Street, Green Valley</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KleverFarms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

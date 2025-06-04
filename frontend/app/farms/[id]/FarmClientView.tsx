"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-context"
import { useWishlist } from "@/components/wishlist-context"
import ProductDetailModal from "@/components/product-detail-modal"
import CartDrawer from "@/components/cart-drawer"
import WishlistDrawer from "@/components/wishlist-drawer"
import { useToast } from "@/hooks/use-toast"

const farmsData = {
  "farm-1": {
    id: "farm-1",
    name: "Dr. Joy's Dairy Farm",
    description:
      "Dr. Joy's Dairy Farm is a family-owned farm specializing in organic, hormone-free dairy products. Our cows are grass-fed and treated with the utmost care to produce the highest quality milk, which we transform into delicious traditional dairy products. Joshi Dairy is committed to providing the highest quality milk products using traditional methods passed down through generations. We maintain strict quality control and follow all food safety standards to ensure our products are both delicious and safe for consumption.",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594761051656-153faa44a3f0?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529476908217-b62bed0a6d36?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Nej, Chikodi, Belagavi, Karnataka - 591239",
    distance: "5.7 km",
    rating: 4.9,
    reviews: 128,
    specialties: ["Dairy", "Organic", "Hormone-free"],
    contact: {
      name: "Dr. Madhura Milind Joshi",
      phone: "+91 8105980099",
      email: "madhura.joshi8888@gmail.com",
      website: "www.joshidairy.com",
      address: "Joshi Dairy, A/P: Nej, Tal: Chikodi, Dist: Belagavi, Pin: 591239",
      license: "JOSHI PRODUCTS, Nej - Licence for: Milk and Milk products",
      fssai: "FSSAI 21224018000899",
    },
    hours: {
      weekdays: "8:00 AM - 6:00 PM",
      weekends: "9:00 AM - 5:00 PM",
    },
    products: [
      {
        id: "dairy-1",
        name: "Shrikhand",
        price: 249.99,
        unit: "500g",
        image: "https://kleverfarms.com/demo1/images/products/shrikhand-1.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/shrikhand-1.jpeg", "https://kleverfarms.com/demo1/images/products/shrikhand-2.jpeg"],
        description:
          "Premium quality Shrikhand made with strained yogurt, sugar, and cardamom, garnished with saffron and pistachios. A traditional Indian sweet dish that's creamy, delicious and nutritious.",
        discount: 0,
        rating: 4.8,
        featured: true,
        seasonal: false,
      },
      {
        id: "dairy-2",
        name: "Amarkhand",
        price: 279.99,
        unit: "500g",
        image: "https://kleverfarms.com/demo1/images/products/amarkhand-1.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/amarkhand-1.jpeg", "https://kleverfarms.com/demo1/images/products/amarkhand-2.jpeg"],
        description:
          "Delicious Amarkhand made with strained yogurt, sugar, and Alphonso mango pulp. A traditional Indian sweet dish by Joshi Dairy that combines the richness of yogurt with the sweetness of mangoes.",
        discount: 10,
        rating: 4.7,
        featured: true,
        seasonal: true,
      },
      {
        id: "dairy-4",
        name: "Paneer",
        price: 199.99,
        unit: "250g",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.9,
        featured: false,
        seasonal: false,
      },
      {
        id: "dairy-5",
        name: "Lassi",
        price: 99.99,
        unit: "200ml",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.6,
        featured: false,
        seasonal: true,
      },
      {
        id: "dairy-6",
        name: "Organic Ghee",
        price: 499.99,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/ghee-2.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/ghee-2.jpeg", "https://kleverfarms.com/demo1/images/products/ghee-1.jpeg"],
        description:
          "Premium quality buffalo ghee from Joshi Dairy. Made from 100% pure buffalo milk fat with no additives. Perfect for cooking, religious ceremonies, and Ayurvedic remedies.",
        discount: 5,
        rating: 4.9,
        featured: true,
        seasonal: false,
      },
    ],
  },
  "farm-2": {
    id: "farm-2",
    name: "KleverEats",
    description:
      "KleverEats specializes in ready-to-cook traditional food mixes that make cooking authentic dishes quick and easy. Our products are made with high-quality ingredients and traditional recipes passed down through generations.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Greenville, CA",
    distance: "3.2 km",
    rating: 4.8,
    reviews: 96,
    specialties: ["Ready-to-cook", "Traditional", "Signature recipes"],
    contact: {
      phone: "+1 (555) 987-6543",
      email: "hello@klevereats.com",
      website: "www.klevereats.com",
    },
    hours: {
      weekdays: "9:00 AM - 7:00 PM",
      weekends: "10:00 AM - 6:00 PM",
    },
    products: [
      {
        id: "ke-1",
        name: "Ragi Idli Mix",
        price: 199.99,
        unit: "500g",
        image: "https://kleverfarms.com/demo1/images/products/ragi-idli-mix.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/ragi-idli-mix.jpeg"],
        description:
          "Premium quality Ragi Idli Mix from KleverFarms. Ready in 2 steps, easy to cook, fresh, healthy & tasty with no preservatives or added colors. Made with urad dal, soaked rice, ragi, and citric acid.",
        discount: 0,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-7",
        name: "Mix Dal Dhokla",
        price: 100.0,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/mix-dal-dhokla.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/mix-dal-dhokla.jpeg", "https://kleverfarms.com/demo1/images/products/mix-dal-dhokla-2.jpeg"],
        description:
          "Traditional Mix Dal Dhokla from KleverFarms. Ready in 2 steps with urid dal, rice, moong dal, besan, semolina, and authentic spices. No preservatives or added colors. Serves 2-3 people.",
        discount: 0,
        rating: 4.6,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-8",
        name: "Panchkhadya Kheer",
        price: 140.0,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/panchkhadya-kheer.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/panchkhadya-kheer.jpeg", "https://kleverfarms.com/demo1/images/products/panchkhadya-kheer-2.jpeg"],
        description:
          "Delicious Panchkhadya Kheer from KleverFarms. Made with dry dates powder, jaggery, dry coconut, almond powder, khaskhas, milk powder, and cardamom. Ready in just 5 minutes by adding hot milk. Serves 3-4 people.",
        discount: 5,
        rating: 4.8,
        featured: true,
        seasonal: true,
      },
      {
        id: "ke-3",
        name: "Methi Paratha Mix",
        price: 249.99,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/paratha.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/paratha.jpeg"],
        description:
          "Traditional Methi Paratha Mix from KleverFarms. Ready in 2 steps with whole wheat flour, gram flour, rice flour, dried fenugreek leaves, and authentic spices. No preservatives or added colors. Makes 7-8 parathas.",
        discount: 0,
        rating: 4.9,
        featured: true,
        seasonal: false,
      },
      {
        id: "ke-4",
        name: "Pulav Mix",
        price: 179.99,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/pulav.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/pulav.jpeg"],
        description:
          "Delicious Pulav Mix from KleverFarms. Ready in 2 steps with rice, sprouted dried masoor, mustard, cumin, and authentic spices. No preservatives or added colors. Serves 3-4 people.",
        discount: 5,
        rating: 4.6,
        featured: false,
        seasonal: true,
      },
      {
        id: "ke-5",
        name: "Rasam Khichadi Mix",
        price: 229.99,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/rasam.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/rasam.jpeg", "https://kleverfarms.com/demo1/images/products/rasam-khichdi-mix-2.jpeg"],
        description:
          "Nutritious Rasam Khichadi Mix from KleverFarms. Ready in 2 steps with rice, moong dal, masoor dal, toor dal, and authentic spices. No preservatives or added colors. Serves 3-4 people.",
        discount: 15,
        rating: 4.7,
        featured: false,
        seasonal: true,
      },
      {
        id: "ke-6",
        name: "Moong Dal Halwa",
        price: 120.0,
        unit: "200g",
        image: "https://kleverfarms.com/demo1/images/products/moong-dal-halwa.jpeg",
        images: ["https://kleverfarms.com/demo1/images/products/moong-dal-halwa.jpeg", "https://kleverfarms.com/demo1/images/products/moong-dal-halwa-2.jpeg"],
        description:
          "Delicious Moong Dal Halwa from KleverFarms. Made with moong dal, gram dal, semolina, pure ghee, sugar, and cardamom powder. Ready in 2-3 minutes and serves 2-3 people. Perfect served hot with dry fruits.",
        discount: 0,
        rating: 4.9,
        featured: true,
        seasonal: false,
      },
    ],
  },
  "farm-3": {
    id: "farm-3",
    name: "Soy for Joy Farm",
    description:
      "Soy for Joy Farm is dedicated to producing high-quality, organic soy products. We grow our soybeans using sustainable farming practices and transform them into nutritious, protein-rich foods that are good for you and the planet.",
    image: "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1612257999756-61d09b875a84?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622623271333-5f3d0f8d7a42?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612258013652-d57d2a85c9a4?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Riverside, CA",
    distance: "7.1 km",
    rating: 4.7,
    reviews: 84,
    specialties: ["Organic", "Soy products", "Sustainable"],
    contact: {
      phone: "+1 (555) 456-7890",
      email: "contact@soyforjoy.com",
      website: "www.soyforjoy.com",
    },
    hours: {
      weekdays: "8:30 AM - 6:30 PM",
      weekends: "9:30 AM - 4:30 PM",
    },
    products: [
      {
        id: "soy-1",
        name: "Organic Soybeans",
        price: 149.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1612258013652-d57d2a85c9a4?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.6,
        featured: true,
        seasonal: false,
      },
      {
        id: "soy-2",
        name: "Soyabean Gravy Powder",
        price: 199.99,
        unit: "250g",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        discount: 10,
        rating: 4.5,
        featured: true,
        seasonal: false,
      },
      {
        id: "soy-3",
        name: "Soyabean Crush",
        price: 179.99,
        unit: "400g",
        image: "https://images.unsplash.com/photo-1622623271333-5f3d0f8d7a42?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
    ],
  },
  "farm-4": {
    id: "farm-4",
    name: "Pearl Millets",
    description:
      "Pearl Millets is dedicated to growing and processing nutritious, gluten-free millets. Our farm uses organic farming methods to produce high-quality millets that are packed with nutrients and perfect for a healthy lifestyle.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586201375761-83865001e8c7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
    ],
    location: "Wheatfield, CA",
    distance: "8.6 km",
    rating: 4.8,
    reviews: 112,
    specialties: ["Millets", "Organic", "Gluten-free"],
    contact: {
      phone: "+1 (555) 789-0123",
      email: "info@pearlmillets.com",
      website: "www.pearlmillets.com",
    },
    hours: {
      weekdays: "8:00 AM - 5:00 PM",
      weekends: "9:00 AM - 3:00 PM",
    },
    products: [
      {
        id: "millet-1",
        name: "Organic Jowar",
        price: 199.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1622542086073-346a41ce35fe?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.5,
        featured: true,
        seasonal: false,
      },
      {
        id: "millet-2",
        name: "Jowar Crush - Ready to Cook",
        price: 249.99,
        unit: "500g",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?q=80&w=1000&auto=format&fit=crop",
        discount: 5,
        rating: 4.7,
        featured: true,
        seasonal: false,
      },
      {
        id: "millet-3",
        name: "Jowar Flour",
        price: 179.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e8c7?q=80&w=1000&auto=format&fit=crop",
        discount: 0,
        rating: 4.8,
        featured: true,
        seasonal: false,
      },
    ],
  },
}

export default function FarmClientView({ farmId }: { farmId: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const { addToCart } = useCart()
  const cart = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null)

  const farm = farmsData[farmId as keyof typeof farmsData]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!farm) return
    autoSlideInterval.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % farm.gallery.length)
    }, 5000)
    return () => clearInterval(autoSlideInterval.current!)
  }, [farm])

  const filteredProducts = () => {
    if (!farm) return []
    if (activeTab === "featured") return farm.products.filter((p) => p.featured)
    if (activeTab === "seasonal") return farm.products.filter((p) => p.seasonal)
    return farm.products
  }

  const handleAddToCart = (product: any) => {
    const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
    addToCart({ id: product.id, name: product.name, price: discountedPrice, image: product.image, unit: product.unit })
    toast({ title: "Added to cart!", description: `${product.name} has been added to your cart.`, variant: "success" })
  }

  const toggleWishlist = (product: any) => {
    const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
    const item = { id: product.id, name: product.name, price: discountedPrice, image: product.image, unit: product.unit }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({ title: "Removed from wishlist", description: `${product.name} has been removed.`, variant: "default" })
    } else {
      addToWishlist(item)
      toast({ title: "Added to wishlist!", description: `${product.name} has been added.`, variant: "success" })
    }
  }

  const openProductDetail = (product: any) => setSelectedProduct(product)

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>

  if (!farm) return <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">Farm not found.</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="text-green-600 hover:underline flex items-center">
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </a>
          <div className="flex items-center gap-4">
            <Heart onClick={() => setIsWishlistOpen(true)} className="cursor-pointer" />
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart />
              {cart?.totalItems > 0 && <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">{cart.totalItems}</span>}
            </div>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden shadow-md">
          <img src={farm.gallery[currentImageIndex]} className="w-full h-64 object-cover" alt={farm.name} />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{farm.name}</h1>
            <p className="text-gray-600 mb-3">📍 {farm.location} • {farm.distance} • ⭐ {farm.rating}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {farm.specialties.map((tag: string, i: number) => (
                <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            <p className="text-gray-700 text-base mb-6">{farm.description}</p>

            <div className="flex border-b border-gray-300 mb-4">
              {["all", "featured", "seasonal"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`mr-4 pb-2 ${activeTab === tab ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts().map((product) => {
                const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
                return (
                  <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    <div className="text-sm text-gray-600 mb-1">{product.unit} • ⭐ {product.rating}</div>
                    <div className="flex gap-2 items-center mb-2">
                      {product.discount > 0 && <span className="text-red-600 font-bold">₹{discountedPrice.toFixed(2)}</span>}
                      {product.discount > 0 && <span className="text-gray-500 line-through">₹{product.price.toFixed(2)}</span>}
                      {product.discount === 0 && <span className="text-black font-bold">₹{product.price.toFixed(2)}</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleAddToCart(product)} className="flex-1">Add to Cart</Button>
                      <Button variant="outline" onClick={() => toggleWishlist(product)}><Heart className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={{ ...selectedProduct, images: selectedProduct.images || [selectedProduct.image] }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} onCheckout={() => (window.location.href = "/checkout")} />}
      {isWishlistOpen && <WishlistDrawer onClose={() => setIsWishlistOpen(false)} />}
    </div>
  )
}

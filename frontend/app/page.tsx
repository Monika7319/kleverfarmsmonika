"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, ChevronRight, Heart, MapPin, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import PromoBanner from "@/components/promo-banner"
import LoginModal from "@/components/login-modal"
import WishlistDrawer from "@/components/wishlist-drawer"
import CartDrawer from "@/components/cart-drawer"
import CategoryPage from "@/components/category-page"
import AllCategories from "@/components/all-categories"
import SearchResults from "@/components/search-results"
import CheckoutPage from "@/components/checkout/checkout-page"
import { useCart } from "@/components/cart-context"
import SignupModal from "@/components/signup-modal"
import LocationSelector from "@/components/location-selector"
import FarmRegistration from "@/components/farm-registration"
import ProductDetailModal from "@/components/product-detail-modal"
import FarmCard from "@/components/farm-card"
import WhyJoinCarousel from "@/components/why-join-carousel"
import { useRouter } from "next/navigation"
import HeroCarousel from "@/components/hero-carousel"


import { ChevronLeft } from "lucide-react"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const frontendBaseUrl = typeof window !== "undefined"
  ? window.location.origin
  : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";




  type Farm = {
    id: number
    farmName: string
    city: string
    state: string
    description: string
    images: string[] // assuming images is an array of image URLs
    specialties: string[]
    slug: string
    
    
  }
  
  

  
  

// Update the sampleProducts object to match the products we want to display
const sampleProducts = {
  "dairy-1": {
    id: "dairy-1",
    name: "Shrikhand",
    price: 249.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/shrikhand-1.jpeg",
    discount: 0,
    rating: 4.8,
    category: "Dairy",
    description:
      "Traditional sweet yogurt dessert flavored with saffron and cardamom from Dr. Jo's Dairy Farm. Made with fresh milk and natural ingredients.",
    images: ["https://kleverfarms.com/images/products/shrikhand-1.jpeg", "https://kleverfarms.com/imageproducts/shrikhand-2.jpeg"],
  },
  "dairy-2": {
    id: "dairy-2",
    name: "Amrakhand",
    price: 279.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/amarkhand-1.jpeg",
    discount: 10,
    rating: 4.7,
    category: "Dairy",
    description:
      "Delicious mango-flavored shrikhand from Joshi Dairy. Made with fresh yogurt and Alphonso mango pulp for a perfect sweet treat.",
    images: ["https://kleverfarms.com/images/products/amarkhand-1.jpeg", "https://kleverfarms.com/images/products/amarkhand-2.jpeg"],
  },
  "dairy-4": {
    id: "dairy-4",
    name: "Paneer",
    price: 349.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/paneer.jpeg",
    discount: 15,
    rating: 4.9,
    category: "Dairy",
    description: "Fresh, homemade paneer. Soft and perfect for curries and grilling.",
    images: ["https://kleverfarms.com/images/products/paneer.jpeg"],
  },
  "soy-1": {
    id: "soy-1",
    name: "Organic Soybeans",
    price: 149.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/soyabean.jpeg",
    discount: 0,
    rating: 4.7,
    category: "Grains",
    description:
      "Premium quality organic soybeans from Soy for Joy Farm. High in protein and essential nutrients. Perfect for making homemade tofu, soy milk, or adding to your favorite recipes.",
    images: ["https://kleverfarms.com/images/products/soyabean.jpeg"],
  },
  "soy-2": {
    id: "soy-2",
    name: "Protein Masala Powder",
    price: 199.99,
    unit: "250g",
    image: "https://kleverfarms.com/images/products/protein-masala-powder.jpeg",
    discount: 10,
    rating: 4.5,
    category: "Grains",
    description:
      "Specially formulated protein masala powder from Soy for Joy Farm. A perfect blend of spices and soy protein for a nutritious and flavorful addition to your meals. Great for curries, soups, and marinades.",
    images: ["https://kleverfarms.com/images/products/protein-masala-powder.jpeg"],
  },
  "soy-3": {
    id: "soy-3",
    name: "Jowar Crush",
    price: 129.99,
    unit: "400g",
    image: "https://kleverfarms.com/images/products/jowar-crush.jpeg",
    discount: 5,
    rating: 4.6,
    category: "Grains",
    description:
      "Nutritious jowar (sorghum) crush from Soy for Joy Farm. Gluten-free and rich in fiber and antioxidants. Perfect for making porridge, adding to smoothies, or using as a flour alternative in baking.",
    images: ["https://kleverfarms.com/images/products/jowar-crush.jpeg"],
  },
  "soy-4": {
    id: "soy-4",
    name: "Pearl Millet",
    price: 139.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/pearl-millet.jpeg",
    discount: 0,
    rating: 4.8,
    category: "Grains",
    description:
      "Organic pearl millet from Soy for Joy Farm. A nutrient-dense ancient grain that's high in protein, fiber, and essential minerals. Ideal for making rotis, porridge, or as a rice substitute.",
    images: ["https://kleverfarms.com/images/products/pearl-millet.jpeg"],
  },
  "ke-1": {
    id: "ke-1",
    name: "Ragi Idli Mix",
    price: 199.99,
    unit: "500g",
    image: "https://kleverfarms.com/images/products/ragi-idli-mix.jpeg",
    discount: 0,
    rating: 4.7,
    category: "Ready-to-Cook",
    description:
      "Premium quality Ragi Idli Mix from KleverFarms. Ready in 2 steps, easy to cook, fresh, healthy & tasty with no preservatives or added colors. Made with urad dal, soaked rice, ragi, and citric acid.",
    images: ["https://kleverfarms.com/images/products/ragi-idli-mix.jpeg"],
  },
  "ke-7": {
    id: "ke-7",
    name: "Mix Dal Dhokla",
    price: 100.0,
    unit: "200g",
    image: "https://kleverfarms.com/images/products/mix-dal-dhokla.jpeg",
    discount: 0,
    rating: 4.6,
    category: "Ready-to-Cook",
    description:
      "Traditional Mix Dal Dhokla from KleverFarms. Ready in 2 steps with urid dal, rice, moong dal, besan, semolina, and authentic spices. No preservatives or added colors. Serves 2-3 people.",
    images: ["https://kleverfarms.com/images/products/mix-dal-dhokla.jpeg", "https://kleverfarms.com/images/products/mix-dal-dhokla-2.jpeg"],
  },
  "ke-8": {
    id: "ke-8",
    name: "Panchkhadya Kheer",
    price: 140.0,
    unit: "200g",
    image: "https://kleverfarms.com/images/products/panchkhadya-kheer.jpeg",
    discount: 5,
    rating: 4.8,
    category: "Ready-to-Cook",
    description:
      "Delicious Panchkhadya Kheer from KleverFarms. Made with dry dates powder, jaggery, dry coconut, almond powder, khaskhas, milk powder, and cardamom. Ready in just 5 minutes by adding hot milk. Serves 3-4 people.",
    images: ["https://kleverfarms.com/images/products/panchkhadya-kheer.jpeg", "https://kleverfarms.com/images/products/panchkhadya-kheer-2.jpeg"],
  },
  "ke-3": {
    id: "ke-3",
    name: "Methi Paratha Mix",
    price: 249.99,
    unit: "200g",
    image: "https://kleverfarms.com/images/products/paratha.jpeg",
    discount: 0,
    rating: 4.9,
    category: "Ready-to-Cook",
    description:
      "Traditional Methi Paratha Mix from KleverFarms. Ready in 2 steps with whole wheat flour, gram flour, rice flour, dried fenugreek leaves, and authentic spices. No preservatives or added colors. Makes 7-8 parathas.",
    images: ["https://kleverfarms.com/images/products/paratha.jpeg"],
  },
  "ke-5": {
    id: "ke-5",
    name: "Rasam Khichadi Mix",
    price: 229.99,
    unit: "200g",
    image: "https://kleverfarms.com/images/products/rasam.jpeg",
    discount: 15,
    rating: 4.7,
    category: "Ready-to-Cook",
    description:
      "Nutritious Rasam Khichadi Mix from KleverFarms. Ready in 2 steps with rice, moong dal, masoor dal, toor dal, and authentic spices. No preservatives or added colors. Serves 3-4 people.",
    images: ["https://kleverfarms.com/images/products/rasam.jpeg", "https://kleverfarms.com/images/products/rasam-khichdi-mix-2.jpeg"],
  },
  "ke-6": {
    id: "ke-6",
    name: "Moong Dal Halwa",
    price: 120.0,
    unit: "200g",
    image: "https://kleverfarms.com/images/products/moong-dal-halwa.jpeg",
    discount: 0,
    rating: 4.9,
    category: "Ready-to-Cook",
    description:
      "Delicious Moong Dal Halwa from KleverFarms. Made with moong dal, gram dal, semolina, pure ghee, sugar, and cardamom powder. Ready in 2-3 minutes and serves 2-3 people. Perfect served hot with dry fruits.",
    images: ["https://kleverfarms.com/images/products/moong-dal-halwa.jpeg", "https://kleverfarms.com/images/products/moong-dal-halwa-2.jpeg"],
  },
}


export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showLocationSelector, setShowLocationSelector] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Select Location")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const cart = useCart()
  const totalItems = cart?.totalItems || 0
  const [showFarmRegistration, setShowFarmRegistration] = useState(false)
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [isClient, setIsClient] = useState(false);

  const [farms, setFarms] = useState<Farm[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null) // Error state


    type Farm = {
      id: number
      farmName: string
      city: string
      state: string
      description: string
      images: string[] // assuming images is an array of image URLs
      specialties: string[]
      slug: string
      
      
    }
  
    useEffect(() => {
      const fetchFarms = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/frontend/farms")
          if (!res.ok) {
            throw new Error("Network response was not ok")
          }
          const data = await res.json()
          setFarms(data.farms || [])
        } catch (error: any) {
          setError("Failed to fetch farms") // Show error message
          console.error("Failed to fetch farms", error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchFarms()
    }, []) 








  useEffect(() => {
    setIsClient(true);
  }, []);
  

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle product selection - moved up to fix "Cannot access before initialization" error
  const handleProductCardSelect = useRef((productId: string) => {
    setSelectedProduct(productId)
    // Ensure no unexpected modals open
    if (showLoginModal) setShowLoginModal(false)
  }).current

  // IMPORTANT: This useEffect runs immediately on page load to ensure buttons work right away
  useEffect(() => {
    // Function to directly attach click handlers to header buttons
    const attachHeaderButtonHandlers = () => {
      // Direct button handlers for header buttons
      const wishlistButton = document.querySelector("#wishlist-button")
      if (wishlistButton) {
        wishlistButton.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowWishlistDrawer(true)
        })
      }

      const cartButton = document.querySelector("#cart-button")
      if (cartButton) {
        cartButton.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowCartDrawer(true)
        })
      }

      const loginButton = document.querySelector("#login-button")
      if (loginButton) {
        loginButton.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowLoginModal(true)
        })
      }

      const farmButton = document.querySelector("#farm-button")
      if (farmButton) {
        farmButton.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowFarmRegistration(true)
        })
      }

      // Mobile buttons
      const loginButtonMobile = document.querySelector("#login-button-mobile")
      if (loginButtonMobile) {
        loginButtonMobile.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowLoginModal(true)
        })
      }

      const farmButtonMobile = document.querySelector("#farm-button-mobile")
      if (farmButtonMobile) {
        farmButtonMobile.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowFarmRegistration(true)
        })
      }
    }

    // Run immediately
    attachHeaderButtonHandlers()

    // Also run after a short delay to ensure DOM is fully loaded
    const timer1 = setTimeout(attachHeaderButtonHandlers, 100)
    const timer2 = setTimeout(attachHeaderButtonHandlers, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [setShowWishlistDrawer, setShowCartDrawer, setShowLoginModal, setShowFarmRegistration])

  // Add this function to create a consistent header across all pages
  const renderHeader = () => {
    return (
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="flex items-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ea323b94-04a7-4943-863c-ae675d5817c1.jpg-aFmJJgd9kRatcFlDgmHoSy88oViPtK.jpeg"
                  alt="KleverFarms Logo"
                  className="h-16 sm:h-20 md:h-24"
                />
              </Link>
  
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setShowLocationSelector(!showLocationSelector)}
                >
                  <MapPin className="h-4 w-4" />
                  {selectedLocation !== "Select Location" ? (
                    <span className="text-green-700">{selectedLocation}</span>
                  ) : (
                    <span>Find Nearby Farms</span>
                  )}
                </Button>
  
                {/* 👇 Fixed Hydration: Add isClient */}
                {isClient && showLocationSelector && (
                  <LocationSelector
                    onSelect={handleLocationSelect}
                    onClose={() => setShowLocationSelector(false)}
                    onOpenMap={handleOpenMap}
                  />
                )}
              </div>
            </div>
  
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowWishlistDrawer(true)
                }}
                id="wishlist-button"
              >
                <Heart className="h-5 w-5" />
              </button>
  
              <button
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowCartDrawer(true)
                }}
                id="cart-button"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
  
              <div className="hidden md:flex gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors duration-150 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  onClick={() => setShowLoginModal(true)}
                  id="login-button"
                >
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>User Login</span>
                </button>
  
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors duration-150 text-sm sm:text-base"
                  onClick={() => setShowFarmRegistration(true)}
                  id="farm-button"
                >
                  List Your Farm Today
                </button>
              </div>
            </div>
          </div>
  
          {/* Mobile Section */}
          <div className="mt-2 sm:mt-3 md:hidden flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-green-600 text-green-600 hover:bg-green-50 text-xs"
              onClick={() => setShowLocationSelector(!showLocationSelector)}
            >
              <MapPin className="h-3 w-3" />
              {selectedLocation !== "Select Location" ? (
                <span className="truncate max-w-[120px]">{selectedLocation}</span>
              ) : (
                <span>Find Nearby Farms</span>
              )}
            </Button>
  
            <div className="flex gap-2 flex-wrap justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md cursor-pointer btn-hover-effect text-xs sm:text-sm transition-transform duration-150 transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
                onClick={() => setShowLoginModal(true)}
                id="login-button-mobile"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>User Login</span>
              </button>
  
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md cursor-pointer text-xs sm:text-sm transition-transform duration-150 transform hover:scale-105"
                onClick={() => setShowFarmRegistration(true)}
                id="farm-button-mobile"
              >
                List Your Farm
              </button>
            </div>
          </div>
  
          {/* 👇 Add for Mobile also! */}
          {isClient && showLocationSelector && (
            <LocationSelector
              onSelect={handleLocationSelect}
              onClose={() => setShowLocationSelector(false)}
            />
          )}
        </div>
      </header>
    )
  }
  

  // Optimize the Home component to load faster
  // Remove unnecessary animations and effects that might slow down initial loading
  // Add code at the top of the Home component function, right after state declarations

  // Add this optimization code
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      // Optimize initial loading
      document.body.classList.add("js-loading")

      // Defer non-critical animations
      const deferAnimations = () => {
        document.body.classList.remove("js-loading")

        // Enable animations after initial render
        const style = document.createElement("style")
        style.innerHTML = `
        .animate-fade-in, .animate-pop-in, .animate-float, 
        .animate-bounce-slow, .animate-pulse-slow {
          animation-play-state: running !important;
        }
      `
        document.head.appendChild(style)
      }

      // Defer animations until after initial render
      if (window.requestIdleCallback) {
        window.requestIdleCallback(deferAnimations)
      } else {
        setTimeout(deferAnimations, 1000)
      }

      return () => {
        document.body.classList.remove("js-loading")
      }
    }
  }, [])

  // Fix the image loading optimization
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      // Add lazy loading to all images
      const images = document.querySelectorAll("img")
      images.forEach((img) => {
        if (!img.hasAttribute("loading")) {
          img.setAttribute("loading", "lazy")
        }
      })
    }
  }, [])

  // Optimize button response time by adding this at the top of the Home component, right after the state declarations

  useEffect(() => {
    // Immediate response handlers for buttons
    const setupFastResponseButtons = () => {
      // Pre-load modals to reduce opening time
      const preloadModals = () => {
        // Create hidden instances of modals to pre-load them
        const farmRegPreload = document.createElement("div")
        farmRegPreload.style.display = "none"
        farmRegPreload.id = "farm-reg-preload"
        document.body.appendChild(farmRegPreload)

        const loginPreload = document.createElement("div")
        loginPreload.style.display = "none"
        loginPreload.id = "login-preload"
        document.body.appendChild(loginPreload)
      }

      // Add direct click handlers to buttons
      document.querySelectorAll("button").forEach((button) => {
        const text = button.textContent?.toLowerCase() || ""

        if (text.includes("list your farm") || text.includes("farm today")) {
          button.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowFarmRegistration(true)
          })
        }

        if (text.includes("user login")) {
          button.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowLoginModal(true)
          })
        }

        // Make Quick View buttons respond faster
        if (text.includes("quick view")) {
          button.addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            // Find the product ID from parent elements
            const productCard = button.closest(".product-card")
            if (productCard) {
              const productId = productCard.getAttribute("data-product-id")
              if (productId) {
                handleProductCardSelect(productId)
              }
            }
          })
        }
      })

      preloadModals()
    }

    // Run immediately and after a short delay to catch dynamically added buttons
    setupFastResponseButtons()
    const timer = setTimeout(setupFastResponseButtons, 500)

    return () => clearTimeout(timer)
  }, [setShowFarmRegistration, setShowLoginModal, handleProductCardSelect])

  // Refs for animations
  const snippetsContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll snippets
  useEffect(() => {
    const container = snippetsContainerRef.current
    if (!container) return

    let scrollInterval: NodeJS.Timeout

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0
        } else {
          container.scrollLeft += 1
        }
      }, 30)
    }

    startAutoScroll()

    // Pause on hover
    container.addEventListener("mouseenter", () => {
      clearInterval(scrollInterval)
    })

    container.addEventListener("mouseleave", () => {
      startAutoScroll()
    })

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  // Fix for buttons not being clickable
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    button, a, [role="button"], .btn-hover-effect, .cursor-pointer {
      pointer-events: auto !important;
      z-index: 5 !important;
      position: relative !important;
      
    }
    
    .product-card-actions {
      z-index: 20 !important;
      position: relative !important;
    }
    
    /* Mobile optimizations */
    @media (max-width: 640px) {
      .text-4xl {
        font-size: 1.75rem !important;
      }
      .text-3xl {
        font-size: 1.5rem !important;
      }
      .text-2xl {
        font-size: 1.25rem !important;
      }
      .text-xl {
        font-size: 1.125rem !important;
      }
      .text-lg {
        font-size: 1rem !important;
      }
      
      /* Reduce padding on mobile */
      .p-6 {
        padding: 1rem !important;
      }
      .py-8 {
        padding-top: 1.5rem !important;
        padding-bottom: 1.5rem !important;
      }
      .py-12 {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
      }
      
      /* Fix button sizes on mobile */
      button {
        font-size: 0.875rem !important;
      }
    }
  `
    document.head.appendChild(style)

    // Add click event listeners to ensure buttons work
    const setupButtonListeners = () => {
      // Farm registration button
      const farmButtons = document.querySelectorAll(".bg-green-600, .bg-green-700")
      farmButtons.forEach((btn) => {
        if (!btn.closest(".product-card")) {
          // Don't apply to product card buttons
          btn.addEventListener("click", (e) => {
            e.stopPropagation()
            setShowFarmRegistration(true)
          })
        }
      })

      // Login button
      const loginButtons = document.querySelectorAll(".bg-blue-500, .bg-blue-600")
      loginButtons.forEach((btn) => {
        if (!btn.closest(".product-card")) {
          // Don't apply to product card buttons
          btn.addEventListener("click", (e) => {
            e.stopPropagation()
            setShowLoginModal(true)
          })
        }
      })
    }

    // Run once and then on any potential re-renders
    setupButtonListeners()
    const timer = setTimeout(setupButtonListeners, 500)

    // Add direct event handlers to specific buttons by ID
    const loginButton = document.getElementById("login-button")
    if (loginButton) {
      loginButton.onclick = () => setShowLoginModal(true)
    }

    const farmButton = document.getElementById("farm-button")
    if (farmButton) {
      farmButton.onclick = () => setShowFarmRegistration(true)
    }

    return () => {
      document.head.removeChild(style)
      clearTimeout(timer)
    }
  }, [setShowLoginModal, setShowFarmRegistration])

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowAllCategories(false)
    setIsSearching(false)
    setIsCheckingOut(false)
  }

  // Handle view all categories
  const handleViewAllCategories = () => {
    setShowAllCategories(true)
    setSelectedCategory(null)
    setIsSearching(false)
    setIsCheckingOut(false)
  }

  // Handle back from category or all categories view
  const handleBackToHome = () => {
    setSelectedCategory(null)
    setShowAllCategories(false)
    setIsSearching(false)
    setIsCheckingOut(false)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      setSelectedCategory(null)
      setShowAllCategories(false)
      setIsCheckingOut(false)
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true)
    setShowCartDrawer(false)
    setSelectedCategory(null)
    setShowAllCategories(false)
    setIsSearching(false)
  }

  const handleLocationSelect = (location: string | { lat: number; lng: number; name: string }) => {
    if (typeof location === "string") {
      setSelectedLocation(location)
    } else {
      setSelectedLocation(location.name)
    }
    setShowLocationSelector(false)
    setShowMapModal(false)

    // Show a notification that nearby farms are being loaded
    alert(`Showing farms near ${typeof location === "string" ? location : location.name}`)

    // In a real app, you would fetch farms near the selected location
    // For now, we'll just scroll to the farms section
    const farmsSection = document.getElementById("farms-section")
    if (farmsSection) {
      farmsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleOpenMap = () => {
    setShowLocationSelector(false)
    setShowMapModal(true)
  }

  // Render checkout page
  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <main className="container mx-auto px-4">
          <CheckoutPage onBack={handleBackToHome} />
        </main>

        {/* Modals and Drawers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSignup={() => {
              setShowLoginModal(false)
              setShowSignupModal(true)
            }}
          />
        )}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onLogin={() => {
              setShowSignupModal(false)
              setShowLoginModal(true)
            }}
          />
        )}
        {showWishlistDrawer && <WishlistDrawer onClose={() => setShowWishlistDrawer(false)} />}
        {showCartDrawer && <CartDrawer onClose={() => setShowCartDrawer(false)} onCheckout={handleCheckout} />}
        {showLocationSelector && (
          <LocationSelector onSelect={handleLocationSelect} onClose={() => setShowLocationSelector(false)} />
        )}
        {selectedProduct && (
          <ProductDetailModal
            product={sampleProducts[selectedProduct as keyof typeof sampleProducts]}
            onClose={() => setSelectedProduct(null)}
          />
        )}
        {showFarmRegistration && (
          <FarmRegistration
            onClose={() => setShowFarmRegistration(false)}
            onSuccess={() => {
              setShowFarmRegistration(false)
              // Show success message or redirect
            }}
          />
        )}
      </div>
    )
  }

  // Render search results if searching
  if (isSearching) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <main className="container mx-auto px-4">
          <SearchResults searchQuery={searchQuery} onBack={handleBackToHome} />
        </main>

        {/* Modals and Drawers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSignup={() => {
              setShowLoginModal(false)
              setShowSignupModal(true)
            }}
          />
        )}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onLogin={() => {
              setShowSignupModal(false)
              setShowLoginModal(true)
            }}
          />
        )}
        {showWishlistDrawer && <WishlistDrawer onClose={() => setShowWishlistDrawer(false)} />}
        {showCartDrawer && <CartDrawer onClose={() => setShowCartDrawer(false)} onCheckout={handleCheckout} />}
        {showLocationSelector && (
          <LocationSelector onSelect={handleLocationSelect} onClose={() => setShowLocationSelector(false)} />
        )}
        {selectedProduct && (
          <ProductDetailModal
            product={sampleProducts[selectedProduct as keyof typeof sampleProducts]}
            onClose={() => setSelectedProduct(null)}
          />
        )}
        {showFarmRegistration && (
          <FarmRegistration
            onClose={() => setShowFarmRegistration(false)}
            onSuccess={() => {
              setShowFarmRegistration(false)
              // Show success message or redirect
            }}
          />
        )}
      </div>
    )
  }

  // Render category page if a category is selected
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <main className="container mx-auto px-4">
          <CategoryPage category={selectedCategory} onBack={handleBackToHome} />
        </main>

        {/* Modals and Drawers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSignup={() => {
              setShowLoginModal(false)
              setShowSignupModal(true)
            }}
          />
        )}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onLogin={() => {
              setShowSignupModal(false)
              setShowLoginModal(true)
            }}
          />
        )}
        {showWishlistDrawer && <WishlistDrawer onClose={() => setShowWishlistDrawer(false)} />}
        {showCartDrawer && <CartDrawer onClose={() => setShowCartDrawer(false)} onCheckout={handleCheckout} />}
        {showLocationSelector && (
          <LocationSelector onSelect={handleLocationSelect} onClose={() => setShowLocationSelector(false)} />
        )}
        {selectedProduct && (
          <ProductDetailModal
            product={sampleProducts[selectedProduct as keyof typeof sampleProducts]}
            onClose={() => setSelectedProduct(null)}
          />
        )}
        {showFarmRegistration && (
          <FarmRegistration
            onClose={() => setShowFarmRegistration(false)}
            onSuccess={() => {
              setShowFarmRegistration(false)
              // Show success message or redirect
            }}
          />
        )}
      </div>
    )
  }

  // Render all categories page
  if (showAllCategories) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <main className="container mx-auto px-4">
          <AllCategories onSelectCategory={handleCategorySelect} onBack={handleBackToHome} />
        </main>

        {/* Modals and Drawers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSignup={() => {
              setShowLoginModal(false)
              setShowSignupModal(true)
            }}
          />
        )}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onLogin={() => {
              setShowSignupModal(false)
              setShowLoginModal(true)
            }}
          />
        )}
        {showWishlistDrawer && <WishlistDrawer onClose={() => setShowWishlistDrawer(false)} />}
        {showCartDrawer && <CartDrawer onClose={() => setShowCartDrawer(false)} onCheckout={handleCheckout} />}
        {showLocationSelector && (
          <LocationSelector onSelect={handleLocationSelect} onClose={() => setShowLocationSelector(false)} />
        )}
        {selectedProduct && (
          <ProductDetailModal
            product={sampleProducts[selectedProduct as keyof typeof sampleProducts]}
            onClose={() => setSelectedProduct(null)}
          />
        )}
        {showFarmRegistration && (
          <FarmRegistration
            onClose={() => setShowFarmRegistration(false)}
            onSuccess={() => {
              setShowFarmRegistration(false)
              // Show success message or redirect
            }}
          />
        )}
      </div>
    )
  }

  // Render home page
  return (
    <>
      {/* Header */}
      {renderHeader()}

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-16">
            <div className="flex flex-col md:flex-row items-center">
              {/* Carousel - Will appear first on mobile */}
              <div className="md:w-1/2 w-full order-first md:order-last mb-6 md:mb-0 animate-fade-in delay-400 relative">
                <HeroCarousel
                 slides={[
                  {
                    image: "https://kleverfarms.com/images/farm-carousel-1.png",
                    caption: "Smart Farming with Drone Technology for Precision Agriculture",
                  },
                  {
                    image: "https://kleverfarms.com/images/farm-carousel-2.png",
                    caption: "Connecting Farmers with Technology and Direct Market Access",
                  },
                  {
                    image: "https://kleverfarms.com/images/farm-carousel-3.png",
                    caption: "Empowering Rural Communities with Modern Farming Solutions",
                  },
                  ]}
                  className="w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-500"
                  aspectRatio="16/9"
                />
              </div>

              {/* Text content - Will appear second on mobile */}
              <div className="md:w-1/2 order-last md:order-first mb-6 md:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
                  <span className="animate-slide-in-left inline-block text-green-600">KleverFarms</span>
                </h1>
                <div className="space-y-3 sm:space-y-4">
                  <div className="animate-fade-in delay-300">
                    <div className="relative py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-green-100 to-transparent rounded-lg mb-2 sm:mb-3 transform hover:scale-102 transition-all duration-300">
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-8 sm:h-12 bg-green-500 rounded-r-full"></div>
                      <p className="text-base sm:text-lg md:text-xl text-teal-700 font-medium">
                        Bridging all klever farmers & farmpreneurs together
                      </p>
                    </div>

                    <div className="relative py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-teal-100 to-transparent rounded-lg mb-2 sm:mb-3 transform hover:scale-102 transition-all duration-300">
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-8 sm:h-12 bg-teal-500 rounded-r-full"></div>
                      <p className="text-base sm:text-lg md:text-xl text-teal-700 font-medium">
                        Building sustainable and credible relationships between farmers and consumers
                      </p>
                    </div>

                    <div className="relative py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-100 to-transparent rounded-lg mb-2 sm:mb-3 transform hover:scale-102 transition-all duration-300">
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-8 sm:h-12 bg-blue-500 rounded-r-full"></div>
                      <p className="text-base sm:text-lg md:text-xl text-teal-700 font-medium">
                        Breaking traditional barriers and exploring new possibilities
                      </p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg text-green-600 font-medium italic animate-fade-in delay-400 border-l-4 border-green-500 pl-3">
                    Grow it. The Klever Way.
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 animate-fade-in delay-300 mt-4">
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold shadow-md rounded-lg transition-colors duration-150 z-10"
                    onClick={() => {
                      const productsSection = document.getElementById("signature-products-section")
                      if (productsSection) {
                        productsSection.scrollIntoView({ behavior: "smooth" })
                      }
                    }}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join KleverFarms Carousel - NEW SECTION */}
        <section className="py-6 sm:py-8 md:py-12 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg">
              <WhyJoinCarousel />
            </div>

            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold shadow-md rounded-lg transition-transform duration-150 transform hover:scale-105"
                onClick={() => setShowFarmRegistration(true)}
              >
                Join KleverFarms Today
              </Button>
            </div>
          </div>
        </section>

        {/* Farms Section */}
        <section id="farms-section" className="py-6 sm:py-8 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Partner Farms</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Connect directly with our partner farmers and get the freshest produce
                </p>
              </div>
              <Link href="/farms">
                <Button variant="ghost" className="text-green-600 font-medium text-sm sm:text-base">
                  View All
                </Button>
              </Link>
            </div>

            {selectedLocation !== "Select Location" && (
  <div className="inline-flex items-center px-3 py-1 mb-3 sm:mb-4 bg-green-50 rounded-full">
    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1" />
    <span className="text-xs sm:text-sm font-medium text-green-600">
      Farms near {selectedLocation}
    </span>
  </div>
)}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {loading ? (
    [...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse space-y-3">
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    ))
  ) : farms.length === 0 ? (
    <p className="col-span-full text-center text-gray-500 py-4">No approved farms found.</p>
  ) : (
    farms.map((farm) => (
      <Link href={`/${farm.slug}`} key={farm.id} className="block">
        <FarmCard
          id={`farm-${farm.id}`}
          name={farm.farmName}
          image={farm.images?.[0] || "/default.webp"}
          location={`${farm.city}, ${farm.state}`}
          distance="5 km"
          rating={4.8}
          specialties={farm.specialties || []}
          onClick={() => {}}
        />
      </Link>
    ))
  )}
</div>



















          </div>
        </section>

        {/* Categories Section - UPDATED */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop by Category</h2>
              <button
                className="flex items-center text-green-600 font-medium hover:underline text-sm sm:text-base"
                onClick={handleViewAllCategories}
              >
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>

            {/* Update the CategoryCard components in the "Shop by Category" section to not include the count:

            \`\`\`jsx
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div
                onClick={() => handleCategorySelect("Dairy Farms")}
                className="cursor-pointer animate-fade-in delay-200"
              >
                <CategoryCard name="Dairy Farms" image="https://kleverfarms.com/images/products/shrikhand-1.jpeg" />
              </div>
              <div onClick={() => handleCategorySelect("Grains")} className="cursor-pointer animate-fade-in delay-300">
                <CategoryCard name="Grains" image="https://kleverfarms.com/images/products/soyabean.jpeg" />
              </div>
              <div
                onClick={() => handleCategorySelect("Klever Eats")}
                className="cursor-pointer animate-fade-in delay-500"
              >
                <CategoryCard name="Klever Eats" image="https://kleverfarms.com/images/products/rasam.jpeg" />
              </div>
            </div>
            \`\`\` */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div
                onClick={() => handleCategorySelect("Dairy Farms")}
                className="cursor-pointer animate-fade-in delay-200"
              >
                <CategoryCard name="Dairy Farms" image="https://kleverfarms.com/images/products/shrikhand-1.jpeg" />
              </div>
              <div onClick={() => handleCategorySelect("Grains")} className="cursor-pointer animate-fade-in delay-300">
                <CategoryCard name="Grains" image="https://kleverfarms.com/images/products/soyabean.jpeg" />
              </div>
              <div
                onClick={() => handleCategorySelect("Klever Eats")}
                className="cursor-pointer animate-fade-in delay-500"
              >
                <CategoryCard name="Klever Eats" image="https://kleverfarms.com/images/products/rasam.jpeg" />
              </div>
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-3 sm:py-4">
          <div className="container mx-auto px-3 sm:px-4">
            <PromoBanner
              title="50% OFF on your first order"
              description="Use code KLEVER50 at checkout"
              buttonText="Shop Now"
              image="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?q=80&w=1000&auto=format&fit=crop"
            />
          </div>
        </section>

        {/* Our Signature Products (renamed from Farm Fresh Products) */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Our Signature Products</h2>
              <button className="flex items-center text-green-600 font-medium hover:underline text-sm sm:text-base">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>

            {/* Update the "Our Signature Products" section to show only the products we want
            // In the render home page return statement, find the "Our Signature Products" section and replace the grid with: */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              <div className="animate-pop-in delay-100">
                <ProductCard
                  id="dairy-1"
                  name="Shrikhand"
                  price={249.99}
                  unit="500g"
                  image="https://kleverfarms.com/images/products/shrikhand-1.jpeg"
                  discount={0}
                  rating={4.8}
                  onClick={() => handleProductCardSelect("dairy-1")}
                />
              </div>
              <div className="animate-pop-in delay-200">
                <ProductCard
                  id="dairy-2"
                  name="Amrakhand"
                  price={279.99}
                  unit="500g"
                  image="https://kleverfarms.com/images/products/amarkhand-1.jpeg"
                  discount={10}
                  rating={4.7}
                  onClick={() => handleProductCardSelect("dairy-2")}
                />
              </div>
              <div className="animate-pop-in delay-300">
                <ProductCard
                  id="dairy-4"
                  name="Paneer"
                  price={349.99}
                  unit="500g"
                  image="https://kleverfarms.com/images/products/paneer.jpeg"
                  discount={15}
                  rating={4.9}
                  onClick={() => handleProductCardSelect("dairy-4")}
                />
              </div>
              <div className="animate-pop-in delay-400">
                <ProductCard
                  id="soy-1"
                  name="Organic Soybeans"
                  price={149.99}
                  unit="500g"
                  image="https://kleverfarms.com/images/products/soyabean.jpeg"
                  discount={0}
                  rating={4.7}
                  onClick={() => handleProductCardSelect("soy-1")}
                />
              </div>
              <div className="animate-pop-in delay-500">
                <ProductCard
                  id="soy-3"
                  name="Jowar Crush"
                  price={129.99}
                  unit="400g"
                  image="https://kleverfarms.com/images/products/jowar-crush.jpeg"
                  discount={5}
                  rating={4.6}
                  onClick={() => handleProductCardSelect("soy-3")}
                />
              </div>
              <div className="animate-pop-in delay-600">
                <ProductCard
                  id="ke-1"
                  name="Ragi Idli Mix"
                  price={199.99}
                  unit="500g"
                  image="https://kleverfarms.com/images/products/ragi-idli-mix.jpeg"
                  discount={0}
                  rating={4.7}
                  onClick={() => handleProductCardSelect("ke-1")}
                />
              </div>
              <div className="animate-pop-in delay-700">
                <ProductCard
                  id="ke-5"
                  name="Rasam Khichadi Mix"
                  price={229.99}
                  unit="200g"
                  image="https://kleverfarms.com/images/products/rasam.jpeg"
                  discount={15}
                  rating={4.7}
                  onClick={() => handleProductCardSelect("ke-5")}
                />
              </div>
              <div className="animate-pop-in delay-800">
                <ProductCard
                  id="ke-3"
                  name="Methi Paratha Mix"
                  price={249.99}
                  unit="200g"
                  image="https://kleverfarms.com/images/products/paratha.jpeg"
                  discount={0}
                  rating={4.9}
                  onClick={() => handleProductCardSelect("ke-3")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Deals Section */}
        <section className="py-6 sm:py-8 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Today's Deals</h2>
              <button className="flex items-center text-green-600 font-medium hover:underline text-sm sm:text-base">
                View All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 flex items-center hover:shadow-lg transition-shadow animate-fade-in">
                <div className="flex-1">
                  <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium mb-2">
                    DAIRY BUNDLE
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Dr. Jo's Dairy Special</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Get 20% off on Shrikhand & Amrakhand combo
                  </p>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 btn-hover-effect text-sm sm:text-base"
                    onClick={() => handleCategorySelect("Dairy Farms")}
                  >
                    Shop Now
                  </Button>
                </div>
                <div className="w-1/3">
                  <img
                    src="https://kleverfarms.com/images/products/shrikhand-1.jpeg"
                    alt="Dairy Products"
                    className="rounded-lg h-20 w-20 sm:h-24 sm:w-24 object-cover animate-bounce-slow"
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 flex items-center hover:shadow-lg transition-shadow animate-fade-in delay-200">
                <div className="flex-1">
                  <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium mb-2">
                    READY-TO-COOK
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">KleverEats Meal Kit</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Buy any 3 ready-to-cook mixes and get 25% off
                  </p>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 btn-hover-effect text-sm sm:text-base"
                    onClick={() => handleCategorySelect("Klever Eats")}
                  >
                    Shop Now
                  </Button>
                </div>
                <div className="w-1/3">
                  <img
                    src="https://kleverfarms.com/images/products/rasam.jpeg"
                    alt="Ready-to-Cook Products"
                    className="rounded-lg h-20 w-20 sm:h-24 sm:w-24 object-cover animate-bounce-slow animation-delay-500"
                  />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 sm:p-6 flex items-center hover:shadow-lg transition-shadow animate-fade-in delay-400">
                <div className="flex-1">
                  <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium mb-2">
                    GRAINS SPECIAL
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Soy for Joy Bundle</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    Organic Soybeans & Protein Powder at 15% off
                  </p>
                  <Button
                    className="bg-green-500 hover:bg-green-600 btn-hover-effect text-sm sm:text-base"
                    onClick={() => handleCategorySelect("Grains")}
                  >
                    Shop Now
                  </Button>
                </div>
                <div className="w-1/3">
                  <img
                    src="https://kleverfarms.com/images/products/soyabean.jpeg"
                    alt="Soy Products"
                    className="rounded-lg h-20 w-20 sm:h-24 sm:w-24 object-cover animate-bounce-slow animation-delay-1000"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-8 sm:py-10 md:py-12 bg-green-600 text-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 animate-fade-in">
                  Download the KleverFarms App
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-green-100 mb-4 sm:mb-6 animate-fade-in delay-200">
                  Get exclusive offers and track your deliveries. Download our app for a seamless shopping experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in delay-300">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 flex items-center justify-center gap-2 btn-hover-effect text-sm sm:text-base">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5,2H8.5C6.5,2,5,3.5,5,5.5v13C5,20.5,6.5,22,8.5,22h9c2,0,3.5-1.5,3.5-3.5v-13C21,3.5,19.5,2,17.5,2z M13,20.5h-2v-1h2V20.5z M18,17.5H8V5h10V17.5z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </Button>
                  <Button className="bg-white text-green-600 hover:bg-gray-100 flex items-center justify-center gap-2 btn-hover-effect text-sm sm:text-base">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.9,3.5,2.5,4,2.5L13.5,12L4,21.5C3.5,21.5,3,21.1,3,20.5z M14.5,12L20,16.5V7.5L14.5,12z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 animate-fade-in delay-400">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"
                  alt="KleverFarms Mobile App"
                  className="rounded-lg shadow-xl h-60 sm:h-80 w-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 footer-wave">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="animate-fade-in">
              <div className="flex flex-col items-start">
                <div className="bg-gray-900 p-1 rounded-lg overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ea323b94-04a7-4943-863c-ae675d5817c1.jpg-aFmJJgd9kRatcFlDgmHoSy88oViPtK.jpeg"
                    alt="KleverFarms Logo"
                    className="h-12 sm:h-16"
                  />
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Connecting farmers and consumers directly for fresher produce and fairer prices.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/farms" className="text-gray-300 hover:text-white transition-colors">
                    Our Farms
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/find-farms" className="text-gray-300 hover:text-white transition-colors">
                    Find Nearby Farms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect("Dairy Farms")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Dairy Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategorySelect("Grains")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Grains & Millets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategorySelect("Klever Eats")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Ready-to-Cook
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-300">
                <p className="mb-2">Email: support@kleverfarms.com</p>
                <p className="mb-2">Phone: +91 9876543210</p>
                <p>
                  Address: Kleverfarms Agritech LLP, <br />
                  Sy No 37/1 , Chikodi Road , Chinchani <br/>Dist Belagavi Pin 591287 <br />
                  India - 590001
                </p>
              </address>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} KleverFarms. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSignup={() => {
            setShowLoginModal(false)
            setShowSignupModal(true)
          }}
        />
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onLogin={() => {
            setShowSignupModal(false)
            setShowLoginModal(true)
          }}
        />
      )}
      {showWishlistDrawer && <WishlistDrawer onClose={() => setShowWishlistDrawer(false)} />}
      {showCartDrawer && <CartDrawer onClose={() => setShowCartDrawer(false)} onCheckout={handleCheckout} />}
      {showLocationSelector && (
        <LocationSelector onSelect={handleLocationSelect} onClose={() => setShowLocationSelector(false)} />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={sampleProducts[selectedProduct as keyof typeof sampleProducts]}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {showFarmRegistration && (
        <FarmRegistration
          onClose={() => setShowFarmRegistration(false)}
          onSuccess={() => {
            setShowFarmRegistration(false)
            // Show success message or redirect
          }}
        />
      )}
    </>
  )
}

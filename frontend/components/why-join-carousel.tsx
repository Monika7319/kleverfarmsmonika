"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface CarouselSlide {
  image: string
  title: string
  description: string
  highlight: string
}

// Update the slides array to include more detailed content for each slide
const slides: CarouselSlide[] = [
  {
    image: "/images/farm-tech-drones.png",
    title: "Embrace Modern Farming",
    description:
      "Access cutting-edge agricultural technology and innovations to increase your farm's productivity and efficiency. Our platform connects you with the latest farming techniques and tools.",
    highlight: "Tech-Forward Solutions",
  },
  {
    image: "/images/traditional-farming.png",
    title: "Preserve Farming Heritage",
    description:
      "Showcase your traditional farming methods while reaching modern markets. No middlemen means you get fair prices for your produce and consumers appreciate your authentic approach.",
    highlight: "Honor Tradition",
  },
  {
    image: "/images/smart-farming.png",
    title: "Smart Farming Practices",
    description:
      "Implement IoT sensors and precision agriculture techniques to optimize your yields. Our network provides resources and knowledge sharing to help you adopt sustainable smart farming.",
    highlight: "Data-Driven Success",
  },
  {
    image: "/images/farm-sunset.png",
    title: "Sustainable Future",
    description:
      "Build a greener, more sustainable farming ecosystem that benefits both your business and the planet. Join farmers who are leading the eco-friendly agricultural revolution.",
    highlight: "Eco-Friendly Approach",
  },
  {
    image: "/images/harvest-farmers.png",
    title: "Direct Market Access",
    description:
      "Connect directly with consumers and increase your profits by eliminating middlemen. Build loyal customer relationships and receive fair compensation for your quality produce.",
    highlight: "Skip the Middlemen",
  },
]

export default function WhyJoinCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  // Handle previous slide
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  // Handle next slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1))
  }

  // Auto-advance carousel
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        handleNext()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, isPaused])

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > 50

    if (isSwipe) {
      if (distance > 0) {
        // Swipe left
        handleNext()
      } else {
        // Swipe right
        handlePrev()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Update the render method to include more detailed content at the bottom of each slide
  return (
    <div className="relative overflow-hidden w-full rounded-xl">
      <div
        ref={carouselRef}
        className="w-full relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden">
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>

                {/* "Why Join KleverFarms" title overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white bg-gradient-to-b from-black/70 to-transparent">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                    Why Join KleverFarms
                  </h2>
                </div>

                {/* Enhanced content overlay with more detailed points */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white bg-gradient-to-t from-black/90 to-transparent/0">
                  <div className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-green-600 rounded-full text-xs md:text-sm font-semibold mb-1 sm:mb-2 animate-pulse">
                    {slide.highlight}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-3xl font-bold mb-1 sm:mb-2 md:mb-3">{slide.title}</h3>
                  <p className="text-xs sm:text-sm md:text-lg max-w-3xl mb-2 sm:mb-4 line-clamp-2 md:line-clamp-none">
                    {slide.description}
                  </p>

                  {/* Additional benefits points - only show on larger screens */}
                  <div className="mb-2 sm:mb-4 max-w-3xl hidden sm:block">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                      {index === 0 && (
                        <>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Showcase your farm & produce to wider markets</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Access to modern farming technology resources</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Increase productivity with tech-forward solutions</span>
                          </li>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Preserve traditional farming knowledge</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Say "NO" to local Sauda market exploitation</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Dedicated profile page for your farm's heritage</span>
                          </li>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Implement IoT sensors and precision agriculture</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Data-driven farming decisions for better yields</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>No commissions for direct consumer sales</span>
                          </li>
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Build sustainable farming practices</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Reduce environmental impact with eco-friendly methods</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Share your knowledge & experience with others</span>
                          </li>
                        </>
                      )}
                      {index === 4 && (
                        <>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Nationwide delivery network through trusted partners</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>End consumers know their grower (traceability)</span>
                          </li>
                          <li className="flex items-center gap-1 sm:gap-2">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-400 rounded-full"></span>
                            <span>Build sustainable relationships with consumers</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all transform hover:scale-105 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-auto"
                    onClick={() => alert(`Learn more about: ${slide.title}`)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-1 sm:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${
              currentIndex === index ? "w-4 sm:w-6 bg-white" : "w-1.5 sm:w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-advance indicator */}
      {!isPaused && (
        <div
          className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-green-500 transition-all duration-300"
          style={{
            width: `${(1 / slides.length) * 100}%`,
            transform: `translateX(${currentIndex * 100}%)`,
          }}
        ></div>
      )}
    </div>
  )
}

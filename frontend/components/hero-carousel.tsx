"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "../styles/carousel.css"

interface CarouselSlide {
  image: string
  caption: string
}

interface HeroCarouselProps {
  slides?: CarouselSlide[]
  images?: string[]
  interval?: number
  className?: string
  aspectRatio?: string
}

export default function HeroCarousel({
  slides,
  images,
  interval = 5000,
  className = "",
  aspectRatio = "16/9",
}: HeroCarouselProps) {
  // Convert images array to slides format if images is provided
  const carouselSlides =
    slides ||
    images?.map((image) => ({
      image,
      caption: "",
    })) ||
    []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Preload images for smoother transitions
  useEffect(() => {
    if (carouselSlides.length === 0) return

    const imagePromises = carouselSlides.map((slide) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = slide.image
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
      })
    })

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true)
    })
  }, [carouselSlides])

  // Auto-advance slides
  useEffect(() => {
    if (carouselSlides.length === 0 || !imagesLoaded) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [carouselSlides.length, interval, imagesLoaded])

  const goToPrevious = () => {
    if (carouselSlides.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToNext = () => {
    if (carouselSlides.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length)
  }

  // If no slides, return empty div with className
  if (carouselSlides.length === 0) {
    return <div className={className}></div>
  }

  return (
    <div className={`carousel-container rounded-lg ${className}`} style={{ aspectRatio }}>
      {/* Images */}
      {carouselSlides.map((slide, index) => (
        <div key={index} className={`carousel-slide ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img
            src={slide.image || "/placeholder.svg"}
            alt={`Farm carousel image ${index + 1}`}
            className="carousel-image"
          />
          {slide.caption && (
            <div className="carousel-caption">
              <p className="text-xs sm:text-sm font-medium drop-shadow-md">{slide.caption}</p>
            </div>
          )}
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 sm:h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-4 sm:w-6 bg-white" : "w-1 sm:w-1.5 bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

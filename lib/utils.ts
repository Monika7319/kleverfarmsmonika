import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication headers utility - Fixed token key
export function authHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  if (typeof window !== "undefined") {
    // Try both possible token keys
    const token =
      localStorage.getItem("token") || localStorage.getItem("auth_token") || localStorage.getItem("farm_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// For FormData requests (file uploads) - Fixed token key
export function authHeadersFormData(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    // Don't set Content-Type for FormData - browser will set it automatically
  }

  if (typeof window !== "undefined") {
    // Try both possible token keys
    const token =
      localStorage.getItem("token") || localStorage.getItem("auth_token") || localStorage.getItem("farm_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// API base URL - Updated to handle different environments
export const API_BASE_URL = (() => {
  if (typeof window !== "undefined") {
    // Client-side: use environment variable or fallback
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
})()

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

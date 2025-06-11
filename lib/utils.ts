import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// Get auth headers for JSON requests
export const authHeaders = () => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// Get auth headers for FormData requests (don't set Content-Type)
export const authHeadersFormData = () => {
  const headers: HeadersInit = {
    Accept: "application/json",
    // Don't set Content-Type for FormData - browser will set it automatically
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// Format date and time
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

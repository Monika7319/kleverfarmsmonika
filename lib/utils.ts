import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token") || localStorage.getItem("farmer_token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export function authHeadersFormData(): HeadersInit {
  const token = localStorage.getItem("auth_token") || localStorage.getItem("farmer_token")
  return {
    Authorization: `Bearer ${token}`,
    // Don't set Content-Type for FormData - let browser set it with boundary
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

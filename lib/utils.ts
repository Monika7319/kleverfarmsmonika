import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"

// Format currency to INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

// Get auth headers for JSON requests
export function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("farm_token") : null

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }
}

// Get auth headers for FormData requests (no Content-Type)
export function authHeadersFormData() {
  const token = typeof window !== "undefined" ? localStorage.getItem("farm_token") : null

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }
}

// Handle API errors
export async function handleApiError(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error ${response.status}`)
  }
  return response.json()
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function authHeadersFormData(): HeadersInit {
  const token = localStorage.getItem("farmer_token")
  return {
    Authorization: `Bearer ${token}`,
    // Don't set Content-Type for FormData - let browser set it with boundary
  }
}

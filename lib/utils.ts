import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this function to handle farmer login redirect
export const redirectToFarmerDashboard = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/farmer-dashboard"
  }
}

// Add this function to check if user is farmer and redirect accordingly
export const handleFarmerAuth = (userData: any) => {
  if (userData.role === "farmer" || userData.user_type === "farmer") {
    redirectToFarmerDashboard()
    return true
  }
  return false
}

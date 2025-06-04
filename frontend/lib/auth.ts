// Authentication utility functions
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  exp: number
  user_id: string
  email: string
  role: string
  [key: string]: any
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

// Get authentication headers with token
export const getAuthHeaders = (): HeadersInit => {
  // Use localStorage only on client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  return {
    "Content-Type": "application/json",
  }
}

// Fetch with authentication
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: "include", // Always include credentials for cookies
    headers: getAuthHeaders(),
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  }

  try {
    const response = await fetch(url, mergedOptions)

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      // Clear stored tokens if unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("refreshToken")
      }

      // Redirect to login if needed
      // window.location.href = "/login";
    }

    return response
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

// Login function
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()

      // Store tokens securely
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("authToken", data.token)
      }

      if (data.refreshToken && typeof window !== "undefined") {
        localStorage.setItem("refreshToken", data.refreshToken)
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

// Logout function
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint to invalidate server-side session
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
    })
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Clear local storage tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
    }
  }
}

// Refresh token function
export const refreshAuthToken = async (): Promise<boolean> => {
  // Only run on client side
  if (typeof window === "undefined") {
    return false
  }

  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()

      if (data.token) {
        localStorage.setItem("authToken", data.token)
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Token refresh error:", error)
    return false
  }
}

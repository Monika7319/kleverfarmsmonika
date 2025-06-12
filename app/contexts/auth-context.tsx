"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
}

interface AuthContextType {
  customer: Customer | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<Customer>) => Promise<void>
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("customer_token")
    if (storedToken) {
      setToken(storedToken)
      fetchProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCustomer(data.customer)
        }
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("customer_token")
        setToken(null)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      localStorage.removeItem("customer_token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/customer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    if (data.success) {
      setToken(data.token)
      setCustomer(data.customer)
      localStorage.setItem("customer_token", data.token)
    } else {
      throw new Error(data.message || "Login failed")
    }
  }

  const register = async (registerData: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/api/customer/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(registerData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Registration failed")
    }

    if (data.success) {
      setToken(data.token)
      setCustomer(data.customer)
      localStorage.setItem("customer_token", data.token)
    } else {
      throw new Error(data.message || "Registration failed")
    }
  }

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/customer/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    setCustomer(null)
    setToken(null)
    localStorage.removeItem("customer_token")
  }

  const updateProfile = async (profileData: Partial<Customer>) => {
    if (!token) throw new Error("Not authenticated")

    const response = await fetch(`${API_BASE_URL}/api/customer/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed")
    }

    if (data.success) {
      setCustomer(data.customer)
    } else {
      throw new Error(data.message || "Profile update failed")
    }
  }

  const value = {
    customer,
    token,
    login,
    register,
    logout,
    updateProfile,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

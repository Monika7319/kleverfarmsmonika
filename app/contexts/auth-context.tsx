"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
}

interface UpdateProfileData {
  name: string
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          localStorage.removeItem("auth_token")
          setToken(null)
        }
      } else {
        localStorage.removeItem("auth_token")
        setToken(null)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      localStorage.removeItem("auth_token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("auth_token", data.token)
  }

  const register = async (registerData: RegisterData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Registration failed")
    }

    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("auth_token", data.token)
  }

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
  }

  const updateProfile = async (profileData: UpdateProfileData) => {
    if (!token) throw new Error("Not authenticated")

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed")
    }

    setUser(data.user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as authLogin, logout as authLogout, refreshAuthToken, isTokenExpired } from "@/lib/auth"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return

    // Refresh token every 15 minutes
    const refreshInterval = setInterval(
      async () => {
        const token = localStorage.getItem("authToken")

        if (token && isTokenExpired(token)) {
          const success = await refreshAuthToken()
          if (!success) {
            setUser(null)
          }
        }
      },
      15 * 60 * 1000,
    ) // 15 minutes

    return () => clearInterval(refreshInterval)
  }, [user])

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Skip on server side
      if (typeof window === "undefined") {
        return false
      }

      const token = localStorage.getItem("authToken")

      if (!token) {
        setUser(null)
        return false
      }

      if (isTokenExpired(token)) {
        const refreshed = await refreshAuthToken()
        if (!refreshed) {
          setUser(null)
          return false
        }
      }

      // Fetch user data
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await authLogin(email, password)

      if (success) {
        await checkAuth() // Fetch user data after successful login
        return true
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authLogout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

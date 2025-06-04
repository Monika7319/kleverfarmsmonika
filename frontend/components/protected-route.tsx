"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication check is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/")
      return
    }

    // If roles are specified and user doesn't have the required role
    if (!isLoading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/")
      return
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // If not authenticated or doesn't have the required role, don't render children
  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null
  }

  // If authenticated and has the required role, render children
  return <>{children}</>
}

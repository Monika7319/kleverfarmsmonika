"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"
import { Loader2 } from "lucide-react"
import DashboardNav from "./components/dashboard-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  )
}

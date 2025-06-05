import type React from "react"
import type { Metadata } from "next"
import FarmerSidebar from "@/components/farmer/farmer-sidebar"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Farmer Dashboard - KleverFarms",
  description: "Manage your farm, products, orders, and customers",
}

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <FarmerSidebar />
      <div className="md:pl-64">
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

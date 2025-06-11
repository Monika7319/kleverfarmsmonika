import type React from "react"
import type { Metadata } from "next"
import FarmerSidebar from "@/components/farmer/farmer-sidebar"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Farmer Dashboard - KleverFarms",
  description: "Manage your farm, products, orders, and customers",
}

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <FarmerSidebar />
        <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

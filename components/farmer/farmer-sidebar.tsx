"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Package, Settings, Menu, LogOut, ArrowLeft, Tractor } from "lucide-react"
import { authHeaders, API_BASE_URL } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/farmer-dashboard",
    icon: Home,
  },
  {
    name: "Farm Profile",
    href: "/farmer-dashboard/profile",
    icon: Tractor,
  },
  {
    name: "Products",
    href: "/farmer-dashboard/products",
    icon: Package,
  },
  {
    name: "Settings",
    href: "/farmer-dashboard/settings",
    icon: Settings,
  },
]

interface UserData {
  id: number
  name: string
  email: string
  farm?: {
    name: string
  }
}

export default function FarmerSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farmer/dashboard`, {
        headers: authHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserData({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            farm: data.farm,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("farm_token")
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/farmer-dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <Tractor className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">KleverFarms</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-green-100 text-green-900" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Back to Home & Sign Out */}
      <div className="border-t p-4 space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>{userData ? getInitials(userData.name) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium truncate">{loading ? "Loading..." : userData?.name || "User"}</span>
            <span className="text-xs text-muted-foreground truncate">{loading ? "" : userData?.email || ""}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-white">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}

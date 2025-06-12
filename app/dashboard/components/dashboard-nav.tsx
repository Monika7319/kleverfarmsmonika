"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    {
      title: "Profile",
      href: "/dashboard",
      icon: User,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Wishlist",
      href: "/dashboard/wishlist",
      icon: Heart,
    },
  ]

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            KleverFarms
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block text-sm font-medium mr-2">Hello, {user?.name?.split(" ")[0]}</span>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      <div className="md:hidden border-t">
        <nav className="flex justify-between px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 text-xs font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

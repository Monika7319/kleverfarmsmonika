"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Store, Package, ShoppingCart, Users, BarChart, ImageIcon, Settings, Menu, Home, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/farmer/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Farm Profile",
    href: "/farmer/profile",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/farmer/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/farmer/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  // {
  //   title: "Customers",
  //   href: "/farmer/customers",
  //   icon: <Users className="h-5 w-5" />,
  // },
  // {
  //   title: "Analytics",
  //   href: "/farmer/analytics",
  //   icon: <BarChart className="h-5 w-5" />,
  // },
  // {
  //   title: "Media Gallery",
  //   href: "/farmer/media",
  //   icon: <ImageIcon className="h-5 w-5" />,
  // },
  {
    title: "Settings",
    href: "/farmer/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function FarmerSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-gray-100/40 md:block">
        <DesktopSidebar pathname={pathname} />
      </div>
    </>
  )
}

function MobileSidebar({ pathname, setOpen }: { pathname: string; setOpen: (open: boolean) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <Link href="/" onClick={() => setOpen(false)}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">KleverFarms</span>
          </div>
        </Link>
      </div>
      <ScrollArea className="flex-1 p-4">
        <nav className="grid gap-2 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === item.href && "bg-gray-100 text-gray-900 font-medium",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="grid gap-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(false)}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full w-64 flex-col">
      <div className="p-6 border-b">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">KleverFarms</span>
          </div>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-6">
        <nav className="grid gap-2 px-4 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                pathname === item.href && "bg-gray-100 text-gray-900 font-medium",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-6 border-t">
        <div className="grid gap-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

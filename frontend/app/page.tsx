"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const logout = async () => {
    await signOut()
  }

  const loginWithGithub = async () => {
    await signIn("github")
  }

  return (
    <div className="container py-12">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Acme
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/user-dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsLoginModalOpen(true)} variant="ghost" size="sm">
            Login
          </Button>
        )}
      </header>

      <main className="py-12">
        <h1 className="text-4xl font-bold">Welcome to Acme</h1>
        <p className="text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim
          sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultricies diam. Maecenas ligula massa, varius
          a, semper congue, euismod non, mi.
        </p>
      </main>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Choose your preferred login method.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Username
              </Label>
              <Input id="name" value="shadcn" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Password
              </Label>
              <Input id="username" value="shadcn" className="col-span-3" />
            </div>
          </div>
          <Button onClick={loginWithGithub} variant="outline">
            Login with Github
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

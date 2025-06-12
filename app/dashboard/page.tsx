"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input id="name" name="name" className="pl-10" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input id="email" name="email" className="pl-10" value={user?.email} disabled />
              </div>
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input id="phone" name="phone" className="pl-10" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                <Textarea
                  id="address"
                  name="address"
                  className="pl-10 min-h-[100px]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

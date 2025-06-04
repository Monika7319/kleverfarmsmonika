"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile settings have been updated successfully.",
      })
    }, 1000)
  }
  
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been updated successfully.",
      })
    }, 1000)
  }
  
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and farm details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Farmer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john@kleverfarms.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farm-name">Farm Name</Label>
                    <Input id="farm-name" defaultValue="Green Valley Organics" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Farm Description</Label>
                  <Textarea 
                    id="bio" 
                    rows={4}
                    defaultValue="We are a family-owned organic farm specializing in heirloom vegetables and free-range eggs. Our farming practices focus on sustainability and biodiversity."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Farm Address</Label>
                  <Textarea 
                    id="address" 
                    rows={2}
                    defaultValue="123 Rural Road, Farmington, CA 95432"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveNotifications}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive order updates and important announcements via email
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive order updates and important announcements via SMS
                      </p>
                    </div>
                    <Switch id="sms-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional content and special offers
                      </p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when customers place new orders
                      </p>
                    </div>
                    <Switch id="order-updates" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security options.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSecurity}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button">
                  Reset Password
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Update Security"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

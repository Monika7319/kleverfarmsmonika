"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Klever Farms",
    siteDescription: "A marketplace connecting local farmers with customers seeking fresh, sustainable produce.",
    contactEmail: "support@kleverfarms.com",
    contactPhone: "555-123-4567",
    address: "123 Farm Lane, Portland, OR 97201",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderConfirmations: true,
    farmApprovals: true,
    lowStockAlerts: true,
    newMessages: true,
    marketingEmails: false,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD",
    taxRate: "8.5",
    paymentMethods: ["credit_card", "paypal"],
    minimumOrderAmount: "20",
    shippingFee: "5.99",
    freeShippingThreshold: "50",
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (setting: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: checked }))
  }

  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodToggle = (method: string) => {
    setPaymentSettings((prev) => {
      const methods = [...prev.paymentMethods]
      if (methods.includes(method)) {
        return { ...prev, paymentMethods: methods.filter((m) => m !== method) }
      } else {
        return { ...prev, paymentMethods: [...methods, method] }
      }
    })
  }

  const handleCurrencyChange = (value: string) => {
    setPaymentSettings((prev) => ({ ...prev, currency: value }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    toast.success("Settings saved successfully")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment & Shipping</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  rows={2}
                />
              </div>

              <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Enable or disable all email notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Confirmations</h3>
                    <p className="text-sm text-gray-500">Receive notifications for new orders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderConfirmations}
                    onCheckedChange={(checked) => handleNotificationToggle("orderConfirmations", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Farm Approvals</h3>
                    <p className="text-sm text-gray-500">Receive notifications for new farm registrations</p>
                  </div>
                  <Switch
                    checked={notificationSettings.farmApprovals}
                    onCheckedChange={(checked) => handleNotificationToggle("farmApprovals", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-500">Receive notifications when products are running low</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => handleNotificationToggle("lowStockAlerts", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Messages</h3>
                    <p className="text-sm text-gray-500">Receive notifications for new customer messages</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newMessages}
                    onCheckedChange={(checked) => handleNotificationToggle("newMessages", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationToggle("marketingEmails", checked)}
                    disabled={!notificationSettings.emailNotifications}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment & Shipping Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={paymentSettings.currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    value={paymentSettings.taxRate}
                    onChange={handlePaymentSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={paymentSettings.paymentMethods.includes("credit_card")}
                      onCheckedChange={() => handlePaymentMethodToggle("credit_card")}
                    />
                    <Label>Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={paymentSettings.paymentMethods.includes("paypal")}
                      onCheckedChange={() => handlePaymentMethodToggle("paypal")}
                    />
                    <Label>PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={paymentSettings.paymentMethods.includes("apple_pay")}
                      onCheckedChange={() => handlePaymentMethodToggle("apple_pay")}
                    />
                    <Label>Apple Pay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={paymentSettings.paymentMethods.includes("google_pay")}
                      onCheckedChange={() => handlePaymentMethodToggle("google_pay")}
                    />
                    <Label>Google Pay</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      id="minimumOrderAmount"
                      name="minimumOrderAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={paymentSettings.minimumOrderAmount}
                      onChange={handlePaymentSettingsChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Standard Shipping Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      id="shippingFee"
                      name="shippingFee"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={paymentSettings.shippingFee}
                      onChange={handlePaymentSettingsChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      id="freeShippingThreshold"
                      name="freeShippingThreshold"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={paymentSettings.freeShippingThreshold}
                      onChange={handlePaymentSettingsChange}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

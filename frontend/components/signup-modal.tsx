"use client"

import type React from "react"

import { useState } from "react"
import { X, User, Mail, Lock, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"

interface SignupModalProps {
  onClose: () => void
  onLogin: () => void
  showBackButton?: boolean
  onBack?: () => void
}

export default function SignupModal({ onClose, onLogin, showBackButton = false, onBack }: SignupModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))

    if (errors.agreeTerms) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeTerms
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would send this data to your backend
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const { fullName, email, password, phone } = formData

      const response = await signUp(email, password, fullName, phone)

      if (response?.error) {
        toast({
          title: "Registration failed",
          description: response.error,
          variant: "destructive",
        })
        return
      }

      // Show success toast
      toast({
        title: "Account created successfully!",
        description: "Welcome to KleverFarms. You can now log in with your credentials.",
        variant: "default",
      })

      onClose()
      // Optionally redirect to login
      onLogin()
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced signup form with new user encouragement
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-md z-50 hover:bg-gray-100 transition-all duration-150 transform hover:scale-110"
          aria-label="Close signup modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5">
          <h2 className="text-xl font-bold mb-1 text-center text-gray-900">Create Your Account</h2>
          <p className="text-center text-gray-600 mb-4 text-sm">
            Join KleverFarms to get fresh farm produce delivered to your doorstep
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-sm">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  className={`pl-9 h-9 text-sm ${errors.fullName ? "border-red-500" : ""}`}
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-0.5">{errors.fullName}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-9 h-9 text-sm ${errors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className={`pl-9 h-9 text-sm ${errors.phone ? "border-red-500" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className={`pl-9 h-9 text-sm ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`pl-9 h-9 text-sm ${errors.confirmPassword ? "border-red-500" : ""}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
              <label
                htmlFor="agreeTerms"
                className={`text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.agreeTerms ? "text-red-500" : ""}`}
              >
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-10 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <button className="text-green-600 hover:underline font-medium" onClick={onLogin}>
                Login
              </button>
            </p>

            {showBackButton && onBack && (
              <button
                className="mt-2 text-gray-500 hover:text-gray-700 text-xs flex items-center justify-center mx-auto"
                onClick={onBack}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to options
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex items-center justify-center gap-1 h-8 text-xs">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-1 h-8 text-xs">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

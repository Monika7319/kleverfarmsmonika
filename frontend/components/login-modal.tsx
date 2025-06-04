"use client"

import type React from "react"

import { useState } from "react"
import { X, User, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-context"
import SignupModal from "@/components/signup-modal"

interface LoginModalProps {
  onClose: () => void
  onSignup: () => void
}

export default function LoginModal({ onClose, onSignup }: LoginModalProps) {
  const [step, setStep] = useState<"initial" | "login" | "signup">("initial")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { toast } = useToast()
  const { login } = useAuth()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // In a real app, you would make an API call to authenticate
      const success = await login(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to KleverFarms!",
          variant: "success",
        })
        onClose()
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial screen asking if user is new or existing
  if (step === "initial") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <div className="text-center mb-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ea323b94-04a7-4943-863c-ae675d5817c1.jpg-aFmJJgd9kRatcFlDgmHoSy88oViPtK.jpeg"
                alt="KleverFarms Logo"
                className="h-16 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">Welcome to KleverFarms</h2>
              <p className="text-gray-600 mt-1">Fresh produce delivered to your doorstep</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setStep("login")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <User className="h-5 w-5" />
                <span>I already have an account</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>

              <Button
                onClick={() => setStep("signup")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="h-5 w-5" />
                <span>I'm new to KleverFarms</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login form for existing users
  if (step === "login") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-1">Sign in to your KleverFarms account</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <a href="#" className="text-sm text-green-600 hover:text-green-500">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button onClick={() => setStep("signup")} className="text-green-600 hover:text-green-500 font-medium">
                  Create an account
                </button>
              </p>
              <button className="mt-2 text-gray-500 hover:text-gray-700 text-xs" onClick={() => setStep("initial")}>
                ← Back to options
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For signup, we'll use the existing SignupModal component but with a back button
  if (step === "signup") {
    return (
      <SignupModal
        onClose={onClose}
        onLogin={() => setStep("login")}
        showBackButton
        onBack={() => setStep("initial")}
      />
    )
  }

  return null
}

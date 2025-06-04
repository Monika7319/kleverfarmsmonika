"\"use client"

// This is a simplified version of the toast hook
// In a real app, you might want to use a library like react-hot-toast or react-toastify

import { useState } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  createdAt?: number
}

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default", duration = 5000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, createdAt: Date.now() }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto dismiss
    setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    dismissToast,
    toasts,
  }
}

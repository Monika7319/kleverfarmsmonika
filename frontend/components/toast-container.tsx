"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useEffect } from "react"

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      toasts.forEach((toast) => {
        if (toast.createdAt && Date.now() - toast.createdAt > 5000) {
          dismissToast(toast.id)
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [toasts, dismissToast])

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} {...props} variant={variant} className="group">
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

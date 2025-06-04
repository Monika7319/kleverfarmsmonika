"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-xs">{children}</div>
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border border-green-200 bg-green-50 text-green-800 group",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, variant, onClose, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex-1">{props.children}</div>
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 rounded-md p-1 text-gray-500 hover:text-gray-900">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn("font-medium text-sm", className)} {...props} />,
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-xs opacity-90", className)} {...props} />,
)
ToastDescription.displayName = "ToastDescription"

export { ToastProvider, Toast, ToastTitle, ToastDescription }

"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import type { Product } from "../page"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Product>) => void
  initialData?: Product | null
  title: string
  description: string
}

export function ProductModal({ isOpen, onClose, onSubmit, initialData, title, description }: ProductModalProps) {
  const handleSubmit = async (data: Partial<Product>) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ProductForm initialData={initialData} onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}

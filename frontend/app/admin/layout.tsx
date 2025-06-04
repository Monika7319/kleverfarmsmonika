import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AdminLayout({ children }: { children: ReactNode }) {
  // For now, we're removing the ProtectedRoute to ensure the admin pages are accessible
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {children}
        <ToastContainer position="bottom-right" />
      </main>
    </div>
  )
}

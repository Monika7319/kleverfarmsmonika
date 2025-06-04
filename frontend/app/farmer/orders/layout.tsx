import { ReactNode } from "react";

interface OrdersLayoutProps {
  children: ReactNode;
}

export default function OrdersLayout({ children }: OrdersLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500">Manage and track your customer orders</p>
        </div>
        <div className="border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

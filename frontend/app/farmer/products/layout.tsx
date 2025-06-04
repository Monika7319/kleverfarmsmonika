import { ReactNode } from "react";

interface ProductsLayoutProps {
  children: ReactNode;
}

export default function ProductsLayout({ children }: ProductsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your farm's products, inventory, and pricing</p>
        </div>
        <div className="border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

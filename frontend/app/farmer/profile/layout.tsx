import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Farm Profile</h1>
          <p className="text-gray-500">Manage your farm's information and settings</p>
        </div>
        <div className="border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}

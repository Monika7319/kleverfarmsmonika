"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import "./toggle.css";

// Rest of the file remains the same as above

export default function FarmProfilePage() {
  const [farmData, setFarmData] = useState({
    name: "Madhura Organic Farm",
    ownerName: "Dr. Madhura Joshi",
    description: "We are a family-owned organic farm specializing in dairy products, vegetables, and fruits. Our farm follows sustainable farming practices and is certified organic.",
    address: "123 Rural Road, Pune, Maharashtra 411001",
    phone: "+91 98765 43210",
    email: "info@madhuraorganicfarm.com",
    website: "www.madhuraorganicfarm.com",
    established: "2015",
    size: "25",
    certifications: "Organic, Non-GMO",
    specialties: "Dairy products, Seasonal vegetables, Fruits",
    deliveryOptions: "Farm pickup, Local delivery, Shipping",
    paymentOptions: "Cash, UPI, Credit/Debit Cards, Bank Transfer"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the form data to your API
    setIsEditing(false);
    alert("Farm profile updated successfully!");
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Farm Profile Card */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold">Farm Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Farm Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={farmData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ownerName" className="text-sm font-medium">
                        Owner Name
                      </label>
                      <input
                        id="ownerName"
                        name="ownerName"
                        value={farmData.ownerName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={farmData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={farmData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={farmData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={farmData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">
                        Website
                      </label>
                      <input
                        id="website"
                        name="website"
                        value={farmData.website}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="established" className="text-sm font-medium">
                        Established Year
                      </label>
                      <input
                        id="established"
                        name="established"
                        value={farmData.established}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="size" className="text-sm font-medium">
                        Farm Size (acres)
                      </label>
                      <input
                        id="size"
                        name="size"
                        type="number"
                        value={farmData.size}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="certifications" className="text-sm font-medium">
                        Certifications
                      </label>
                      <input
                        id="certifications"
                        name="certifications"
                        value={farmData.certifications}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="specialties" className="text-sm font-medium">
                      Specialties
                    </label>
                    <input
                      id="specialties"
                      name="specialties"
                      value={farmData.specialties}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="deliveryOptions" className="text-sm font-medium">
                      Delivery Options
                    </label>
                    <input
                      id="deliveryOptions"
                      name="deliveryOptions"
                      value={farmData.deliveryOptions}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="paymentOptions" className="text-sm font-medium">
                      Payment Options
                    </label>
                    <input
                      id="paymentOptions"
                      name="paymentOptions"
                      value={farmData.paymentOptions}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Farm Name</h4>
                      <p>{farmData.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Owner Name</h4>
                      <p>{farmData.ownerName}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p>{farmData.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p>{farmData.address}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p>{farmData.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p>{farmData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Website</h4>
                      <p>{farmData.website}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Established</h4>
                      <p>{farmData.established}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Farm Size</h4>
                      <p>{farmData.size} acres</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Certifications</h4>
                      <p>{farmData.certifications}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Specialties</h4>
                    <p>{farmData.specialties}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Delivery Options</h4>
                    <p>{farmData.deliveryOptions}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Options</h4>
                    <p>{farmData.paymentOptions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Farm Settings Card */}
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Farm Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-500">Make your farm visible to customers</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-public"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle-public"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="absolute left-0 inline-block w-6 h-6 transform translate-x-0 bg-white rounded-full transition-transform duration-200 ease-in-out" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Accept Orders</h4>
                    <p className="text-sm text-gray-500">Allow customers to place orders</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-orders"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle-orders"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="absolute left-0 inline-block w-6 h-6 transform translate-x-0 bg-white rounded-full transition-transform duration-200 ease-in-out" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive email alerts for new orders</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-email"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle-email"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="absolute left-0 inline-block w-6 h-6 transform translate-x-0 bg-white rounded-full transition-transform duration-200 ease-in-out" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive SMS alerts for new orders</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-sms"
                      className="sr-only"
                    />
                    <label
                      htmlFor="toggle-sms"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="absolute left-0 inline-block w-6 h-6 transform translate-x-0 bg-white rounded-full transition-transform duration-200 ease-in-out" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">Account Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-left">
                    Change Password
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-left">
                    Export Farm Data
                  </button>
                  <button className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-md text-sm text-left">
                    Deactivate Farm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";


interface FarmRegistrationProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FarmRegistration({
  onClose,
  onSuccess,
}: FarmRegistrationProps) {
  // State for toggling between Login and Registration views:
  const [showFarmerLogin, setShowFarmerLogin] = useState<boolean>(false);
  

  // State for the multi‐step farm registration form:
  
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<{
    farmName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    farmSize: string;
    farmType: string;
    description: string;
    farmingMethods: string[];
    specialties: string[];
    images: File[];
    acceptTerms: boolean;
    latitude: string;
    longitude: string;
  }>({
    farmName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    farmSize: "",
    farmType: "",
    description: "",
    farmingMethods: [],
    specialties: [],
    images: [],
    acceptTerms: false,
    latitude: "",
    longitude: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Login‐specific state:
  const [emailLogin, setEmailLogin] = useState<string>("");
  const [passwordLogin, setPasswordLogin] = useState<string>("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  // Only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Attempt to grab geolocation on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
      },
      (err) => console.warn("Geo error:", err)
    );
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    if (onSuccess) onSuccess();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleArrayItemChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    const current = formData[field as keyof typeof formData] as string[];
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...current, value] : current.filter((v) => v !== value),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const combined = [...formData.images, ...selectedFiles];
    const limited = combined.slice(0, 5);
    setFormData((prev) => ({
      ...prev,
      images: limited,
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value) && key === "images") {
        (value as File[]).forEach((file) => payload.append("images[]", file));
      } else if (Array.isArray(value)) {
        value.forEach((v) => payload.append(`${key}[]`, v));
      } else if (typeof value === "boolean") {
        payload.append(key, value ? "1" : "0");
      } else {
        payload.append(key, value);
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/farms`, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        alert("❌ Error: " + (data.message || JSON.stringify(data.errors)));
        return;
      }

      alert("✅ Registered successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit farm registration.");
    }
  };
  const router = useRouter();

    const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { email: emailLogin, password: passwordLogin };
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/farmer/login`,
        payload
      );

      // Save token + farm info, then redirect
      localStorage.setItem("farm_token", response.data.token);
      localStorage.setItem("farm_info", JSON.stringify(response.data.farm));
      router.push("/farmer-dashboard/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };
  

  if (!isClient) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-150 transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            {showFarmerLogin ? (
              // ---------- FARMER LOGIN VIEW ----------
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                  Farmer Login
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Access your farm dashboard to manage products, orders, and more
                </p>

                <form
                  onSubmit={handleFarmerLogin}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div className="space-y-2">
                    <Label htmlFor="farmerEmail">Email Address</Label>
                    <Input
                      id="farmerEmail"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmerPassword">Password</Label>
                    <Input
                      id="farmerPassword"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rememberMe" />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-green-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Login to Dashboard
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don’t have a farm account yet?{" "}
                        <button
                          type="button"
                          className="text-green-600 hover:underline font-medium"
                          onClick={() => setShowFarmerLogin(false)}
                        >
                          Register your farm
                        </button>
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Demo credentials:</strong> farmer@example.com / password
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              // ---------- FARM REGISTRATION VIEW ----------
              <>
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
                  List Your Farm Today
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  Join KleverFarms ecosystem and connect directly with customers to
                  sell your farm produce
                </p>

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    Already have a farm account?{" "}
                    <button
                      className="text-green-600 hover:underline font-medium"
                      onClick={() => setShowFarmerLogin(true)}
                    >
                      Login to Farmer Dashboard
                    </button>
                  </p>
                </div>
                <div className="text-center mb-6">
                  <Button
                    type="button"
                    onClick={() => (window.location.href = "/farmer/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Go to Farm Dashboard
                  </Button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-8 px-8">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <span className="text-xs mt-1">Account</span>
                  </div>
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step >= 2 ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <span className="text-xs mt-1">Farm Details</span>
                  </div>
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step >= 3 ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      3
                    </div>
                    <span className="text-xs mt-1">Farm Images</span>
                  </div>
                </div>

                <form onSubmit={handleRegistrationSubmit}>
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="farmName">Farm Name</Label>
                          <Input
                            id="farmName"
                            name="farmName"
                            placeholder="Enter your farm name"
                            value={formData.farmName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownerName">Owner Name</Label>
                          <Input
                            id="ownerName"
                            name="ownerName"
                            placeholder="Enter owner’s full name"
                            value={formData.ownerName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Farm Address</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Enter farm address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input
                            id="zip"
                            name="zip"
                            placeholder="ZIP Code"
                            value={formData.zip}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="farmSize">Farm Size (acres)</Label>
                          <Input
                            id="farmSize"
                            name="farmSize"
                            type="number"
                            placeholder="Enter farm size in acres"
                            value={formData.farmSize}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="farmType">Farm Type</Label>
                          <Select
                            value={formData.farmType}
                            onValueChange={(val) =>
                              handleSelectChange("farmType", val)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select farm type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="organic">Organic Farm</SelectItem>
                              <SelectItem value="conventional">
                                Conventional Farm
                              </SelectItem>
                              <SelectItem value="hydroponic">Hydroponic Farm</SelectItem>
                              <SelectItem value="livestock">Livestock Farm</SelectItem>
                              <SelectItem value="dairy">Dairy Farm</SelectItem>
                              <SelectItem value="mixed">Mixed Farm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Farm Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Tell us about your farm, its history, and what makes it special..."
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Farming Methods (select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {[
                            "Organic",
                            "Conventional",
                            "No-till",
                            "Regenerative",
                            "Biodynamic",
                            "Permaculture",
                            "Hydroponic",
                            "Aquaponic",
                            "Integrated pest management",
                            "Crop rotation",
                          ].map((method) => (
                            <div
                              key={`method-${method}`}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`method-${method}`}
                                checked={formData.farmingMethods.includes(method)}
                                onCheckedChange={(checked) =>
                                  handleArrayItemChange(
                                    "farmingMethods",
                                    method,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={`method-${method}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {method}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Farm Specialties (select all that apply)</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {[
                            "Fruits",
                            "Vegetables",
                            "Dairy",
                            "Meat",
                            "Poultry",
                            "Eggs",
                            "Herbs",
                            "Honey",
                            "Flowers",
                            "Grains",
                            "Nuts",
                            "Berries",
                          ].map((specialty) => (
                            <div
                              key={`specialty-${specialty}`}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`specialty-${specialty}`}
                                checked={formData.specialties.includes(specialty)}
                                onCheckedChange={(checked) =>
                                  handleArrayItemChange(
                                    "specialties",
                                    specialty,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={`specialty-${specialty}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {specialty}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Farm Images (up to 5)</Label>
                        <p className="text-sm text-gray-600">
                          Upload high-quality images of your farm, produce, and facilities
                          to attract customers.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mt-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Farm image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          {formData.images.length < 5 && (
                            <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:border-green-500 transition-colors">
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-6">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("acceptTerms", checked as boolean)
                          }
                          required
                        />
                        <label
                          htmlFor="acceptTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <a href="#" className="text-green-600 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-green-600 hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    ) : (
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                    )}

                    {step < 3 ? (
                      <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={nextStep}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!formData.acceptTerms}
                      >
                        Complete Registration
                      </Button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your farm is under review. We will reach out to you soon.
            </p>
            <Button
              onClick={handleSuccessClose}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

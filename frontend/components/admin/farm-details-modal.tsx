"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Mail, Phone, MapPin, Award, Trash } from "lucide-react";
import Image from "next/image";
import TiptapEditor from "@/components/TiptapEditor";
import { toast } from "@/components/ui/use-toast";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const FARMING_METHOD_OPTIONS = [
  "Organic", "Conventional", "No-till", "Regenerative", "Biodynamic",
  "Permaculture", "Hydroponic", "Aquaponic", "Integrated pest management", "Crop rotation"
];

const SPECIALTIES_OPTIONS = [
  "Fruits", "Vegetables", "Dairy", "Meat", "Poultry", "Eggs",
  "Herbs", "Honey", "Flowers", "Grains", "Nuts", "Berries"
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function FarmDetailsModal({ farmId, isOpen, onClose, onStatusChange }) {
  const [farm, setFarm] = useState(null);
  const [editedFarm, setEditedFarm] = useState(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
const [updating, setUpdating] = useState(false);

    const [editMode, setEditMode] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (!isOpen || !farmId) return;
  
    const fetchFarmDetails = async () => {
      const farmRes = await fetch(`${API_BASE_URL}/api/farms/${farmId}`);
      const commentRes = await fetch(`${API_BASE_URL}/api/farm-comments/${farmId}`);
  
      if (farmRes.ok) {
        const farmData = await farmRes.json();
        const f = farmData.farm;
        f.images = typeof f.images === "string" ? JSON.parse(f.images) : f.images;
        f.farmingMethods = typeof f.farmingMethods === "string" ? JSON.parse(f.farmingMethods) : f.farmingMethods;
        f.specialties = typeof f.specialties === "string" ? JSON.parse(f.specialties) : f.specialties;
        setFarm(f);
        setEditedFarm({ ...f });
      }
  
      if (commentRes.ok) {
        const commentData = await commentRes.json();
        const latestComment = commentData.comments?.[0]?.comment || "";
        setComment(latestComment);
      }
    };
  
    fetchFarmDetails();
  }, [farmId, isOpen]);
  

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved": return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected": return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return null;
    }
  };

  const handleSaveComment = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/farm-comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ farm_id: farm.id, comment }),
      });

      if (!res.ok) throw new Error(await res.text());
      await res.json();
      toast({ title: "Saved", description: "Comment saved successfully!" });
      setComment("");
    } catch (err) {
      toast({ title: "Error", description: err.message || "Could not save comment.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImageFile(file);
  };

  const removeImage = (index) => {
    const updated = [...editedFarm.images];
    updated.splice(index, 1);
    setEditedFarm({ ...editedFarm, images: updated });
  };

  const renderCheckboxGroup = (label, field, options) => (
    <div className="mt-4">
      <p className="font-medium">{label}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editedFarm[field].includes(item)}
              onChange={() => {
                const exists = editedFarm[field].includes(item);
                const updated = exists
                  ? editedFarm[field].filter((i) => i !== item)
                  : [...editedFarm[field], item];
                setEditedFarm({ ...editedFarm, [field]: updated });
              }}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  const handleSaveChanges = async () => {
    setUpdating(true); 
  const formData = new FormData();

  // Laravel expects _method when using POST as PATCH
  formData.append("_method", "PATCH");

  for (const key of ["farmName", "email", "phone", "address", "city", "state", "zip", "description"]) {
    formData.append(key, editedFarm[key] || "");
  }

  formData.append("is_verified", editedFarm.is_verified || 0);
  formData.append("admin_comment", comment);

  editedFarm.farmingMethods.forEach((val, i) => formData.append(`farmingMethods[${i}]`, val));
  editedFarm.specialties.forEach((val, i) => formData.append(`specialties[${i}]`, val));
  editedFarm.images.forEach((img, i) => formData.append(`images[${i}]`, img));
  if (newImageFile) formData.append("image_files[]", newImageFile);

  try {
    const res = await fetch(`${API_BASE_URL}/api/farms/${farm.id}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const updatedFarm = data.farm;

    updatedFarm.images = typeof updatedFarm.images === "string" ? JSON.parse(updatedFarm.images) : updatedFarm.images;
    updatedFarm.farmingMethods = typeof updatedFarm.farmingMethods === "string" ? JSON.parse(updatedFarm.farmingMethods) : updatedFarm.farmingMethods;
    updatedFarm.specialties = typeof updatedFarm.specialties === "string" ? JSON.parse(updatedFarm.specialties) : updatedFarm.specialties;

    setFarm(updatedFarm);
    setEditedFarm(updatedFarm);
    setNewImageFile(null);
    setEditMode(false);
    toast({ title: "Updated", description: "Farm updated successfully" });
  } catch (err) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  } finally {
    setUpdating(false); // ✅ hide loading
  }
};
  
  if (!isOpen || !farm || !editedFarm) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            {editMode ? (
              <input
                className="text-xl font-bold w-full border px-2 py-1 rounded"
                value={editedFarm.farmName}
                onChange={(e) => setEditedFarm({ ...editedFarm, farmName: e.target.value })}
              />
            ) : (
              <span>{farm.farmName}</span>
            )}
            {getStatusBadge(farm.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="text-right mb-2">
          <Button size="sm" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel Edit" : "Edit"}
          </Button>
        </div>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Farm Details</TabsTrigger>
            <TabsTrigger value="documents">Documents & Images</TabsTrigger>
            <TabsTrigger value="comment">Klever Comment</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Farm Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      {editMode ? (
                        <div className="space-y-1">
                          <input type="text" className="input" value={editedFarm.address} onChange={(e) => setEditedFarm({ ...editedFarm, address: e.target.value })} placeholder="Address" />
                          <input type="text" className="input" value={editedFarm.city} onChange={(e) => setEditedFarm({ ...editedFarm, city: e.target.value })} placeholder="City" />
                          <input type="text" className="input" value={editedFarm.state} onChange={(e) => setEditedFarm({ ...editedFarm, state: e.target.value })} placeholder="State" />
                          <input type="text" className="input" value={editedFarm.zip} onChange={(e) => setEditedFarm({ ...editedFarm, zip: e.target.value })} placeholder="Zip" />
                        </div>
                      ) : (
                        <p className="text-gray-600">{farm.address}, {farm.city}, {farm.state} - {farm.zip}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      {editMode ? (
                        <input type="email" className="input" value={editedFarm.email} onChange={(e) => setEditedFarm({ ...editedFarm, email: e.target.value })} />
                      ) : (
                        <p className="text-gray-600">{farm.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      {editMode ? (
                        <input type="text" className="input" value={editedFarm.phone} onChange={(e) => setEditedFarm({ ...editedFarm, phone: e.target.value })} />
                      ) : (
                        <p className="text-gray-600">{farm.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Products & Certifications</h3>
                <div className="space-y-3">
                  {editMode ? (
                    <>
                      {renderCheckboxGroup("Specialties", "specialties", SPECIALTIES_OPTIONS)}
                      {renderCheckboxGroup("Farming Methods", "farmingMethods", FARMING_METHOD_OPTIONS)}
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">Specialties</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {farm.specialties.map((item, index) => (
                            <Badge key={index} variant="secondary">{item}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Farming Methods</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {farm.farmingMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              {editMode ? (
                <textarea className="w-full border rounded px-2 py-1" value={editedFarm.description} onChange={(e) => setEditedFarm({ ...editedFarm, description: e.target.value })} />
              ) : (
                <p className="text-gray-700">{farm.description}</p>
              )}
            </div>

            {farm.status === "pending" && !editMode && (
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onStatusChange("approved")}> <CheckCircle className="mr-2 h-4 w-4" /> Approve Farm </Button>
                <Button variant="destructive" className="flex-1" onClick={() => onStatusChange("rejected")}> <XCircle className="mr-2 h-4 w-4" /> Reject Farm </Button>
              </div>
            )}

           
          </TabsContent>
           {editMode && (
               <div className="flex justify-end pt-4 border-t mt-6">
               <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveChanges}>Save Changes</Button>
             </div>
            )}

          <TabsContent value="documents" className="pt-4">
            <h3 className="font-semibold text-lg mb-4">Farm Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editedFarm.images.map((image, index) => (
                <div key={index} className="border rounded-md overflow-hidden relative">
                  <div className="relative h-48 w-full">
                    <Image src={`${API_BASE_URL}/farms/images/${image}`} alt={`Image ${index + 1}`} fill className="object-cover" />
                  </div>
                  {editMode && (
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white" onClick={() => removeImage(index)}>
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                  <div className="p-2 bg-gray-50">
                    <p className="text-sm text-gray-600">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
            {editMode && (
              <div className="mt-4">
                <input type="file" accept="image/*" onChange={handleImageFileChange} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="comment" className="pt-4">
            <h3 className="font-semibold text-lg mb-4">Klever Admin Comment</h3>
            <div className="mb-4">
              <TiptapEditor value={comment} onChange={setComment} />
            </div>
            <Button onClick={handleSaveComment} disabled={saving} className="bg-primary text-white">
              {saving ? "Saving..." : "Save Comment"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

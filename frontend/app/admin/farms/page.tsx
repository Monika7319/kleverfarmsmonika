"use client";

import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react";
import FarmDetailsModal from "@/components/admin/farm-details-modal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

interface Farm {
  id: number;
  farmName: string;
  ownerName: string;
  city: string;
  is_verified: number;
  is_active: number;
  images: string[];
  status: string;
  [key: string]: any;
}

export default function FarmApprovals() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/farms`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch farms");
      const data = await res.json();
      setFarms(data.farms || []);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const filteredFarms = farms.filter((farm) => {
    const matchesSearch =
      farm.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || farm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (farm: Farm) => {
    setSelectedFarm(farm);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (farmId: number, newStatus: "approved" | "rejected" | "pending") => {
    const statusMap = {
      approved: 1,
      rejected: 3,
      pending: 0,
    };
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/farms/${farmId}`, {
        method: "POST", // or PATCH if you're using method override
        headers: {
          Accept: "application/json",
        },
        body: new URLSearchParams({
          _method: "PATCH",
          is_verified: statusMap[newStatus].toString(),
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update farm status: ${errorText}`);
      }
  
      setFarms((prev) =>
        prev.map((f) => f.id === farmId ? { ...f, is_verified: statusMap[newStatus], status: newStatus } : f)
      );
      setMessage(`Farm successfully ${newStatus}.`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("❌ Failed to update farm status");
    }
  };
  

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };


  const handleDeleteFarm = async (farmId: number) => {
    if (!confirm("Are you sure you want to delete this farm?")) return;
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/farms/${farmId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete farm: ${errorText}`);
      }
  
      setFarms((prev) => prev.filter((f) => f.id !== farmId));
      setMessage("Farm deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete farm.");
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Farm Approvals</h1>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Advanced Filters
        </Button>
      </div>

      {message && (
        <div className="text-sm bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search farms..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading farms...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredFarms.length > 0 ? (
                    filteredFarms.map((farm) => (
                      <TableRow key={farm.id}>
                        <TableCell>{farm.farmName}</TableCell>
                        <TableCell>{farm.ownerName}</TableCell>
                        <TableCell>{farm.city}</TableCell>
                        <TableCell>{getStatusBadge(farm.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(farm)}
                            >
                              <Eye size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleStatusChange(farm.id, "approved")}
                            >
                              <CheckCircle size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleStatusChange(farm.id, "rejected")}
                            >
                              <XCircle size={18} />
                            </Button>


                            <Button
  variant="ghost"
  size="icon"
  className="text-gray-600 hover:text-red-700 hover:bg-red-50"
  onClick={() => handleDeleteFarm(farm.id)}
>
  🗑️
</Button>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No farms found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFarm && selectedFarm.id && (
        <FarmDetailsModal
          farmId={selectedFarm.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={(status) => handleStatusChange(selectedFarm.id, status)}
        />
      )}
    </div>
  );
}

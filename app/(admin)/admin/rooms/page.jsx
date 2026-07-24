"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bed, Plus, Tag, Users, Edit3, Save, X } from "lucide-react";

export default function RoomsManagerPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Room form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Standard Non-AC Room");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState(1000);
  const [amenitiesString, setAmenitiesString] = useState("WiFi, Hot Water, CCTV");
  const [imagesString, setImagesString] = useState("");

  const mockRooms = [
    { id: "std-nonac", roomNumber: "101", roomType: "Standard Non-AC Room", price: 1000, capacity: 2, amenities: ["WiFi", "Hot Water", "CCTV"], description: "Simple budget room for pilgrim stay.", images: [] },
    { id: "std-ac", roomNumber: "102", roomType: "Standard AC Room", price: 1500, capacity: 2, amenities: ["WiFi", "Hot Water", "AC"], description: "Standard AC room with clean linens.", images: [] }
  ];

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.length > 0 ? data : mockRooms);
      } else {
        setRooms(mockRooms);
      }
    } catch (e) {
      setRooms(mockRooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const amenities = amenitiesString.split(",").map(a => a.trim()).filter(Boolean);
      const images = imagesString ? imagesString.split(",").map(i => i.trim()).filter(Boolean) : [];
      
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber, roomType, description, capacity, price, amenities, images }),
      });

      if (res.ok) {
        alert("Room created successfully!");
        setIsAdding(false);
        resetForm();
        fetchRooms();
      } else {
        const err = await res.json();
        alert(err.error || "Could not create room.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding room.");
    }
  };

  const resetForm = () => {
    setRoomNumber("");
    setRoomType("Standard Non-AC Room");
    setDescription("");
    setCapacity(2);
    setPrice(1000);
    setAmenitiesString("WiFi, Hot Water, CCTV");
    setImagesString("");
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Room Inventory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage rooms, pricing tiers, amenities, and photos.</p>
        </div>
        {!isAdding && !editingId && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add New Room
          </Button>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingId) && (
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleCreateRoom} className="space-y-5">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">
                  {isAdding ? "Add New Pilgrim Room" : "Edit Room details"}
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setIsAdding(false); resetForm(); }}
                  className="h-8 w-8 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Room Number</label>
                  <Input 
                    required 
                    placeholder="e.g. 101" 
                    value={roomNumber} 
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="border-[#D4AF37]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border border-[#D4AF37]/30 rounded-lg h-9 px-3 text-sm focus:ring-[#EA580C] bg-white"
                  >
                    <option value="Standard Non-AC Room">Standard Non-AC</option>
                    <option value="Standard AC Room">Standard AC</option>
                    <option value="Deluxe AC Room">Deluxe AC</option>
                    <option value="Family AC Room">Family AC Suite</option>
                    <option value="Dormitory Bed">Dormitory Bed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Price (₹ per night)</label>
                  <Input 
                    type="number" 
                    required 
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="border-[#D4AF37]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Max Capacity (Adults)</label>
                  <Input 
                    type="number" 
                    required 
                    value={capacity} 
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    className="border-[#D4AF37]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Amenities (comma-separated)</label>
                  <Input 
                    value={amenitiesString} 
                    onChange={(e) => setAmenitiesString(e.target.value)}
                    className="border-[#D4AF37]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Image URLs (comma-separated, optional)</label>
                <Input 
                  placeholder="https://example.com/room.jpg"
                  value={imagesString} 
                  onChange={(e) => setImagesString(e.target.value)}
                  className="border-[#D4AF37]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Room Description</label>
                <Textarea 
                  required 
                  placeholder="Describe the room, beds details, special features..."
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-[#D4AF37]/30 min-h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsAdding(false); resetForm(); }}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white h-9 text-xs font-bold shadow"
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Room
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Rooms Table */}
      {loading ? (
        <div>Loading room list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-800">{room.roomType}</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Room Number: {room.roomNumber}</p>
                  </div>
                  <span className="text-lg font-bold text-[#EA580C]">₹{room.price} <span className="text-xs font-normal text-gray-400">/ night</span></span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {room.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((am, i) => (
                    <span 
                      key={i} 
                      className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded border border-gray-200"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-150 flex justify-between items-center text-sm font-medium">
                <span className="text-gray-500 flex items-center gap-1"><Users className="h-4 w-4" /> Capacity: {room.capacity} Adults</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                  room.status === "AVAILABLE" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"
                }`}>{room.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

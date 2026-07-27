"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bed, Plus, Tag, Users, Edit3, Trash2, Save, X, Upload, Link as LinkIcon } from "lucide-react";

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
  const [roomImages, setRoomImages] = useState([]);
  const [status, setStatus] = useState("AVAILABLE");

  // Manual URL helper
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setRoomImages(prev => [...prev, data.url]);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    setRoomImages(prev => [...prev, manualUrl.trim()]);
    setManualUrl("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setRoomImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateOrUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const amenities = amenitiesString.split(",").map(a => a.trim()).filter(Boolean);
      
      const payload = {
        roomNumber,
        roomType,
        description,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        amenities,
        images: roomImages,
        status,
      };

      const url = editingId ? `/api/rooms/${editingId}` : "/api/rooms";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? "Room updated successfully!" : "Room created successfully!");
        setIsAdding(false);
        resetForm();
        fetchRooms();
      } else {
        const err = await res.json();
        alert(err.error || "Could not save room.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving room.");
    }
  };

  const handleEditClick = (room) => {
    setEditingId(room.id);
    setRoomNumber(room.roomNumber);
    setRoomType(room.roomType);
    setDescription(room.description);
    setCapacity(room.capacity);
    setPrice(room.price);
    setAmenitiesString(room.amenities.join(", "));
    setRoomImages(room.images || []);
    setStatus(room.status || "AVAILABLE");
    setIsAdding(false);
  };

  const handleDeleteClick = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Room deleted successfully!");
        fetchRooms();
      } else {
        alert("Failed to delete room.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting room.");
    }
  };

  const resetForm = () => {
    setRoomNumber("");
    setRoomType("Standard Non-AC Room");
    setDescription("");
    setCapacity(2);
    setPrice(1000);
    setAmenitiesString("WiFi, Hot Water, CCTV");
    setRoomImages([]);
    setStatus("AVAILABLE");
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
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add New Room
            </Button>
            <Button 
              onClick={() => {
                resetForm();
                setRoomType("Banquet Hall");
                setRoomNumber(`BH-${Math.floor(100 + Math.random() * 900)}`);
                setPrice(10000);
                setCapacity(100);
                setAmenitiesString("Air Conditioning, Sound System, Catering Area, Stage decoration");
                setDescription("Large spacious air-conditioned banquet hall for weddings, upanayan, family functions, and religious gatherings. Accommodates up to 150-200 guests with dining arrangement.");
                setIsAdding(true);
              }}
              className="bg-[#D4AF37] hover:bg-[#B5922B] text-gray-900 font-bold flex items-center gap-1.5 border border-[#A38627] shadow"
            >
              <Plus className="h-4 w-4" /> Add Banquet Hall
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingId) && (
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleCreateOrUpdateRoom} className="space-y-5">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">
                  {isAdding ? "Add New Pilgrim Room" : "Edit Room Details"}
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
                    <option value="Standard Non-AC Room">Standard Non-AC Room</option>
                    <option value="Standard AC Room">Standard AC Room</option>
                    <option value="Deluxe AC Room">Deluxe AC Room</option>
                    <option value="Family AC Room">Family AC Room</option>
                    <option value="Dormitory Bed">Dormitory Bed</option>
                    <option value="Banquet Hall">Banquet Hall</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Price (₹ per night / day)</label>
                  <Input 
                    type="number" 
                    required 
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="border-[#D4AF37]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Room Availability Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-[#D4AF37]/30 rounded-lg h-9 px-3 text-sm focus:ring-[#EA580C] bg-white"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Multiple Images Upload & URL List manager */}
              <div className="space-y-3 bg-[#FFF8E7]/30 p-4 rounded-xl border border-[#D4AF37]/15">
                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Room Photos Gallery</span>
                
                {/* Thumbnails grid */}
                {roomImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {roomImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group bg-gray-150">
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow opacity-90 hover:opacity-100 hover:scale-105 transition-all"
                          title="Remove Image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No photos added yet. Upload files below or add URLs.</p>
                )}

                {/* Upload & Add Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Direct System Upload</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="image-file-input"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-file-input"
                        className="flex items-center justify-center gap-1.5 border border-dashed border-[#EA580C]/40 bg-white hover:bg-orange-50 text-[#EA580C] px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer h-9 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? "Uploading..." : "Choose Local Image"}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Add Image URL</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="border-[#D4AF37]/30 h-9 text-xs"
                      />
                      <Button
                        type="button"
                        onClick={handleAddManualUrl}
                        className="bg-gray-800 hover:bg-gray-900 text-white h-9 px-3"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
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
            <Card key={room.id} className="overflow-hidden border border-gray-200 shadow-sm bg-white rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Display primary thumbnail or first image */}
              <div className="aspect-video w-full bg-gray-100 overflow-hidden relative border-b border-gray-100">
                <img
                  src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"}
                  alt={room.roomType}
                  className="w-full h-full object-cover"
                />
                {room.images && room.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                    +{room.images.length - 1} Photos
                  </span>
                )}
              </div>

              <div className="p-6 space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-800">{room.roomType}</h3>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Room Number: {room.roomNumber}</p>
                  </div>
                  <span className="text-lg font-bold text-[#EA580C]">₹{room.price} <span className="text-xs font-normal text-gray-400">/ {room.roomType === "Banquet Hall" ? "day" : "night"}</span></span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {room.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.amenities.map((am, i) => (
                    <span 
                      key={i} 
                      className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-150 flex justify-between items-center text-sm font-medium">
                <span className="text-gray-500 flex items-center gap-1 text-xs"><Users className="h-4 w-4" /> Capacity: {room.capacity} Adults</span>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold mr-1.5 ${
                    room.status === "AVAILABLE" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"
                  }`}>{room.status}</span>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditClick(room)}
                    className="h-8 w-8 text-gray-500 hover:text-[#EA580C] hover:bg-orange-50 border border-gray-200"
                    title="Edit Room"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(room.id)}
                    className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-600 border border-red-200"
                    title="Delete Room"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

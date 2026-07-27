"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Image as ImageIcon, Save, X, Upload } from "lucide-react";

export default function GalleryManagerPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ROOMS");
  const [uploading, setUploading] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e) => {
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
        setImage(data.url);
      } else {
        alert("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, title, category }),
      });

      if (res.ok) {
        alert(editingId ? "Photo updated successfully!" : "Photo added successfully!");
        setIsAdding(false);
        setEditingId(null);
        setImage("");
        setTitle("");
        setCategory("ROOMS");
        fetchGallery();
      } else {
        const err = await res.json();
        alert(err.error || "Could not save photo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving photo.");
    }
  };

  const handleEditClick = (img) => {
    setEditingId(img.id);
    setImage(img.image);
    setTitle(img.title || "");
    setCategory(img.category);
    setIsAdding(false);
  };

  const handleDeleteClick = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(`/api/gallery/${photoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Photo deleted successfully!");
        fetchGallery();
      } else {
        alert("Failed to delete photo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting photo.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gallery Organizer</h2>
          <p className="text-sm text-gray-500 mt-1">Upload and organize photos of rooms, building, and dining halls.</p>
        </div>
        {!isAdding && !editingId && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Photo
          </Button>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingId) && (
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">
                  {isAdding ? "Add New Photo" : "Edit Photo Details"}
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setIsAdding(false); setEditingId(null); setImage(""); setTitle(""); }}
                  className="h-8 w-8 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 block">Photo Image Source</label>
                  <div className="flex gap-2">
                    <Input 
                      required 
                      placeholder="https://images.unsplash.com/..." 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)}
                      className="border-[#D4AF37]/30 flex-1 h-9 text-xs"
                    />
                    
                    {/* Direct Upload button */}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="gallery-file-input" 
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="gallery-file-input" 
                        className="flex items-center gap-1 px-3 border border-dashed border-[#EA580C]/40 bg-white hover:bg-orange-50 text-[#EA580C] text-xs font-semibold rounded-lg h-9 cursor-pointer transition-colors"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? "..." : "Upload"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-[#D4AF37]/30 rounded-lg h-9 px-3 text-sm focus:ring-[#EA580C] bg-white"
                  >
                    <option value="ROOMS">Rooms</option>
                    <option value="BUILDING">Building</option>
                    <option value="RECEPTION">Reception</option>
                    <option value="PARKING">Parking</option>
                    <option value="TEMPLE_VIEW">Temple View</option>
                    <option value="DINING">Dining Area</option>
                    <option value="BATHROOMS">Bathrooms</option>
                    <option value="HOTEL">Sai Vitthal Hotel & Menu</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Photo Title / Caption</label>
                <Input 
                  placeholder="e.g. Lobby seating area" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-[#D4AF37]/30"
                />
              </div>

              {image && (
                <div className="w-32 aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsAdding(false); setEditingId(null); setImage(""); setTitle(""); }}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white h-9 text-xs font-bold shadow"
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Photo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Grid listing */}
      {loading ? (
        <div>Loading gallery list...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow group relative">
              <CardContent className="p-0 relative aspect-video bg-gray-100">
                <img
                  src={img.image}
                  alt={img.title || "Gallery photo"}
                  className="w-full h-full object-cover"
                />
                
                {/* Action buttons (Visible on hover) */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-1 rounded-lg backdrop-blur-xs">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditClick(img)}
                    className="h-7 w-7 text-white hover:text-[#EA580C] hover:bg-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(img.id)}
                    className="h-7 w-7 text-white hover:text-red-600 hover:bg-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 p-4 text-white flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold truncate max-w-[150px]">{img.title || "Untitled"}</p>
                    <span className="text-[10px] text-white/60 font-mono uppercase">{img.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

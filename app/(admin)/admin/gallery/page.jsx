"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Image as ImageIcon, Save, X } from "lucide-react";

export default function GalleryManagerPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ROOMS");

  const mockImages = [
    { id: "1", category: "ROOMS", title: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600" },
    { id: "2", category: "ROOMS", title: "Deluxe AC Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600" },
    { id: "3", category: "BUILDING", title: "Bhakt Niwas Building", image: "/hero-bhakt-niwas.jpg" }
  ];

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data.length > 0 ? data : mockImages);
      } else {
        setImages(mockImages);
      }
    } catch (e) {
      setImages(mockImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, title, category }),
      });

      if (res.ok) {
        alert("Photo added successfully!");
        setIsAdding(false);
        setImage("");
        setTitle("");
        setCategory("ROOMS");
        fetchGallery();
      } else {
        const err = await res.json();
        alert(err.error || "Could not add image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding photo.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gallery Organizer</h2>
          <p className="text-sm text-gray-500 mt-1">Upload and organize photos of rooms, building, and dining halls.</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Photo
          </Button>
        )}
      </div>

      {/* Add Photo Form Panel */}
      {isAdding && (
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">Add New Photo</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsAdding(false)}
                  className="h-8 w-8 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Image URL</label>
                  <Input 
                    required 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    className="border-[#D4AF37]/30"
                  />
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

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white h-9 text-xs font-bold shadow"
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Add Photo
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
            <Card key={img.id} className="overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl">
              <CardContent className="p-0 relative aspect-video bg-gray-100">
                <img
                  src={img.image}
                  alt={img.title || "Gallery photo"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 text-white flex justify-between items-end">
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

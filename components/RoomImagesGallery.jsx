"use client";

import React, { useState } from "react";

export default function RoomImagesGallery({ images, roomType }) {
  const list = (images && images.length > 0) ? images : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200"];
  const [activeImage, setActiveImage] = useState(list[0]);

  return (
    <div className="space-y-4 mb-8">
      {/* Active Main Image */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100 rounded-xl border border-[#D4AF37]/20 relative shadow-sm">
        <img
          src={activeImage}
          alt={roomType}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails grid */}
      {list.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {list.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                activeImage === img 
                  ? "border-[#EA580C] ring-2 ring-[#EA580C]/20" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img src={img} alt={`${roomType} view ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

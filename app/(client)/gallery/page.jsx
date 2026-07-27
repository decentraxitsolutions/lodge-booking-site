"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export default function GalleryPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories
  const categories = [
    { code: "ALL", label: "सर्व / All" },
    { code: "ROOMS", label: "खोल्या / Rooms" },
    { code: "BUILDING", label: "इमारत / Building" },
    { code: "RECEPTION", label: "रिसेप्शन / Reception" },
    { code: "PARKING", label: "पार्किंग / Parking" },
    { code: "TEMPLE_VIEW", label: "मंदिर परिसर / Temple View" },
    { code: "HOTEL", label: "हॉटेल आणि मेनू / Hotel & Menu" }
  ];

  // Static/Mock images matching categories for default preview
  const mockImages = [
    { id: "1", category: "ROOMS", title: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600" },
    { id: "2", category: "ROOMS", title: "Deluxe AC Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600" },
    { id: "3", category: "ROOMS", title: "Family Room", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600" },
    { id: "4", category: "BUILDING", title: "Bhakt Niwas Building", image: "/hero-bhakt-niwas.jpg" },
    { id: "5", category: "RECEPTION", title: "Lobby & Reception Desk", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600" },
    { id: "6", category: "PARKING", title: "Spacious Parking Lot", image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600" },
    { id: "7", category: "TEMPLE_VIEW", title: "Vitthal Temple Gopuram", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600" }
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat.toUpperCase());
      }
    }
  }, []);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setImages(data);
          } else {
            setImages(mockImages);
          }
        } else {
          setImages(mockImages);
        }
      } catch (err) {
        setImages(mockImages);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filteredImages = activeCategory === "ALL" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("nav.gallery")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            {t("home.galleryPreviewTitle")}
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setActiveCategory(cat.code)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all ${activeCategory === cat.code 
                ? "bg-[#EA580C] text-white border-[#EA580C] shadow" 
                : "bg-white text-gray-600 border-[#D4AF37]/25 hover:bg-[#FFF8E7]"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">Loading gallery images...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <Card key={img.id} className="overflow-hidden border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-0 relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={img.image}
                    alt={img.title || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                      <p className="font-serif text-sm font-semibold tracking-wide">
                        {img.title}
                      </p>
                      <p className="text-[10px] text-white/60 font-mono mt-0.5 capitalize">
                        {img.category.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

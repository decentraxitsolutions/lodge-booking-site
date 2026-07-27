import React from "react";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Bed, Users, Calendar, ArrowLeft, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import RoomImagesGallery from "@/components/RoomImagesGallery";

// Fallback in case DB query fails or is empty during preview
const mockRooms = [
  { id: "std-nonac", roomNumber: "101", roomType: "Standard Non-AC Room", price: 1000, capacity: 2, amenities: ["WiFi", "24/7 Hot Water", "CCTV Security", "Drinking RO Water"], description: "Clean and budget-friendly standard room with non-AC fans, clean bedsheets, and attachment bathroom. Best for pilgrims looking for a simple night stay in Pandharpur.", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200"] },
  { id: "std-ac", roomNumber: "102", roomType: "Standard AC Room", price: 1500, capacity: 2, amenities: ["Air Conditioning", "WiFi", "24/7 Hot Water", "CCTV Security"], description: "Standard AC room with premium ventilation, quiet surroundings, comfortable double bed, clean sheets, and round-the-clock water supply.", images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200"] },
  { id: "del-ac", roomNumber: "201", roomType: "Deluxe AC Room", price: 2000, capacity: 3, amenities: ["Air Conditioning", "WiFi", "LED TV", "Hot Water", "CCTV Security"], description: "Spacious deluxe room with high-quality wooden interior, visual balcony, LED television, clean linens, and hot water attachment.", images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200"] }
];

export default async function RoomDetailPage({ params }) {
  // Await params to adhere to Next.js 16 Async Request APIs breaking change
  const { id } = await params;

  let room = null;
  try {
    room = await db.room.findUnique({
      where: { id },
    });
  } catch (err) {
    console.error("Error loading room details:", err);
  }

  if (!room) {
    room = mockRooms.find((r) => r.id === id);
  }

  if (!room) {
    notFound();
  }

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Back Link */}
        <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to rooms
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
              {room.roomType}
            </h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1.5">
              Room Number: {room.roomNumber} | Max Capacity: {room.capacity} Adults
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-gray-500 font-medium">Starting from</span>
            <p className="text-3xl font-extrabold text-[#EA580C]">
              ₹{room.price} <span className="text-sm font-normal text-gray-500">/ {room.roomType === "Banquet Hall" ? "day" : "night"}</span>
            </p>
          </div>
        </div>

        {/* Gallery */}
        <RoomImagesGallery images={room.images} roomType={room.roomType} />

        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-8 items-start">
          
          {/* Main Info */}
          <div className="space-y-6">
            
            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/15 shadow-sm space-y-3">
              <h2 className="font-serif text-lg font-bold text-gray-800 border-b border-gray-150 pb-2">Description</h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/15 shadow-sm space-y-3">
              <h2 className="font-serif text-lg font-bold text-gray-800 border-b border-gray-150 pb-2">Amenities</h2>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {room.amenities.map((am, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-650">
                    <ShieldCheck className="h-4 w-4 text-[#EA580C] shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/15 shadow-sm space-y-3">
              <h2 className="font-serif text-lg font-bold text-gray-800 border-b border-gray-150 pb-2">Bhakt Niwas Policies</h2>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <li>No alcohol, smoking, or non-vegetarian food is allowed inside rooms or premises.</li>
                <li>Check-in is at 12:00 PM and Check-out is at 11:00 AM.</li>
                <li>Valid government-approved Aadhaar / Passport is required at registration.</li>
              </ul>
            </div>

          </div>

          {/* Quick Book Widget */}
          <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/25 shadow-md text-center space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-800">Check availability</h3>
            <p className="text-xs text-gray-500">Select dates on the rooms search catalog page to book this stay.</p>
            <Link href={`/rooms?roomType=${encodeURIComponent(room.roomType)}`}>
              <Button className="w-full bg-[#EA580C] text-white hover:bg-[#C2410C] font-bold h-11 shadow-sm">
                Reserve Room
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

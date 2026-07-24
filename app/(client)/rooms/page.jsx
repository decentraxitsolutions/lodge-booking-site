"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bed, Users, Calendar, ArrowRight } from "lucide-react";

function RoomsListContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters from URL
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") ? parseInt(searchParams.get("guests")) : 2);
  const [roomType, setRoomType] = useState(searchParams.get("roomType") || "ALL");

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks
  const mockRooms = [
    { id: "std-nonac", roomNumber: "101", roomType: "Standard Non-AC Room", price: 1000, capacity: 2, amenities: ["WiFi", "24/7 Hot Water", "CCTV Security"], description: "Clean and budget-friendly standard room with non-AC fans and attachment bathrooms.", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"] },
    { id: "std-ac", roomNumber: "102", roomType: "Standard AC Room", price: 1500, capacity: 2, amenities: ["Air Conditioning", "WiFi", "24/7 Hot Water"], description: "Standard AC room with premium ventilation, quiet surroundings, and comfortable double bed.", images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600"] },
    { id: "del-ac", roomNumber: "201", roomType: "Deluxe AC Room", price: 2000, capacity: 3, amenities: ["Air Conditioning", "WiFi", "LED TV", "Hot Water"], description: "Spacious deluxe room with high-quality linens, visual balcony, television, and hot water.", images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"] },
    { id: "fam-ac", roomNumber: "301", roomType: "Family AC Room", price: 3500, capacity: 5, amenities: ["Air Conditioning", "WiFi", "LED TV", "Lift Access", "Hot Water"], description: "Perfect choice for large family pilgrimages. Accommodates up to 5 members with extra beds.", images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600"] }
  ];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let url = `/api/rooms?guests=${guests}`;
      if (checkIn) url += `&checkIn=${checkIn}`;
      if (checkOut) url += `&checkOut=${checkOut}`;
      if (roomType !== "ALL") url += `&roomType=${roomType}`;

      const res = await fetch(url);
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
  }, [checkIn, checkOut, guests, roomType]);

  const handleBookNow = (roomId) => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates before booking!");
      return;
    }
    router.push(`/book?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("rooms.title")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            {t("rooms.subtitle")}
          </p>
        </div>

        {/* Filter Widget */}
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl mb-12">
          <CardContent className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-[1.5fr_1.5fr_1fr_1.5fr] sm:items-end">
            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                <Calendar className="h-4 w-4" /> {t("roomDetails.checkIn")}
              </span>
              <Input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border-[#D4AF37]/30 bg-[#FFF8E7]/30 h-10"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                <Calendar className="h-4 w-4" /> {t("roomDetails.checkOut")}
              </span>
              <Input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border-[#D4AF37]/30 bg-[#FFF8E7]/30 h-10"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                <Users className="h-4 w-4" /> {t("roomDetails.adults")}
              </span>
              <Input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="border-[#D4AF37]/30 bg-[#FFF8E7]/30 h-10 text-center font-bold"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                <Bed className="h-4 w-4" /> Type
              </span>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full border border-[#D4AF37]/30 rounded-lg bg-white h-10 px-3 text-sm focus:ring-[#EA580C]"
              >
                <option value="ALL">All Rooms</option>
                <option value="Standard Non-AC Room">Standard Non-AC</option>
                <option value="Standard AC Room">Standard AC</option>
                <option value="Deluxe AC Room">Deluxe AC</option>
                <option value="Family AC Room">Family AC Suite</option>
              </select>
            </label>
          </CardContent>
        </Card>

        {/* Room Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-semibold">Loading available rooms...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative border-b border-gray-150">
                    <img
                      src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"}
                      alt={room.roomType}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#EA580C] text-[#FFF8E7] font-bold text-sm px-3.5 py-1.5 rounded-full shadow border border-[#D4AF37]/20">
                      ₹{room.price} / night
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-800 leading-tight">
                        {room.roomType}
                      </h3>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                        Room Number: {room.roomNumber}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {room.amenities.map((am, i) => (
                        <span 
                          key={i} 
                          className="bg-[#FFF8E7] text-[#EA580C] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#D4AF37]/25"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#D4AF37]/10 flex gap-4 items-center mt-auto">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium shrink-0">
                    <Users className="h-4 w-4 text-[#EA580C]" />
                    <span>Max {room.capacity} Guests</span>
                  </div>
                  <Button 
                    onClick={() => handleBookNow(room.id)}
                    className="flex-1 bg-[#EA580C] text-white hover:bg-[#C2410C] font-bold shadow-md h-11"
                  >
                    {t("rooms.bookNow")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-gray-500">Loading page resources...</div>}>
      <RoomsListContent />
    </Suspense>
  );
}

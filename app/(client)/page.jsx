"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/LanguageContext";
import HeroClient from "@/components/HeroComponents/HeroClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Quote, Calendar, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Mock static data to fall back on if API/DB is empty
  const mockRooms = [
    { id: "std-nonac", roomType: "Standard Non-AC Room", price: 1000, capacity: 2, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600" },
    { id: "std-ac", roomType: "Standard AC Room", price: 1500, capacity: 2, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600" },
    { id: "del-ac", roomType: "Deluxe AC Room", price: 2000, capacity: 3, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600" }
  ];

  const mockBlogs = [
    { id: "1", title: "आषाढी वारी २०२६: दर्शन आणि प्रवासाची संपूर्ण मार्गदर्शिका", slug: "ashadhi-wari-2026-guide", content: "लाखो वारकरी माऊलींच्या दर्शनासाठी पंढरपूरकडे मार्गस्थ होतात. राहण्याची सोय आणि दर्शन पासेस संदर्भात सविस्तर माहिती...", image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600", createdAt: new Date().toISOString() },
    { id: "2", title: "कुटुंबासोबत प्रवासाचे नियोजन कसे करावे?", slug: "pandharpur-family-trip-planning", content: "लहान मुले आणि ज्येष्ठ नागरिकांसोबत विठ्ठल दर्शन प्रवासाचे नियोजन करताना कोणत्या गोष्टींची काळजी घ्यावी...", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600", createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() }
  ];

  const mockReviews = [
    { id: "1", userName: "ज्ञानेश्वर महाराज (Pune)", rating: 5, review: "मंदिराच्या अगदी जवळ असल्याने दर्शन करणे सुलभ झाले. भक्त निवासातील खोल्या अतिशय स्वच्छ आणि टापटीप आहेत. कर्मचारी विनम्र आहेत." },
    { id: "2", userName: "Sunita Deshmukh (Mumbai)", rating: 5, review: "Best place to stay with family. Elevator and hot water facilities were extremely useful for my elderly parents. Highly recommended!" },
    { id: "3", userName: "Warkari Dindi 12 (Solapur)", rating: 5, review: "ग्रुप बुकिंगसाठी उत्तम जागा. पार्किंग व्यवस्था मोठी आहे आणि बस पार्क करणे सोपे गेले. विठू माऊलीच्या चरणी सुखद मुक्काम!" }
  ];

  useEffect(() => {
    // Fetch rooms, blogs, reviews from API or fall back
    async function loadData() {
      try {
        const roomsRes = await fetch("/api/rooms?limit=3");
        if (roomsRes.ok) {
          const r = await roomsRes.json();
          setRooms(r.length > 0 ? r : mockRooms);
        } else {
          setRooms(mockRooms);
        }
      } catch (e) {
        setRooms(mockRooms);
      }

      try {
        const blogsRes = await fetch("/api/blogs?limit=2");
        if (blogsRes.ok) {
          const b = await blogsRes.json();
          setBlogs(b.length > 0 ? b.slice(0, 2) : mockBlogs);
        } else {
          setBlogs(mockBlogs);
        }
      } catch (e) {
        setBlogs(mockBlogs);
      }

      try {
        const reviewsRes = await fetch("/api/reviews?approved=true&limit=3");
        if (reviewsRes.ok) {
          const revs = await reviewsRes.json();
          setReviews(revs.length > 0 ? revs : mockReviews);
        } else {
          setReviews(mockReviews);
        }
      } catch (e) {
        setReviews(mockReviews);
      }
    }
    loadData();
  }, []);

  return (
    <>
      {/* Hero & Search availability */}
      <HeroClient />

      {/* Nearby Attractions Panel */}
      <section className="bg-white py-20 text-[#374151]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
              {t("home.nearbyAttractions")}
            </h2>
            <p className="mt-4 text-gray-600">
              भक्त निवासाच्या जवळ असलेले मुख्य तीर्थस्थळे आणि त्यांचे अंतर
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-[#FFF8E7] p-6 rounded-xl border border-[#D4AF37]/25 shadow-sm text-center">
              <div className="p-3 bg-[#EA580C]/10 text-[#EA580C] w-fit rounded-full mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">{t("home.vitthalTemple")}</h3>
              <p className="text-sm text-gray-600">पांडुरंगाचे दर्शन घेणाऱ्या भाविकांसाठी मुख्य विठ्ठल रुक्मिणी मंदिर अवघ्या ५ मिनिटांच्या अंतरावर आहे.</p>
            </div>
            <div className="bg-[#FFF8E7] p-6 rounded-xl border border-[#D4AF37]/25 shadow-sm text-center">
              <div className="p-3 bg-[#EA580C]/10 text-[#EA580C] w-fit rounded-full mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">{t("home.chandrabhaga")}</h3>
              <p className="text-sm text-gray-600">भक्त दर्शनाला जाण्यापूर्वी चंद्रभागेच्या पवित्र पात्रात स्नान करतात, जो घाट भक्त निवासापासून १० मिनिटांवर आहे.</p>
            </div>
            <div className="bg-[#FFF8E7] p-6 rounded-xl border border-[#D4AF37]/25 shadow-sm text-center">
              <div className="p-3 bg-[#EA580C]/10 text-[#EA580C] w-fit rounded-full mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">{t("home.iskcon")}</h3>
              <p className="text-sm text-gray-600">नदीच्या पलीकडील तीरावर असलेले निसर्गरम्य इस्कॉन मंदिर संकुल १५ मिनिटांच्या अंतरावर उपलब्ध आहे.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Category Highlights */}
      <section className="bg-[#FFF8E7] py-20 text-[#374151]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
              {t("rooms.title")}
            </h2>
            <p className="mt-4 text-gray-600">
              {t("rooms.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room) => (
              <Card key={room.id} className="overflow-hidden border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={room.image || room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"}
                    alt={room.roomType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#EA580C] text-[#FFF8E7] text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                    ₹{room.price} / {t("rooms.beds").toLowerCase()}
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-gray-800 leading-tight">
                      {room.roomType}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      Capacity: {room.capacity} Adults
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/10">
                    <Button 
                      onClick={() => router.push("/rooms")}
                      className="w-full bg-[#EA580C] text-white hover:bg-[#C2410C]"
                    >
                      {t("rooms.bookNow")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/rooms">
              <Button variant="outline" className="border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white font-bold h-11 px-6">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 text-[#374151]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
              {t("home.testimonialsTitle")}
            </h2>
            <p className="mt-4 text-gray-600">
              भक्त निवासात मुक्कामास आलेल्या भाविकांचे मनोगत
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <Card key={rev.id} className="bg-[#FFF8E7] border border-[#D4AF37]/20 p-6 rounded-xl flex flex-col justify-between shadow-sm relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-[#D4AF37]/20" />
                <p className="text-sm italic text-gray-650 leading-relaxed z-10">
                  “{rev.review}”
                </p>
                <div className="mt-6 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{rev.userName || rev.user?.name || "Devotee"}</span>
                  <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News / Blogs */}
      <section className="bg-[#FFF8E7] py-20 text-[#374151]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
              {t("nav.blog")} & Updates
            </h2>
            <p className="mt-4 text-gray-600">
              पंढरपूर यात्रा आणि भक्त निवासाचे ताजे अपडेट्स
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <Card key={post.id} className="overflow-hidden border border-[#D4AF37]/15 shadow-sm bg-white flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden bg-gray-100 relative shrink-0">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-gray-800 hover:text-[#EA580C] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/10">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#C2410C]"
                    >
                      Read full update
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
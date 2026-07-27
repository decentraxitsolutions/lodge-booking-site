"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users2, ArrowRight, ShieldCheck, HeartHandshake, MapPin, Building, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";

export default function HeroClient() {
    const { t } = useTranslation();
    const router = useRouter();

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (!checkIn || !checkOut) return;
        router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    }, [checkIn, checkOut, guests, router]);

    // Highlights list
    const highlights = [
        {
            key: "cleanRooms",
            title: "स्वच्छ खोल्या / Clean Rooms",
            desc: "भाविकांसाठी उत्तम आणि नियमितपणे निर्जंतुक केलेल्या स्वच्छ खोल्या.",
            icon: ShieldCheck
        },
        {
            key: "location",
            title: "मंदिराजवळ / Nearby Temple",
            desc: "विठ्ठल रुक्मिणी मंदिरापासून फक्त ५ मिनिटांच्या अंतरावर सोयीस्कर जागा.",
            icon: MapPin
        },
        {
            key: "hospitality",
            title: "२४ तास सेवा / 24x7 Service",
            desc: "भक्तांच्या सेवेसाठी आमचे कर्मचारी चोवीस तास तत्पर आहेत.",
            icon: HeartHandshake
        }
    ];

    return (
        <div className="bg-[#FFF8E7] text-[#374151] font-sans">
            
            {/* --- MOBILE LAYOUT: Full background image at top, welcome text & CTAs below --- */}
            <div className="block md:hidden bg-[#1F1914] text-white">
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#1F1914] border-b border-[#D4AF37]/30">
                    <img 
                        src="/hero-sai-vitthal.jpg" 
                        alt="Shri Sai Vitthal Bhakt Niwas Background" 
                        className="w-full h-full object-contain"
                    />
                    {/* Devotional Overlay tag on the mobile image */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-[#FFF8E7] py-1 px-2 rounded text-[10px] text-center font-bold">
                        जय हरी विठ्ठल | ओम साई राम
                    </div>
                </div>
                
                <div className="p-6 text-center space-y-5 pb-16">
                    <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                        {t("home.heroEyebrow")}
                    </p>
                    <h1 className="font-serif text-3xl font-bold leading-snug text-[#FFF8E7]">
                        {t("home.heroTitle")}
                    </h1>
                    <p className="text-xs leading-relaxed text-[#FFF8E7]/80 max-w-sm mx-auto">
                        {t("home.heroSub")}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            onClick={() => router.push("/rooms?roomType=Banquet Hall")}
                            className="w-full bg-[#D4AF37] hover:bg-[#Bfa030] text-[#1F1914] font-bold border-b-4 border-[#A38627] flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs"
                        >
                            <Building className="h-4 w-4 shrink-0" />
                            बँक्वेट हॉल बुकिंग / Book Banquet Hall
                        </Button>
                        <Button
                            onClick={() => router.push("/gallery?category=HOTEL")}
                            className="w-full bg-white/10 hover:bg-white/20 text-[#FFF8E7] font-semibold border border-[#D4AF37]/50 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs"
                        >
                            <UtensilsCrossed className="h-4 w-4 text-[#D4AF37] shrink-0" />
                            श्री साई विठ्ठल हॉटेल / Shree Sai Vitthal Hotel
                        </Button>
                        <Button
                            onClick={() => {
                                const section = document.getElementById("book-form");
                                if (section) section.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="w-full bg-[#F97316] text-white hover:bg-[#EA580C] font-semibold border-b-4 border-[#C2410C] py-3.5 rounded-xl mt-2 text-xs flex items-center justify-center gap-2"
                        >
                            {t("home.checkAvailability")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP LAYOUT: Centered overlay over full-screen background --- */}
            <section
                className="hidden md:flex relative min-h-[95vh] w-full flex-col justify-center overflow-hidden text-white bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-sai-vitthal.jpg')" }}
            >
                {/* Dark Overlay for visual contrast and readability */}
                <div className="absolute inset-0 bg-black/55 z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1914] via-black/30 to-[#1F1914]/40 z-0" />

                <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-20 pt-32 sm:px-10 text-center space-y-8">
                    
                    <div className="space-y-4">
                        <p className="font-serif text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                            {t("home.heroEyebrow")}
                        </p>
                        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-[#FFF8E7] drop-shadow-md">
                            {t("home.heroTitle")}
                        </h1>
                        <p className="text-sm sm:text-base leading-relaxed text-[#FFF8E7]/90 max-w-2xl mx-auto">
                            {t("home.heroSub")}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center items-center gap-4 max-w-xl mx-auto pt-2">
                        <Button
                            onClick={() => router.push("/rooms?roomType=Banquet Hall")}
                            size="lg"
                            className="bg-[#D4AF37] hover:bg-[#Bfa030] text-[#1F1914] font-bold border-b-4 border-[#A38627] flex items-center justify-center gap-2 px-6 shadow-lg rounded-xl"
                        >
                            <Building className="h-4 w-4" />
                            बँक्वेट हॉल बुकिंग / Book Banquet Hall
                        </Button>
                        <Button
                            onClick={() => router.push("/gallery?category=HOTEL")}
                            size="lg"
                            className="bg-[#1F1914]/80 hover:bg-[#1F1914] text-[#FFF8E7] font-semibold border border-[#D4AF37]/50 flex items-center justify-center gap-2 px-6 backdrop-blur-sm rounded-xl"
                        >
                            <UtensilsCrossed className="h-4 w-4 text-[#D4AF37]" />
                            श्री साई विठ्ठल हॉटेल / Shree Sai Vitthal Hotel
                        </Button>
                    </div>

                    {/* Check Availability CTA Button */}
                    <div className="pt-2">
                        <Button
                            onClick={() => {
                                const section = document.getElementById("book-form");
                                if (section) section.scrollIntoView({ behavior: "smooth" });
                            }}
                            size="lg"
                            className="bg-[#F97316] text-white hover:bg-[#EA580C] font-semibold border-b-4 border-[#C2410C] rounded-xl px-8"
                        >
                            {t("home.checkAvailability")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                </div>
            </section>

            {/* 2. Check Availability Booking Widget */}
            <section id="book-form" className="relative z-20 mx-auto -mt-12 w-full max-w-4xl px-6 sm:px-10">
                <Card className="border border-[#D4AF37]/35 bg-[#FFF8E7] shadow-xl rounded-xl">
                    <CardContent className="p-6 sm:p-8">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
                            
                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                                    <CalendarDays className="h-4 w-4" /> {t("roomDetails.checkIn")}
                                </span>
                                <Input
                                    type="date"
                                    required
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="border-[#D4AF37]/40 bg-white text-gray-800 h-11 focus:ring-2 focus:ring-[#F97316] rounded-lg"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                                    <CalendarDays className="h-4 w-4" /> {t("roomDetails.checkOut")}
                                </span>
                                <Input
                                    type="date"
                                    required
                                    value={checkOut}
                                    min={checkIn || new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="border-[#D4AF37]/40 bg-white text-gray-800 h-11 focus:ring-2 focus:ring-[#F97316] rounded-lg"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
                                    <Users2 className="h-4 w-4" /> {t("roomDetails.adults")}
                                </span>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="w-24 border-[#D4AF37]/40 bg-white text-gray-800 h-11 focus:ring-2 focus:ring-[#F97316] rounded-lg text-center font-bold"
                                />
                            </label>

                            <Button
                                type="submit"
                                className="h-11 bg-[#EA580C] text-white hover:bg-[#C2410C] font-bold px-6 shadow-md rounded-lg w-full sm:w-auto"
                            >
                                {t("rooms.availability")}
                            </Button>
                            
                        </form>
                    </CardContent>
                </Card>
            </section>

            {/* Quick Info Bar */}
            <section className="mx-auto w-full max-w-5xl px-6 pt-12 sm:px-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-[#D4AF37]/15 shadow-sm text-center">
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1">{t("home.quickInfo")}</h4>
                        <p className="text-sm font-medium text-gray-800">{t("home.address")}</p>
                    </div>
                    <div className="border-y sm:border-y-0 sm:border-x border-gray-150 py-4 sm:py-0">
                        <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1">Check-in / Check-out</h4>
                        <p className="text-sm font-medium text-gray-800">{t("home.checkInTime")} | {t("home.checkOutTime")}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1">Google Rating</h4>
                        <p className="text-sm font-bold text-amber-500">★ ★ ★ ★ ★ <span className="text-gray-800 ml-1 text-sm font-medium">({t("home.rating")})</span></p>
                    </div>
                </div>
            </section>

            {/* 3. Highlights Section */}
            <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
                        {t("home.highlightsTitle")}
                    </h2>
                    <p className="mt-4 text-gray-650 text-sm sm:text-base">
                        {t("home.highlightsSub")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {highlights.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.key}
                                className="flex flex-col items-center text-center p-8 bg-white border border-[#D4AF37]/20 rounded-xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="p-4 bg-[#FFF8E7] rounded-full text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-all">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 font-serif text-xl font-bold text-gray-850">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-sm text-gray-650 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users2, ArrowRight, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
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
        // Redirect to rooms page with query parameters
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
            {/* 1. Hero Banner */}
            <section
                className="relative flex min-h-[90vh] w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#1F1914] via-[#2A1E17] to-[#1F1914] text-white"
            >
                {/* Decorative background accent */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_45%)]" />
                
                {/* Temple Arch Silhouette Accent */}
                <div className="absolute top-10 right-10 opacity-5 pointer-events-none select-none max-w-sm w-full hidden md:block">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full text-[#D4AF37]">
                        <path d="M10 90 C 10 30, 90 30, 90 90" strokeWidth="2" />
                        <path d="M20 90 C 20 40, 80 40, 80 90" strokeWidth="1" />
                        <circle cx="50" cy="30" r="4" fill="currentColor" />
                    </svg>
                </div>

                <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    
                    {/* Left Column: Welcome details */}
                    <div className="space-y-6 text-left">
                        <p className="font-serif text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                            {t("home.heroEyebrow")}
                        </p>
                        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-[#FFF8E7]">
                            {t("home.heroTitle")}
                        </h1>
                        <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-lg">
                            {t("home.heroSub")}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Button
                                onClick={() => {
                                    const section = document.getElementById("book-form");
                                    if (section) section.scrollIntoView({ behavior: "smooth" });
                                }}
                                size="lg"
                                className="bg-[#F97316] text-white hover:bg-[#EA580C] font-semibold border-b-4 border-[#C2410C]"
                            >
                                {t("home.checkAvailability")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => router.push("/gallery")}
                                variant="ghost"
                                size="lg"
                                className="text-[#FFF8E7] hover:bg-white/10 hover:text-white"
                            >
                                {t("home.viewGallery")}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Full building image card */}
                    <div className="flex justify-center items-center md:justify-end">
                        <div className="relative aspect-square w-full max-w-[360px] sm:max-w-[400px] overflow-hidden rounded-2xl border-4 border-[#D4AF37] shadow-2xl bg-white transition-all hover:scale-[1.02] duration-300">
                            <img
                                src="/hero-bhakt-niwas.jpg"
                                alt="Shri Sai Vitthal Bhakt Niwas Building"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay tag */}
                            <div className="absolute bottom-4 left-4 right-4 bg-[#EA580C]/90 backdrop-blur-sm border border-[#D4AF37]/30 text-[#FFF8E7] py-2 px-3 rounded-xl shadow-lg text-center font-serif font-bold text-xs sm:text-sm">
                                श्री. साई विठ्ठल भक्त निवास (पंढरपूर)
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. Check Availability Booking Widget */}
            <section id="book-form" className="relative z-20 mx-auto -mt-12 w-full max-w-4xl px-6 sm:px-10">
                <Card className="border border-[#D4AF37]/30 bg-[#FFF8E7] shadow-xl rounded-xl">
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
                                className="h-11 bg-[#EA580C] text-white hover:bg-[#C2410C] font-bold px-6 shadow-md rounded-lg"
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
                    <p className="mt-4 text-gray-600 text-sm sm:text-base">
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
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
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
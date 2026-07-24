"use client";

import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { 
  Car, 
  ArrowUpCircle, 
  Flame, 
  Droplet, 
  ShieldCheck, 
  CalendarRange, 
  Wifi, 
  Zap, 
  Users 
} from "lucide-react";

export default function FacilitiesPage() {
  const { t } = useTranslation();

  const facilities = [
    { key: "parking", title: t("facilities.parking"), icon: Car, desc: "Safe, spacious, and dedicated on-site parking for all private cars and devotee buses." },
    { key: "lift", title: t("facilities.lift"), icon: ArrowUpCircle, desc: "24/7 elevator access connecting all floors, making it easily accessible for senior citizens." },
    { key: "hotWater", title: t("facilities.hotWater"), icon: Flame, desc: "Hot water facility available in all bathrooms for early morning snan (bathing) before temple rituals." },
    { key: "roWater", title: t("facilities.roWater"), icon: Droplet, desc: "Clean and safe pure RO drinking water station available for all staying guests." },
    { key: "cctv", title: t("facilities.cctv"), icon: ShieldCheck, desc: "Comprehensive 24/7 CCTV surveillance covering corridors, reception, and parking areas for security." },
    { key: "reception", title: t("facilities.reception"), icon: CalendarRange, desc: "Round-the-clock front desk assistance to handle late night check-ins and travel assistance." },
    { key: "wifi", title: t("facilities.wifi"), icon: Wifi, desc: "High-speed wireless internet access across all rooms to stay connected with family." },
    { key: "powerBackup", title: t("facilities.powerBackup"), icon: Zap, desc: "Seamless generator backup to ensure uninterrupted power supply, fans, and lights." },
    { key: "familyRooms", title: t("facilities.familyRooms"), icon: Users, desc: "Large, spacious room options available to comfortably accommodate pilgrim families of 5 to 10 members." }
  ];

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("facilities.title")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            {t("facilities.subtitle")}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facilities.map((fac) => {
            const Icon = fac.icon;
            return (
              <div 
                key={fac.key} 
                className="bg-white p-6 rounded-xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="p-3 bg-[#FFF8E7] rounded-lg text-[#EA580C] w-fit">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">
                    {fac.title}
                  </h3>
                  <p className="text-sm text-gray-650 leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { History, Target, Compass, Award } from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    { key: "history", title: t("about.historyTitle"), text: t("about.historyText"), icon: History },
    { key: "mission", title: t("about.missionTitle"), text: t("about.missionText"), icon: Target },
    { key: "vision", title: t("about.visionTitle"), text: t("about.visionText"), icon: Compass }
  ];

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("about.title")}
          </h1>
          <p className="mt-4 text-[#374151]/80 text-sm sm:text-base">
            पंढरपूर यात्रेकरूंसाठी एक सात्विक व हक्काचे निवासस्थान
          </p>
        </div>

        {/* Content Grids */}
        <div className="space-y-12">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div 
                key={val.key} 
                className="flex flex-col md:flex-row items-start gap-6 bg-white p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-[#FFF8E7] rounded-full text-[#EA580C] shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">
                    {val.title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                    {val.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Management Card */}
        <div className="mt-16 bg-white p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border border-gray-200">
              {/* Fallback pattern / placeholder image */}
              <div className="absolute inset-0 bg-[#EA580C]/10 flex items-center justify-center text-center p-4">
                <p className="font-serif text-[#EA580C] font-semibold">श्री. साई विठ्ठल भक्त निवास</p>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">
                {t("about.ownerTitle")}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-4">
                {t("about.ownerText")}
              </p>
              <div className="flex items-center gap-2 text-[#EA580C] font-semibold text-sm">
                <Award className="h-5 w-5" />
                <span>Serving Devotees with Warmth since 2018</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

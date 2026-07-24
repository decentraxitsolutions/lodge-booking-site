"use client";

import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { 
  Building, 
  Train, 
  Bus, 
  Utensils, 
  PlusCircle, 
  CreditCard 
} from "lucide-react";

export default function NearbyPlacesPage() {
  const { t } = useTranslation();

  const places = [
    {
      category: "आध्यात्मिक ठिकाणे / Spiritual Places",
      icon: Building,
      items: [
        { name: "श्री विठ्ठल रुक्मिणी मंदिर / Vitthal Temple", dist: "३०० मीटर (५ मिनिटे चालत) / 300m (5 mins walk)", desc: "पंढरपूरचे मुख्य श्रद्धास्थान जेथे विठू माऊलीचे सुंदर सावळे रूप विराजमान आहे. / The main pilgrimage temple housing Lord Vitthal and Rukmini Devi." },
        { name: "चंद्रभागा नदी घाट / Chandrabhaga River Ghat", dist: "६०० मीटर (१० मिनिटे चालत) / 600m (10 mins walk)", desc: "भक्त दर्शनाला जाण्यापूर्वी चंद्रभागेच्या पवित्र पात्रात स्नान करतात. / Sacred river ghat where devotees take holy baths before darshan." },
        { name: "इस्कॉन मंदिर / ISKCON Temple", dist: "१.५ किमी (१५ मिनिटे चालत) / 1.5 km (15 mins walk)", desc: "नदीच्या दुसऱ्या तीरावर असलेले निसर्गरम्य इस्कॉन मंदिर संकुल. / Beautiful ISKCON temple located across the Chandrabhaga river." }
      ]
    },
    {
      category: "वाहतूक सोयी / Transit & Transport",
      icon: Train,
      items: [
        { name: "पंढरपूर रेल्वे स्टेशन / Pandharpur Railway Station", dist: "२.० किमी / 2.0 km", desc: "विविध शहरांमधून येणाऱ्या गाड्यांसाठी रेल्वे स्थानक. ऑटो रिक्षा सहज उपलब्ध. / Local railway station connected to major state routes. Autos available easily." },
        { name: "पंढरपूर एसटी बस स्थानक / Pandharpur Bus Stand", dist: "१.८ किमी / 1.8 km", desc: "महाराष्ट्र आणि शेजारील राज्यांमधून येणाऱ्या बसेससाठी मुख्य स्थानक. / Main bus terminal with state transport connections." }
      ]
    },
    {
      category: "इतर आवश्यक सेवा / Other Facilities",
      icon: PlusCircle,
      items: [
        { name: "शाकाहारी भोजनालये / Pure Veg Restaurants", dist: "५० - २०० मीटर / 50m - 200m", desc: "भक्त निवासाच्या जवळ उपवासाचे पदार्थ व शुद्ध शाकाहारी थाळी देणारे उत्तम रेस्टॉरंट्स उपलब्ध आहेत. / Great restaurants serving delicious pure vegetarian meals and fasting items nearby.", customIcon: Utensils },
        { name: "सरकारी रुग्णालय आणि फार्मसी / Government Hospital & Medicals", dist: "५०० मीटर / 500m", desc: "२४ तास चालू असणारी औषधांची दुकाने आणि आपत्कालीन वैद्यकीय सोयी. / 24-hour medical stores and emergency healthcare facilities.", customIcon: PlusCircle },
        { name: "एटीएम केंद्र / ATM Counters", dist: "१०० मीटर / 100m", desc: "स्टेट बँक आणि बँक ऑफ बडोदाचे एटीएम मोजक्या पावलांवर उपलब्ध. / ATMs of major national banks located in immediate walking distance.", customIcon: CreditCard }
      ]
    }
  ];

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("nav.nearby")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            पंढरपूर देवस्थान आणि परिसरातील आवश्यक ठिकाणांची माहिती / Local guide and nearby facilities.
          </p>
        </div>

        {/* Places List */}
        <div className="space-y-12">
          {places.map((section, secIdx) => {
            const SectionIcon = section.icon;
            return (
              <div key={secIdx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#D4AF37]/25 pb-3">
                  <div className="p-2 bg-[#EA580C]/10 text-[#EA580C] rounded-lg">
                    <SectionIcon className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-gray-800">
                    {section.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((place, placeIdx) => {
                    return (
                      <div 
                        key={placeIdx} 
                        className="bg-white p-5 rounded-xl border border-[#D4AF37]/15 shadow-sm space-y-2 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-serif font-bold text-gray-800 text-base">
                            {place.name}
                          </h3>
                          <span className="text-xs bg-[#FFF8E7] text-[#EA580C] px-2.5 py-1 rounded-full border border-[#D4AF37]/20 font-semibold shrink-0">
                            {place.dist}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                          {place.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

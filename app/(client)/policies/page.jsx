"use client";

import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { Info, Clock, AlertTriangle, FileText, Ban } from "lucide-react";

export default function PoliciesPage() {
  const { t } = useTranslation();

  const policySections = [
    {
      title: "चेक-इन आणि चेक-आउट / Check-in & Check-out",
      icon: Clock,
      items: [
        "चेक-इन वेळ: दुपारी १२:०० वाजता (Check-in: 12:00 PM)",
        "चेक-आउट वेळ: सकाळी ११:०० वाजता (Check-out: 11:00 AM)",
        "लवकर चेक-इन किंवा उशिरा चेक-आउट केवळ खोलीच्या उपलब्धतेवर अवलंबून असेल आणि अतिरिक्त शुल्क लागू होऊ शकते. / Early check-in or late check-out is subject to availability and might incur charges."
      ]
    },
    {
      title: "ओळखपत्र आणि नोंदणी / Identification & Registration",
      icon: FileText,
      items: [
        "सर्व प्रौढ पाहुण्यांसाठी सरकारी ओळखपत्र (आधार कार्ड, मतदार ओळखपत्र, ड्रायव्हिंग लायसन्स किंवा पासपोर्ट) देणे बंधनकारक आहे. पॅन कार्ड स्वीकारले जाणार नाही. / Valid government-issued ID proof (Aadhaar, Voter ID, Driving License, or Passport) is mandatory for all adult guests. PAN Card is not accepted.",
        "परदेशी नागरिकांना वैध पासपोर्ट आणि व्हिसा सादर करावा लागेल. / Foreign nationals must present a valid passport and tourist visa."
      ]
    },
    {
      title: "रद्दीकरण आणि परतावा / Cancellation & Refund",
      icon: AlertTriangle,
      items: [
        "चेक-इनच्या ४८ तास आधी बुकिंग रद्द केल्यास १००% परतावा दिला जाईल. / Free cancellation up to 48 hours before check-in.",
        "२४ ते ४८ तासांच्या दरम्यान बुकिंग रद्द केल्यास ५०% परतावा मिळेल. / 50% refund for cancellations made between 24 and 48 hours prior to check-in.",
        "चेक-इनच्या २४ तासांच्या आत बुकिंग रद्द केल्यास किंवा हजर न राहिल्यास (No Show) कोणताही परतावा मिळणार नाही. / Cancellations within 24 hours of check-in are strictly non-refundable."
      ]
    },
    {
      title: "भक्त निवास नियमावली / General Rules",
      icon: Ban,
      items: [
        "भक्त निवासाच्या आवारात आणि खोल्यांमध्ये मद्यपान, मांसाहार आणि धूम्रपान करण्यास सक्त मनाई आहे. / Alcohol consumption, non-vegetarian food, and smoking are strictly prohibited within the premises.",
        "पाळीव प्राण्यांना (Pets) राहण्याची परवानगी नाही. / Pets are not allowed inside the rooms or building.",
        "शांतता पाळावी आणि इतर भाविकांच्या मुक्कामात व्यत्यय येणार नाही याची काळजी घ्यावी. / Kindly maintain peace and respect other pilgrims' quiet time.",
        "खोलीतील किंवा भक्त निवासाच्या मालमत्तेचे नुकसान केल्यास नुकसानभरपाई द्यावी लागेल. / Any damage to property during the stay will be charged to the guest."
      ]
    }
  ];

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("nav.policies")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            आमच्या भक्त निवासातील सुखकर प्रवासासाठी नियम व अटी / Terms and conditions for a pleasant stay.
          </p>
        </div>

        {/* Policies Sections */}
        <div className="space-y-8">
          {policySections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 sm:p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-[#D4AF37]/15 pb-3">
                  <Icon className="h-5 w-5 text-[#EA580C]" />
                  <h2 className="font-serif text-xl font-bold text-gray-800">
                    {sec.title}
                  </h2>
                </div>
                <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {sec.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

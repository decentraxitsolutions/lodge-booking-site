"use client";

import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQPage() {
  const { t } = useTranslation();

  const faqs = [
    {
      q: "भक्त निवासाची विठ्ठल मंदिरापासूनचे अंतर किती आहे? / What is the distance to the Vitthal Temple?",
      a: "श्री साई विठ्ठल भक्त निवास हे विठ्ठल रुक्मिणी मुख्य मंदिरापासून चालत अवघ्या ५ मिनिटांच्या अंतरावर (सुमारे ३०० मीटर) स्थित आहे. / Shri Sai Vitthal Bhakt Niwas is located just a 5-minute walk (approx. 300 meters) from the main Vitthal Rukmini Temple."
    },
    {
      q: "चेक-इन आणि चेक-आउट वेळ काय आहे? / What is the check-in and check-out timing?",
      a: "आमची चेक-इन वेळ दुपारी १२:०० वाजता आहे आणि चेक-आउट वेळ सकाळी ११:०० वाजता आहे. उपलब्धता असल्यास लवकर चेक-इन करण्याची सोय केली जाऊ शकते. / Our check-in time is 12:00 PM and check-out time is 11:00 AM. Early check-in can be accommodated subject to availability."
    },
    {
      q: "पार्किंगची सोय उपलब्ध आहे का? / Is parking facility available?",
      a: "होय, भक्त निवासात येणाऱ्या सर्व भाविकांच्या गाड्यांसाठी आणि बसेससाठी मोफत आणि सुरक्षित पार्किंग व्यवस्था उपलब्ध आहे. / Yes, we offer free and secure parking space for all guest cars and pilgrim buses."
    },
    {
      q: "बुकिंग रद्द करण्याचे काय धोरण आहे? / What is the cancellation policy?",
      a: "चेक-इनच्या ४८ तास आधी बुकिंग रद्द केल्यास १००% परतावा दिला जाईल. त्यांनतर २४-४८ तासांत रद्द केल्यास ५०% आणि २४ तासांच्या आत रद्द केल्यास कोणताही परतावा दिला जाणार नाही. / You can cancel for free up to 48 hours before check-in. Cancellation within 24-48 hours incurs a 50% charge, and cancellation within 24 hours is non-refundable."
    },
    {
      q: "गरम पाण्याची आणि लिफ्टची सुविधा आहे का? / Do you provide hot water and elevator access?",
      a: "होय, सर्व मजल्यांवर जाण्यासाठी २४ तास लिफ्ट उपलब्ध आहे. तसेच भाविकांच्या पहाटेच्या स्नानासाठी सकाळी गरम पाण्याची उत्तम सोय उपलब्ध आहे. / Yes, we have 24/7 elevator access connecting all floors. Hot water is supplied in the mornings for early morning baths before temple visits."
    },
    {
      q: "आम्ही मुक्काम ऑनलाइन बुक करू शकतो का? / Can we book our stay online?",
      a: "होय, तुम्ही आमच्या या अधिकृत संकेतस्थळावरून तारखा निवडून खोल्या थेट बुक करू शकता. / Yes, you can book rooms directly by selecting your dates and rooms on this official website."
    }
  ];

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-3xl px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("faq.title")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-6 rounded-xl border border-[#D4AF37]/25 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#D4AF37]/15">
                <AccordionTrigger className="text-left font-serif text-base font-bold text-gray-800 hover:text-[#EA580C] transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4 pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </div>
  );
}

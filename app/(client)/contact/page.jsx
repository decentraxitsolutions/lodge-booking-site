"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Details & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-gray-800 border-b border-[#D4AF37]/15 pb-3">
                {t("nav.contact")}
              </h2>
              
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-[#EA580C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-850 text-sm">{t("home.address")}</h4>
                  <p className="text-sm text-gray-600 mt-1">LIC Road, Opposite Vitthal Rukmini Bhakt Niwas, Pandharpur, Maharashtra 413304</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-[#EA580C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-850 text-sm">Direct Phone</h4>
                  <a href="tel:+919876543210" className="text-sm text-[#EA580C] hover:underline font-semibold block mt-1">
                    {t("home.phone")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-850 text-sm">WhatsApp Assistance</h4>
                  <a 
                    href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20inquire%20about%20booking%20rooms%20at%20Shri%20Sai%20Vitthal%20Bhakt%20Niwas."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:underline font-semibold block mt-1"
                  >
                    Click to Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-[#EA580C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-850 text-sm">Email Address</h4>
                  <a href="mailto:info@saivitthalbhaktniwas.com" className="text-sm text-gray-600 hover:underline mt-1 block">
                    info@saivitthalbhaktniwas.com
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Embed (Visual Wow) */}
            <div className="rounded-xl overflow-hidden border border-[#D4AF37]/25 shadow-sm h-64 bg-gray-150 relative">
              <iframe
                title="Shri Sai Vitthal Bhakt Niwas Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d944.233216885153!2d75.3291042213521!3d17.671735341395102!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc4181b2b2f5185%3A0x3928fc933bf3057b!2sM8CH%2BWR2%2C%20Bhakti%20Marg%2C%20Juni%20Peth%2C%20Visthapit%20Nagar%2C%20Pandharpur%2C%20Maharashtra%20413304!5e1!3m2!1sen!2sin!4v1784880559522!5m2!1sen!2sin"
                className="w-full h-full border-none"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="bg-white p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-800">{t("contact.formTitle")} Sent</h3>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">
                  {t("contact.successMsg")}
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#EA580C] text-white hover:bg-[#C2410C]"
                >
                  Send another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800 border-b border-[#D4AF37]/15 pb-3">
                  {t("contact.formTitle")}
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("contact.name")}</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-[#D4AF37]/35 focus:ring-[#EA580C] h-10 bg-[#FFF8E7]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("contact.phone")}</label>
                  <Input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-[#D4AF37]/35 focus:ring-[#EA580C] h-10 bg-[#FFF8E7]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("contact.email")}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-[#D4AF37]/35 focus:ring-[#EA580C] h-10 bg-[#FFF8E7]/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t("contact.message")}</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-[#D4AF37]/35 focus:ring-[#EA580C] min-h-32 bg-[#FFF8E7]/30"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#EA580C] text-white hover:bg-[#C2410C] h-11 text-sm font-bold shadow flex items-center justify-center gap-2"
                >
                  {loading ? "Sending..." : t("contact.sendMessage")}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

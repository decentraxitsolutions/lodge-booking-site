"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#1F1914] text-[#FFF8E7]/90 py-12">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-serif text-xl font-semibold text-[#D4AF37]">
            श्री साई विठ्ठल भक्त निवास
          </h3>
          <p className="text-xs text-[#FFF8E7]/60 font-mono tracking-widest uppercase">
            Shri Sai Vitthal Bhakt Niwas
          </p>
          <p className="text-sm mt-2 text-[#FFF8E7]/70">
            {t("home.footerText")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-[#D4AF37] mb-4 text-sm uppercase tracking-wider">
            {t("home.quickInfo")}
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-[#F97316] transition-colors">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-[#F97316] transition-colors">
                {t("nav.rooms")}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[#F97316] transition-colors">
                {t("nav.gallery")}
              </Link>
            </li>
            <li>
              <Link href="/facilities" className="hover:text-[#F97316] transition-colors">
                {t("nav.facilities")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h4 className="font-semibold text-[#D4AF37] mb-4 text-sm uppercase tracking-wider">
            {t("nav.policies")}
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/policies" className="hover:text-[#F97316] transition-colors">
                {t("nav.policies")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#F97316] transition-colors">
                {t("faq.title")}
              </Link>
            </li>
            <li>
              <Link href="/nearby" className="hover:text-[#F97316] transition-colors">
                {t("nav.nearby")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#F97316] transition-colors">
                {t("nav.blog")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 text-sm">
          <h4 className="font-semibold text-[#D4AF37] mb-1 text-sm uppercase tracking-wider">
            {t("nav.contact")}
          </h4>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" />
            <span className="text-[#FFF8E7]/80">{t("home.address")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#F97316]" />
            <a href="tel:+919876543210" className="hover:underline text-[#FFF8E7]/85">
              {t("home.phone")}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#F97316]" />
            <a href="mailto:info@saivitthalbhaktniwas.com" className="hover:underline text-[#FFF8E7]/85">
              info@saivitthalbhaktniwas.com
            </a>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline mt-2"
          >
            Open in Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>

      </div>

      <div className="mx-auto max-w-6xl px-6 border-t border-[#D4AF37]/10 mt-10 pt-6 text-center text-xs text-[#FFF8E7]/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Shri Sai Vitthal Bhakt Niwas. All Rights Reserved.</p>
        <p className="font-serif">जय हरी विठ्ठल | ओम साई राम</p>
      </div>
    </footer>
  );
}

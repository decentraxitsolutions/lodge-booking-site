import React from "react";
import Header from "@/components/HeaderComponents/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";

export default function ClientLayout({ children }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-[#FFF8E7] text-[#374151]">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

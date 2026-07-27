"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ArrowRight, Globe } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/LanguageContext";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

export default function HeaderClient({ user, navLinks, brand }) {
    const [scrolled, setScrolled] = useState(false);
    const { language, toggleLanguage, t } = useTranslation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isAdminOrStaff = user && (user.role === "ADMIN" || user.role === "RECEPTION_STAFF");

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#EA580C] shadow-lg border-b border-[#D4AF37]/35 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 sm:px-10">
                
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 text-white group">
                    <img 
                        src="/logo.jpg" 
                        alt="Shri Sai Vitthal Brand Logo" 
                        className="h-9 w-9 rounded-full border border-[#D4AF37]/50 shadow-md object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="flex flex-col">
                        <span className="font-serif text-base sm:text-lg font-bold tracking-wide leading-tight text-[#FFF8E7] group-hover:text-[#D4AF37] transition-colors">
                            {brand.name}
                        </span>
                        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#FFF8E7]/70 leading-none mt-0.5">
                            {brand.subline}
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-white/90 transition-colors hover:text-[#FFF8E7] hover:underline decoration-[#D4AF37] decoration-2 underline-offset-4"
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                    {isAdminOrStaff && (
                        <Link
                            href="/admin/dashboard"
                            className="text-sm font-semibold text-[#D4AF37] hover:text-white transition-colors bg-white/10 px-3 py-1 rounded"
                        >
                            {t("nav.dashboard")}
                        </Link>
                    )}
                </nav>

                {/* Desktop Actions (Auth + Language) */}
                <div className="hidden items-center gap-4 md:flex">
                    
                    {/* Language Switcher Button */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 text-xs text-white bg-white/15 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/25 transition-all"
                        title="Switch Language / भाषा बदला"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        <span>{language === "en" ? "मराठी" : "English"}</span>
                    </button>

                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/15 hover:text-white"
                            >
                                {t("nav.login")}
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="bg-[#D4AF37] text-[#1F1914] font-semibold hover:bg-[#FFF8E7] hover:text-[#EA580C] shadow border border-[#D4AF37]/50">
                                {t("nav.bookStay")}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </SignUpButton>
                    </Show>

                    <Show when="signed-in">
                        <div className="flex items-center gap-3">
                            <Link href="/my-bookings">
                                <Button variant="ghost" className="text-white text-xs hover:bg-white/10 hover:text-white">
                                    {t("nav.myBookings")}
                                </Button>
                            </Link>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9 border-2 border-[#D4AF37]",
                                    },
                                }}
                            />
                        </div>
                    </Show>

                </div>

                {/* Mobile Menu & Language Toggle */}
                <div className="flex items-center gap-3 md:hidden">
                    
                    {/* Mobile Language switch */}
                    <button
                        onClick={toggleLanguage}
                        className="p-2 text-white bg-white/10 rounded-full border border-white/20"
                        title="Switch Language"
                    >
                        <Globe className="h-4 w-4" />
                    </button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 hover:text-white"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        
                        <SheetContent
                            side="right"
                            className="flex w-full flex-col bg-[#FFF8E7] text-[#374151] border-l border-[#D4AF37]/20 sm:max-w-sm"
                        >
                            {/* Mobile Navigation Header */}
                            <div className="mt-4 flex flex-col">
                                <span className="font-serif text-xl font-bold text-[#EA580C]">
                                    {brand.name}
                                </span>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-[#374151]/60">
                                    {brand.subline}
                                </span>
                            </div>
                            
                            <nav className="mt-8 flex flex-col gap-5">
                                {navLinks.map((link) => (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="font-serif text-xl text-[#374151] hover:text-[#EA580C] py-1 border-b border-[#374151]/10 transition-colors"
                                        >
                                            {t(link.labelKey)}
                                        </Link>
                                    </SheetClose>
                                ))}
                                {isAdminOrStaff && (
                                    <SheetClose asChild>
                                        <Link
                                            href="/admin/dashboard"
                                            className="font-serif text-xl text-[#EA580C] hover:text-[#EA580C] py-1 border-b border-[#374151]/10 transition-colors font-bold"
                                        >
                                            {t("nav.dashboard")}
                                        </Link>
                                    </SheetClose>
                                )}
                            </nav>

                            <div className="mt-auto flex flex-col gap-4 pb-8 border-t border-[#D4AF37]/20 pt-6">
                                <Show when="signed-out">
                                    <SignInButton mode="modal">
                                        <Button
                                            variant="outline"
                                            className="w-full border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white"
                                        >
                                            {t("nav.login")}
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <Button className="w-full bg-[#EA580C] text-white hover:bg-[#EA580C]/90">
                                            {t("nav.bookStay")}
                                        </Button>
                                    </SignUpButton>
                                </Show>
                                <Show when="signed-in">
                                    <div className="flex flex-col gap-4">
                                        <SheetClose asChild>
                                            <Link href="/my-bookings" className="w-full">
                                                <Button variant="outline" className="w-full border-[#374151]/20">
                                                    {t("nav.myBookings")}
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                        <div className="flex items-center gap-3">
                                            <UserButton afterSignOutUrl="/" />
                                            <span className="text-sm text-[#374151]/70 font-medium">
                                                Account Settings
                                            </span>
                                        </div>
                                    </div>
                                </Show>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    );
}
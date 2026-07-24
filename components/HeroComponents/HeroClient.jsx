"use client";

// app/components/HeroComponents/HeroClient.jsx
// Client Component — owns everything that needs the browser: scroll-driven
// reveals, the booking form's local state, and interactive handlers.
// Receives all copy/content as props from the server-rendered Hero.jsx.

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, CalendarDays, Users2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

/**
 * Signature element: a hand-drawn topographic contour line used as the
 * section divider throughout the hero. It's not decoration — the lodge
 * sits on a ridge, so "elevation lines" separating each section is the
 * one visual idea this page repeats and is remembered by.
 */
function ContourDivider({ elevationLabel }) {
    return (
        <div className="relative h-16 w-full overflow-hidden" aria-hidden="true">
            <svg
                viewBox="0 0 1200 64"
                preserveAspectRatio="none"
                className="h-full w-full"
            >
                <path
                    d="M0,32 C120,10 180,54 300,32 C420,10 480,54 600,30 C720,8 800,50 900,30 C1000,12 1100,48 1200,28"
                    fill="none"
                    stroke="#6E7B5E"
                    strokeWidth="1.25"
                    strokeOpacity="0.55"
                />
                <path
                    d="M0,42 C140,24 220,58 340,40 C460,22 540,58 660,38 C780,20 860,54 980,36 C1060,24 1140,44 1200,34"
                    fill="none"
                    stroke="#6E7B5E"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                />
            </svg>
            {elevationLabel ? (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-[#6E7B5E]">
                    {elevationLabel}
                </span>
            ) : null}
        </div>
    );
}

/** Small helper: fades + rises a section into view once, on first scroll-into-viewport. */
function useRevealOnScroll() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Respect reduced-motion users by just showing content immediately.
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

function RevealSection({ as: Tag = "div", className = "", children, ...rest }) {
    const { ref, visible } = useRevealOnScroll();
    return (
        <Tag
            ref={ref}
            className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default function HeroClient({
    content,
    bookingDefaults,
    highlights,
    closingQuote,
}) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [submitting, setSubmitting] = useState(false);

    const handleCheckAvailability = useCallback(
        async (e) => {
            e.preventDefault();
            if (!checkIn || !checkOut) return;
            setSubmitting(true);
            try {
                // Wire this up to your booking/availability API route, e.g.:
                // await fetch("/api/availability", { method: "POST", body: JSON.stringify({ checkIn, checkOut, guests }) });
                console.log("Checking availability", { checkIn, checkOut, guests });
            } finally {
                setSubmitting(false);
            }
        },
        [checkIn, checkOut, guests]
    );

    return (
        <div className="bg-[#F0E9D8] font-body text-[#2A2118]">
            {/* ---------- 1. Opening banner ---------- */}
            <section
                id="hero-top"
                className="relative flex min-h-[92vh] w-full flex-col justify-end overflow-hidden bg-[#152018] text-[#F0E9D8]"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${content.backgroundImage})` }}
                    role="img"
                    aria-label={content.backgroundAlt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1712] via-[#0F1712]/40 to-transparent" />

                <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-40 sm:px-10">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#C97A3D]">
                        {content.eyebrow}
                    </p>
                    <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        {content.headline}
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F0E9D8]/85 sm:text-lg">
                        {content.subhead}
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <Button
                            render={
                                <a
                                    href={content.primaryCta.href}
                                    className="bg-[#C97A3D] text-[#F0E9D8] hover:bg-[#B36A31]"
                                />
                            }
                            size="lg"
                            nativeButton={false}
                        >
                            {content.primaryCta.label}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            render={
                                <a
                                    href={content.secondaryCta.href}
                                    className="text-[#F0E9D8] hover:bg-white/10 hover:text-[#F0E9D8]"
                                />
                            }
                            variant="ghost"
                            size="lg"
                            nativeButton={false}
                        >
                            {content.secondaryCta.label}
                        </Button>
                    </div>
                </div>
            </section>

            {/* ---------- 2. Booking widget, overlapping the banner ---------- */}
            <section id="book" className="relative z-20 mx-auto -mt-12 w-full max-w-4xl px-6 sm:px-10">
                <RevealSection>
                    <Card className="border-none bg-[#F0E9D8] shadow-xl">
                        <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:p-8">
                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#6E7B5E]">
                                    <CalendarDays className="h-3.5 w-3.5" /> Check in
                                </span>
                                <Input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="border-[#6E7B5E]/40 bg-white/60"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#6E7B5E]">
                                    <CalendarDays className="h-3.5 w-3.5" /> Check out
                                </span>
                                <Input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn || undefined}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="border-[#6E7B5E]/40 bg-white/60"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#6E7B5E]">
                                    <Users2 className="h-3.5 w-3.5" /> Guests
                                </span>
                                <Input
                                    type="number"
                                    min={1}
                                    max={bookingDefaults.guestCap}
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="w-24 border-[#6E7B5E]/40 bg-white/60"
                                />
                            </label>

                            <Button
                                onClick={handleCheckAvailability}
                                disabled={submitting || !checkIn || !checkOut}
                                className="h-10 bg-[#152018] text-[#F0E9D8] hover:bg-[#0F1712]"
                            >
                                {submitting ? "Checking…" : "Check availability"}
                            </Button>
                        </CardContent>
                    </Card>
                </RevealSection>
            </section>

            <ContourDivider elevationLabel="6,200 FT" />

            {/* ---------- 3. Highlights ---------- */}
            <section id="gallery" className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10">
                <RevealSection>
                    <h2 className="font-display text-3xl text-[#2A2118] sm:text-4xl">
                        What the days actually look like
                    </h2>
                </RevealSection>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {highlights.map((item, i) => (
                        <RevealSection
                            key={item.id}
                            style={{ transitionDelay: `${i * 100}ms` }}
                            className="rounded-lg border border-[#6E7B5E]/25 bg-white/40 p-6"
                        >
                            <p className="font-mono text-[11px] uppercase tracking-widest text-[#C97A3D]">
                                {item.label}
                            </p>
                            <h3 className="mt-3 font-display text-xl text-[#2A2118]">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#2A2118]/70">
                                {item.body}
                            </p>
                        </RevealSection>
                    ))}
                </div>
            </section>

            <ContourDivider />

            {/* ---------- 4. Closing quote ---------- */}
            <section className="bg-[#152018] px-6 py-24 text-[#F0E9D8] sm:px-10">
                <RevealSection className="mx-auto flex max-w-2xl flex-col items-center text-center">
                    <Quote className="h-6 w-6 text-[#C97A3D]" />
                    <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
                        “{closingQuote.quote}”
                    </p>
                    <p className="mt-5 font-mono text-xs uppercase tracking-widest text-[#F0E9D8]/60">
                        {closingQuote.attribution}
                    </p>
                </RevealSection>
            </section>
        </div>
    );
}
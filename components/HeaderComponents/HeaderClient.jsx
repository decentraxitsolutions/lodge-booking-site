"use client";

// app/components/HeaderComponents/HeaderClient.jsx
// Client Component — scroll listener + mobile menu state need the browser,
// and Clerk's components/hooks are client-only, so both live here.
//
// A note on Clerk's API surface: this uses `<Show>` as requested, with a
// `when="signedIn" | "signedOut"` prop — that's my best-effort guess at
// the shape based on the name alone, NOT a confirmed API (no web access
// in this chat, and this may postdate my training data). If your actual
// `Show` signature differs — a boolean prop, a render-function child,
// something else — this will throw or silently no-op. Check it against
// `node_modules/@clerk/nextjs`'s types before shipping.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, TreePine, ArrowRight } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

export default function HeaderClient({ user, navLinks, brand }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled
                ? "bg-[#152018]/90 backdrop-blur-md shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-[#F0E9D8]">
                    <TreePine className="h-5 w-5 text-[#C97A3D]" />
                    <span className="font-display text-lg leading-none tracking-tight">
                        {brand.name}
                        <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C97A3D]">
                            {brand.subline}
                        </span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-[#F0E9D8]/85 transition-colors hover:text-[#F0E9D8]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop right side: auth */}
                <div className="hidden items-center gap-3 md:flex">
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <Button
                                variant="ghost"
                                className="text-[#F0E9D8] hover:bg-white/10 hover:text-[#F0E9D8]"
                            >
                                Log in
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="bg-[#C97A3D] text-[#F0E9D8] hover:bg-[#B36A31]">
                                Book a stay
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9",
                                },
                            }}
                        />
                    </Show>
                </div>

                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger render={
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#F0E9D8] hover:bg-white/10 hover:text-[#F0E9D8] md:hidden"
                            aria-label="Open menu"
                        />
                    }>
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="flex w-full flex-col bg-[#F0E9D8] text-[#2A2118] sm:max-w-sm"
                    >
                        <nav className="mt-10 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <SheetClose render={
                                    <Link
                                        href={link.href}
                                        className="font-display text-2xl text-[#2A2118]"
                                    />
                                } key={link.href}>
                                    {link.label}
                                </SheetClose>
                            ))}
                        </nav>

                        <div className="mt-auto flex flex-col gap-3 pb-8">
                            <Show when="signedOut">
                                <SignInButton mode="modal">
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#2A2118]/20"
                                    >
                                        Log in
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button className="w-full bg-[#C97A3D] text-[#F0E9D8] hover:bg-[#B36A31]">
                                        Book a stay
                                    </Button>
                                </SignUpButton>
                            </Show>
                            <Show when="signedIn">
                                <div className="flex items-center gap-3">
                                    <UserButton afterSignOutUrl="/" />
                                    <span className="text-sm text-[#2A2118]/70">
                                        Manage your account
                                    </span>
                                </div>
                            </Show>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
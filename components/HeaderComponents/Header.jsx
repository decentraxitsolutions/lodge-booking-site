// app/components/HeaderComponents/Header.jsx
// Server Component — no "use client" directive. Mirrors the same split
// used in HeroComponents: this file owns static content (nav links, logo
// copy) and hands it to the interactive client half, which is where Clerk
// and scroll listeners live (both need the browser).

import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./HeaderClient";

const NAV_LINKS = [
    { label: "Rooms", href: "/rooms" },
    { label: "The lodge", href: "/#gallery" },
    { label: "Trails", href: "/trails" },
    { label: "Journal", href: "/journal" },
];

const BRAND = {
    name: "Ridgeline",
    subline: "Lodge",
};

export default async function Header() {
    const user = await checkUser();
    return (
        <HeaderClient user={user} navLinks={NAV_LINKS} brand={BRAND} />
    );
}
// app/components/HeaderComponents/Header.jsx
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./HeaderClient";

const NAV_LINKS = [
    { labelKey: "nav.rooms", href: "/rooms" },
    { labelKey: "nav.gallery", href: "/gallery" },
    { labelKey: "nav.facilities", href: "/facilities" },
    { labelKey: "nav.about", href: "/about" },
    { labelKey: "nav.contact", href: "/contact" },
];

const BRAND = {
    name: "श्री साई विठ्ठल",
    subline: "भक्त निवास",
};

export default async function Header() {
    const user = await checkUser();
    return (
        <HeaderClient user={user} navLinks={NAV_LINKS} brand={BRAND} />
    );
}
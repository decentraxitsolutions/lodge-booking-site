// app/components/HeroComponents/Hero.jsx
// Server Component — no "use client" directive.
// Owns the hero's content (copy, images, section data). In a real app this
// is where you'd fetch from a CMS / DB (e.g. `await getFeaturedLodges()`)
// since server components can be async. Everything here is serializable
// props handed down to the interactive client half.

import HeroClient from "./HeroClient";

// ---- Design tokens used across Hero + Header -------------------------
// Add these to tailwind.config.js under theme.extend if you want the
// short utility names instead of arbitrary values:
//
// colors: {
//   forest:   "#152018", // near-black spruce green — base ground
//   parchment:"#F0E9D8", // warm paper — light sections
//   ember:    "#C97A3D", // signature accent — lantern/firelight
//   moss:     "#6E7B5E", // secondary accent — muted sage
//   bark:     "#3A2E22", // deep brown — text on parchment
// },
// fontFamily: {
//   display: ["var(--font-fraunces)", "serif"],
//   body:    ["var(--font-work-sans)", "sans-serif"],
// }
// -----------------------------------------------------------------------

const HERO_CONTENT = {
    eyebrow: "Nestled at 6,200ft — Bitter Root Valley",
    headline: "Sleep where the tree line ends.",
    subhead:
        "A ten-room timber lodge built into the ridge, three miles from the nearest road. Fires lit nightly, trails mapped by hand, nothing paved.",
    primaryCta: { label: "Check availability", href: "#book" },
    secondaryCta: { label: "Walk through the lodge", href: "#gallery" },
    backgroundImage: "/images/hero-lodge-dusk.jpg",
    backgroundAlt:
        "Timber lodge lit from within at dusk, surrounded by pine ridge",
};

const BOOKING_DEFAULTS = {
    minNights: 2,
    guestCap: 8,
};

const HIGHLIGHTS = [
    {
        id: "fireside",
        label: "Every evening",
        title: "Fireside dinners",
        body: "Six courses, one long table, whatever the valley gave up that day.",
    },
    {
        id: "trails",
        label: "12 marked routes",
        title: "Guided trail mornings",
        body: "A wrangler-turned-guide leads two routes daily, ridge or river.",
    },
    {
        id: "soak",
        label: "Private, wood-fired",
        title: "Cedar hot tubs",
        body: "One per room, filled at dusk, no shared soaking pools.",
    },
];

const CLOSING_QUOTE = {
    quote:
        "We came for one night and stayed four. Nobody at the front desk asked why.",
    attribution: "R. Alvarez, guest — Room 6",
};

export default function Hero() {
    return (
        <HeroClient
            content={HERO_CONTENT}
            bookingDefaults={BOOKING_DEFAULTS}
            highlights={HIGHLIGHTS}
            closingQuote={CLOSING_QUOTE}
        />
    );
}
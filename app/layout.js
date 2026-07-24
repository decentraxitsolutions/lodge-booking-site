import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Shri Sai Vitthal Bhakt Niwas - Pandharpur Stay",
  description: "Bilingual (Marathi + English) Booking & Information website for pilgrims in Pandharpur, opposite Vitthal Rukmini Bhakt Niwas.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={inter.className}
      >
        <body suppressHydrationWarning className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KLS Logistics",
  description:
    "KLS Logistics - Global shipping and logistics solutions. Reliable freight forwarding, customs clearance, and real-time tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="bg-white font-sans text-gray-900 antialiased">{children}</body>
    </html>
  );
}


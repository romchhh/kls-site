import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Unbounded } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "KLS Logistics",
  description:
    "KLS Logistics - Global shipping and logistics solutions. Reliable freight forwarding, customs clearance, and real-time tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={unbounded.variable}>
      <body className="bg-white font-sans font-normal text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}


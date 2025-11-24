import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLS Logistics",
  description:
    "KLS Logistics - Global shipping and logistics solutions. Reliable freight forwarding, customs clearance, and real-time tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-white font-sans font-semibold text-gray-900 antialiased">{children}</body>
    </html>
  );
}


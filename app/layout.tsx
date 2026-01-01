import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Unbounded, Roboto } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-unbounded",
});

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "KLS Logistics - Global Shipping and Logistics Solutions",
    template: "%s | KLS Logistics",
  },
  description:
    "KLS Logistics - leading logistics company providing comprehensive shipping solutions from China to Ukraine and worldwide. Sea, air, and rail freight. Customs clearance, warehousing, sourcing services.",
  keywords: [
    "KLS Logistics",
    "shipping from China",
    "logistics Ukraine",
    "sea freight",
    "air freight",
    "rail transport",
    "customs clearance",
    "warehousing services",
    "delivery to Ukraine",
    "delivery to EU",
    "freight forwarding",
    "cargo transportation",
  ],
  authors: [{ name: "KLS Logistics" }],
  creator: "KLS Logistics",
  publisher: "KLS Logistics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international"),
  alternates: {
    canonical: "/",
    languages: {
      "uk-UA": "/ua",
      "ru-RU": "/ru",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "KLS Logistics",
    title: "KLS Logistics - Global Shipping and Logistics Solutions",
    description:
      "Leading logistics company providing comprehensive shipping solutions from China to Ukraine and worldwide. Sea, air, and rail freight.",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "KLS Logistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KLS Logistics - Global Shipping and Logistics Solutions",
    description:
      "Leading logistics company providing comprehensive shipping solutions from China to Ukraine and worldwide.",
    images: ["/favicon.png"],
    creator: "@klslogistics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  category: "logistics",
  classification: "Business",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14b8a6" },
    { media: "(prefers-color-scheme: dark)", color: "#14b8a6" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KLS Logistics",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${unbounded.variable} ${roboto.variable}`}>
      <body className="bg-white font-sans font-normal text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}


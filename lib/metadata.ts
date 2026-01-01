import { Metadata } from "next";
import { Locale } from "./translations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";

export function generateMetadata(locale: Locale, path?: string): Metadata {
  const baseUrl = `${siteUrl}/${locale}${path || ""}`;
  
  const metadataByLocale: Record<Locale, {
    title: string;
    description: string;
    keywords: string;
    openGraph: {
      title: string;
      description: string;
    };
  }> = {
    ua: {
      title: "KLS Logistics - Доставка з Китаю в Україну та по всьому світу",
      description: "KLS Logistics - провідна логістична компанія. Комплексна доставка вантажів з Китаю в Україну та країни ЄС. Морські, авіа та залізничні перевезення. Мито, складські послуги, пошук та закупівля в Китаї.",
      keywords: "доставка з Китаю, логістика Україна, морські перевезення, авіадоставка, залізничні перевезення, митне оформлення, складські послуги, доставка в Україну, доставка в ЄС, KLS Logistics",
      openGraph: {
        title: "KLS Logistics - Доставка з Китаю в Україну та по всьому світу",
        description: "Комплексна доставка вантажів з Китаю в Україну та країни ЄС. Морські, авіа та залізничні перевезення.",
      },
    },
    ru: {
      title: "KLS Logistics - Доставка из Китая в Украину и по всему миру",
      description: "KLS Logistics - ведущая логистическая компания. Комплексная доставка грузов из Китая в Украину и страны ЕС. Морские, авиа и железнодорожные перевозки. Таможенное оформление, складские услуги, поиск и закупка в Китае.",
      keywords: "доставка из Китая, логистика Украина, морские перевозки, авиадоставка, железнодорожные перевозки, таможенное оформление, складские услуги, доставка в Украину, доставка в ЕС, KLS Logistics",
      openGraph: {
        title: "KLS Logistics - Доставка из Китая в Украину и по всему миру",
        description: "Комплексная доставка грузов из Китая в Украину и страны ЕС. Морские, авиа и железнодорожные перевозки.",
      },
    },
    en: {
      title: "KLS Logistics - Shipping from China to Ukraine and Worldwide",
      description: "KLS Logistics - leading logistics company. Comprehensive cargo delivery from China to Ukraine and EU countries. Sea, air and rail transportation. Customs clearance, warehousing services, sourcing and procurement in China.",
      keywords: "shipping from China, logistics Ukraine, sea freight, air freight, rail transport, customs clearance, warehousing services, delivery to Ukraine, delivery to EU, KLS Logistics",
      openGraph: {
        title: "KLS Logistics - Shipping from China to Ukraine and Worldwide",
        description: "Comprehensive cargo delivery from China to Ukraine and EU countries. Sea, air and rail transportation.",
      },
    },
  };

  const meta = metadataByLocale[locale];

  return {
    title: {
      default: meta.title,
      template: `%s | KLS Logistics`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "KLS Logistics" }],
    creator: "KLS Logistics",
    publisher: "KLS Logistics",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        "uk-UA": `${siteUrl}/ua${path || ""}`,
        "ru-RU": `${siteUrl}/ru${path || ""}`,
        "en-US": `${siteUrl}/en${path || ""}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ua" ? "uk_UA" : locale === "ru" ? "ru_RU" : "en_US",
      url: baseUrl,
      siteName: "KLS Logistics",
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      images: [
        {
          url: `${siteUrl}/favicon.png`,
          width: 1200,
          height: 630,
          alt: "KLS Logistics",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      images: [`${siteUrl}/favicon.png`],
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
    verification: {
      // Додайте ваші коди верифікації тут, коли вони будуть доступні
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
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
}


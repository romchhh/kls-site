import { Metadata } from "next";
import { Locale } from "./translations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";

// Детальні метадані для головної сторінки
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
      title: "KLS Logistics - Доставка з Китаю в Україну та по всьому світу | Логістика",
      description: "KLS Logistics - провідна логістична компанія з доставки з Китаю. Комплексна доставка вантажів з Китаю в Україну та країни ЄС. Морські перевезення (FCL/LCL), авіадоставка, залізничні перевезення. Митне оформлення, складські послуги, пошук та закупівля в Китаї. Швидка та надійна логістика під ключ.",
      keywords: "доставка з Китаю, логістика Україна, морські перевезення, авіадоставка, залізничні перевезення, митне оформлення, складські послуги, доставка в Україну, доставка в ЄС, KLS Logistics, експедирування, FCL контейнери, LCL консолідація, доставка під ключ, логістична компанія, перевезення вантажів, міжнародні перевезення, експрес доставка, DDP DDU",
      openGraph: {
        title: "KLS Logistics - Доставка з Китаю в Україну та по всьому світу",
        description: "Комплексна доставка вантажів з Китаю в Україну та країни ЄС. Морські, авіа та залізничні перевезення. Митне оформлення та складські послуги.",
      },
    },
    ru: {
      title: "KLS Logistics - Доставка из Китая в Украину и по всему миру | Логистика",
      description: "KLS Logistics - ведущая логистическая компания по доставке из Китая. Комплексная доставка грузов из Китая в Украину и страны ЕС. Морские перевозки (FCL/LCL), авиадоставка, железнодорожные перевозки. Таможенное оформление, складские услуги, поиск и закупка в Китае. Быстрая и надежная логистика под ключ.",
      keywords: "доставка из Китая, логистика Украина, морские перевозки, авиадоставка, железнодорожные перевозки, таможенное оформление, складские услуги, доставка в Украину, доставка в ЕС, KLS Logistics, экспедирование, FCL контейнеры, LCL консолидация, доставка под ключ, логистическая компания, перевозка грузов, международные перевозки, экспресс доставка, DDP DDU",
      openGraph: {
        title: "KLS Logistics - Доставка из Китая в Украину и по всему миру",
        description: "Комплексная доставка грузов из Китая в Украину и страны ЕС. Морские, авиа и железнодорожные перевозки. Таможенное оформление и складские услуги.",
      },
    },
    en: {
      title: "KLS Logistics - Shipping from China to Ukraine and Worldwide | Logistics Services",
      description: "KLS Logistics - leading logistics company for shipping from China. Comprehensive cargo delivery from China to Ukraine and EU countries. Sea freight (FCL/LCL), air freight, rail transport. Customs clearance, warehousing services, sourcing and procurement in China. Fast and reliable turnkey logistics solutions.",
      keywords: "shipping from China, logistics Ukraine, sea freight, air freight, rail transport, customs clearance, warehousing services, delivery to Ukraine, delivery to EU, KLS Logistics, freight forwarding, FCL containers, LCL consolidation, turnkey delivery, logistics company, cargo transportation, international shipping, express delivery, DDP DDU",
      openGraph: {
        title: "KLS Logistics - Shipping from China to Ukraine and Worldwide",
        description: "Comprehensive cargo delivery from China to Ukraine and EU countries. Sea, air and rail transportation. Customs clearance and warehousing services.",
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
          url: `${siteUrl}/logos/ЛОГО(1).png`,
          width: 1200,
          height: 630,
          alt: "KLS Logistics",
          type: "image/png",
        },
      ],
      alternateLocale: [
        locale === "ua" ? undefined : "uk_UA",
        locale === "ru" ? undefined : "ru_RU",
        locale === "en" ? undefined : "en_US",
      ].filter(Boolean) as string[],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      images: [`${siteUrl}/logos/ЛОГО(1).png`],
      creator: "@klslogistics",
      site: "@klslogistics",
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
      "geo.region": "UA",
      "geo.placename": "Lviv",
      "geo.position": "49.8397;24.0297",
      "ICBM": "49.8397, 24.0297",
    },
  };
}

// Метадані для сторінок послуг
export function generateServiceMetadata(
  locale: Locale,
  serviceKey: string,
  serviceName: Record<Locale, string>,
  serviceDescription: Record<Locale, string>
): Metadata {
  const path = `/services/${serviceKey}`;
  const baseUrl = `${siteUrl}/${locale}${path}`;
  
  const keywordsByLocale: Record<Locale, string> = {
    ua: `KLS Logistics, ${serviceName.ua}, логістика, доставка з Китаю, ${serviceKey === "payments" ? "грошові перекази, Alipay, WeChat, оплата в Китай" : serviceKey === "forwarding" ? "експедирування, міжнародні перевезення" : serviceKey === "customs" ? "митне оформлення, таможня, митний брокер" : serviceKey === "warehousing" ? "складські послуги, зберігання, консолідація" : serviceKey === "insurance" ? "страхування вантажів, страхування перевезень" : serviceKey === "local" ? "локальна доставка в Китаї" : "закупівля в Китаї, sourcing"}`,
    ru: `KLS Logistics, ${serviceName.ru}, логистика, доставка из Китая, ${serviceKey === "payments" ? "денежные переводы, Alipay, WeChat, оплата в Китай" : serviceKey === "forwarding" ? "экспедирование, международные перевозки" : serviceKey === "customs" ? "таможенное оформление, таможня, таможенный брокер" : serviceKey === "warehousing" ? "складские услуги, хранение, консолидация" : serviceKey === "insurance" ? "страхование грузов, страхование перевозок" : serviceKey === "local" ? "локальная доставка в Китае" : "закупка в Китае, sourcing"}`,
    en: `KLS Logistics, ${serviceName.en}, logistics, shipping from China, ${serviceKey === "payments" ? "money transfers, Alipay, WeChat, payment to China" : serviceKey === "forwarding" ? "freight forwarding, international transportation" : serviceKey === "customs" ? "customs clearance, customs broker" : serviceKey === "warehousing" ? "warehousing services, storage, consolidation" : serviceKey === "insurance" ? "cargo insurance, transportation insurance" : serviceKey === "local" ? "local delivery in China" : "sourcing in China, procurement"}`,
  };

  return {
    title: `${serviceName[locale]} | KLS Logistics`,
    description: serviceDescription[locale],
    keywords: keywordsByLocale[locale],
    alternates: {
      canonical: baseUrl,
      languages: {
        "uk-UA": `${siteUrl}/ua${path}`,
        "ru-RU": `${siteUrl}/ru${path}`,
        "en-US": `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ua" ? "uk_UA" : locale === "ru" ? "ru_RU" : "en_US",
      url: baseUrl,
      siteName: "KLS Logistics",
      title: `${serviceName[locale]} | KLS Logistics`,
      description: serviceDescription[locale],
      images: [
        {
          url: `${siteUrl}/logos/ЛОГО(1).png`,
          width: 1200,
          height: 630,
          alt: `${serviceName[locale]} - KLS Logistics`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${serviceName[locale]} | KLS Logistics`,
      description: serviceDescription[locale],
      images: [`${siteUrl}/logos/ЛОГО(1).png`],
    },
  };
}

// Метадані для сторінок доставки
export function generateDeliveryMetadata(
  locale: Locale,
  deliveryKey: string,
  deliveryName: Record<Locale, string>,
  deliveryDescription: Record<Locale, string>
): Metadata {
  const path = `/delivery/${deliveryKey}`;
  const baseUrl = `${siteUrl}/${locale}${path}`;
  
  const keywordsByLocale: Record<Locale, string> = {
    ua: `KLS Logistics, ${deliveryName.ua}, доставка з Китаю, ${deliveryKey === "ukraine-turnkey" ? "доставка в Україну під ключ, FCL LCL контейнери" : deliveryKey === "international" ? "міжнародні перевезення, FCL LCL, мультимодальна доставка" : "доставка в ЄС, FBA, DDP, DDU, експрес доставка"}`,
    ru: `KLS Logistics, ${deliveryName.ru}, доставка из Китая, ${deliveryKey === "ukraine-turnkey" ? "доставка в Украину под ключ, FCL LCL контейнеры" : deliveryKey === "international" ? "международные перевозки, FCL LCL, мультимодальная доставка" : "доставка в ЕС, FBA, DDP, DDU, экспресс доставка"}`,
    en: `KLS Logistics, ${deliveryName.en}, shipping from China, ${deliveryKey === "ukraine-turnkey" ? "turnkey delivery to Ukraine, FCL LCL containers" : deliveryKey === "international" ? "international transportation, FCL LCL, multimodal delivery" : "delivery to EU, FBA, DDP, DDU, express delivery"}`,
  };

  return {
    title: `${deliveryName[locale]} | KLS Logistics`,
    description: deliveryDescription[locale],
    keywords: keywordsByLocale[locale],
    alternates: {
      canonical: baseUrl,
      languages: {
        "uk-UA": `${siteUrl}/ua${path}`,
        "ru-RU": `${siteUrl}/ru${path}`,
        "en-US": `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ua" ? "uk_UA" : locale === "ru" ? "ru_RU" : "en_US",
      url: baseUrl,
      siteName: "KLS Logistics",
      title: `${deliveryName[locale]} | KLS Logistics`,
      description: deliveryDescription[locale],
      images: [
        {
          url: `${siteUrl}/logos/ЛОГО(1).png`,
          width: 1200,
          height: 630,
          alt: `${deliveryName[locale]} - KLS Logistics`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${deliveryName[locale]} | KLS Logistics`,
      description: deliveryDescription[locale],
      images: [`${siteUrl}/logos/ЛОГО(1).png`],
    },
  };
}

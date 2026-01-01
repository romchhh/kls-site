import { Locale } from "../lib/translations";

type StructuredDataProps = {
  locale: Locale;
  type?: "Organization" | "WebSite" | "Service";
  pageUrl?: string;
};

export function StructuredData({ locale, type = "Organization", pageUrl }: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";
  const currentUrl = pageUrl || `${siteUrl}/${locale}`;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KLS Logistics",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380-32-229-4567",
      contactType: "customer service",
      areaServed: ["UA", "CN", "EU"],
      availableLanguage: ["Ukrainian", "Russian", "English"],
    },
    sameAs: [
      "https://www.instagram.com/klslogistics",
      "https://www.tiktok.com/@klslogistics",
      "https://t.me/klslogistics",
      "https://www.facebook.com/klslogistics",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressLocality: "Lviv",
      streetAddress: "Office 402, Business Center \"Optima Plaza\", 38 Naukova Street",
      postalCode: "79060",
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KLS Logistics",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Logistics and Freight Forwarding",
    provider: {
      "@type": "Organization",
      name: "KLS Logistics",
    },
    areaServed: {
      "@type": "Country",
      name: ["Ukraine", "China", "European Union"],
    },
    offers: {
      "@type": "Offer",
      description:
        locale === "ua"
          ? "Доставка вантажів з Китаю в Україну та країни ЄС. Морські, авіа та залізничні перевезення."
          : locale === "ru"
          ? "Доставка грузов из Китая в Украину и страны ЕС. Морские, авиа и железнодорожные перевозки."
          : "Cargo delivery from China to Ukraine and EU countries. Sea, air and rail transportation.",
    },
  };

  let data;
  switch (type) {
    case "WebSite":
      data = websiteData;
      break;
    case "Service":
      data = serviceData;
      break;
    default:
      data = organizationData;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


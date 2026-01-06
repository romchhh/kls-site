import { Locale } from "../lib/translations";

type StructuredDataProps = {
  locale: Locale;
  type?: "Organization" | "WebSite" | "Service" | "LocalBusiness" | "BreadcrumbList";
  pageUrl?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  serviceName?: string;
  serviceDescription?: string;
};

export function StructuredData({
  locale,
  type = "Organization",
  pageUrl,
  breadcrumbs,
  serviceName,
  serviceDescription,
}: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";
  const currentUrl = pageUrl || `${siteUrl}/${locale}`;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KLS Logistics",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logos/ЛОГО(1).png`,
      contentUrl: `${siteUrl}/logos/ЛОГО(1).png`,
      width: 600,
      height: 200,
      encodingFormat: "image/png",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+380-32-229-4567",
      contactType: "customer service",
      areaServed: ["UA", "CN", "EU", "US"],
      availableLanguage: ["Ukrainian", "Russian", "English"],
      email: "info@kls.international",
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
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "10-50",
    },
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}#organization`,
    name: "KLS Logistics",
    image: `${siteUrl}/logos/ЛОГО(1).png`,
    telephone: "+380-32-229-4567",
    email: "info@kls.international",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 402, Business Center \"Optima Plaza\", 38 Naukova Street",
      addressLocality: "Lviv",
      postalCode: "79060",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 49.8397,
      longitude: 24.0297,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
    servesCuisine: "Logistics and Freight Forwarding",
    areaServed: [
      {
        "@type": "Country",
        name: "Ukraine",
      },
      {
        "@type": "Country",
        name: "China",
      },
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 50.45,
          longitude: 30.52,
        },
      },
    ],
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
    inLanguage: locale === "ua" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-US",
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceName || "Logistics and Freight Forwarding",
    provider: {
      "@type": "Organization",
      name: "KLS Logistics",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Country",
      name: ["Ukraine", "China", "European Union", "United States"],
    },
    description:
      serviceDescription ||
      (locale === "ua"
        ? "Доставка вантажів з Китаю в Україну та країни ЄС. Морські, авіа та залізничні перевезення."
        : locale === "ru"
        ? "Доставка грузов из Китая в Украину и страны ЕС. Морские, авиа и железнодорожные перевозки."
        : "Cargo delivery from China to Ukraine and EU countries. Sea, air and rail transportation."),
    offers: {
      "@type": "Offer",
      description:
        locale === "ua"
          ? "Комплексні логістичні послуги з доставки вантажів з Китаю"
          : locale === "ru"
          ? "Комплексные логистические услуги по доставке грузов из Китая"
          : "Comprehensive logistics services for cargo delivery from China",
      priceCurrency: "USD",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs?.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.url}`,
    })),
  };

  let data;
  switch (type) {
    case "WebSite":
      data = websiteData;
      break;
    case "Service":
      data = serviceData;
      break;
    case "LocalBusiness":
      data = localBusinessData;
      break;
    case "BreadcrumbList":
      data = breadcrumbData;
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

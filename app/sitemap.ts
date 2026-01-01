import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ua", "ru", "en"];
  const routes = [
    "",
    "/delivery/ukraine-turnkey",
    "/delivery/eu-world",
    "/delivery/international",
    "/services",
    "/services/forwarding",
    "/services/customs",
    "/services/warehousing",
    "/services/sourcing",
    "/services/payments",
    "/services/insurance",
    "/services/local",
    "/about",
    "/contacts",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}


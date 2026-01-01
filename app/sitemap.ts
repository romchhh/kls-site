import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kls.international";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ua", "ru", "en"];
  const baseRoutes = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "daily" as const,
    },
    {
      path: "/services",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/delivery",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/about",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/contacts",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
  ];

  const serviceRoutes = [
    {
      path: "/services/payments",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/forwarding",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/customs",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/warehousing",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/sourcing",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/insurance",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/services/local",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
  ];

  const deliveryRoutes = [
    {
      path: "/delivery/ukraine-turnkey",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/delivery/international",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/delivery/eu-world",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  locales.forEach((locale) => {
    // Base routes
    baseRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });

    // Service routes
    serviceRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });

    // Delivery routes
    deliveryRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  return sitemapEntries;
}

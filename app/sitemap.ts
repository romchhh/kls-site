import { MetadataRoute } from 'next';
import { Locale } from '../lib/translations';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kls.international';

// Список всіх сторінок сайту
const pages = [
  // Головна сторінка
  { path: '', priority: 1.0, changefreq: 'daily' },
  
  // Сторінки про компанію
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/contacts', priority: 0.9, changefreq: 'monthly' },
  
  // Сторінки послуг
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  { path: '/services/forwarding', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/customs', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/warehousing', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/payments', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/sourcing', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/insurance', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/local', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/consolidation', priority: 0.7, changefreq: 'monthly' },
  { path: '/services/inspection', priority: 0.7, changefreq: 'monthly' },
  { path: '/services/packaging', priority: 0.7, changefreq: 'monthly' },
  { path: '/services/storage', priority: 0.7, changefreq: 'monthly' },
  
  // Сторінки доставки
  { path: '/delivery', priority: 0.9, changefreq: 'weekly' },
  { path: '/delivery/international', priority: 0.9, changefreq: 'weekly' },
  { path: '/delivery/ukraine-turnkey', priority: 0.9, changefreq: 'weekly' },
  { path: '/delivery/eu-world', priority: 0.9, changefreq: 'weekly' },
];

const locales: Locale[] = ['ua', 'ru', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Генеруємо URL для кожної сторінки та кожної мови
  for (const page of pages) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${siteUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: page.priority,
        alternates: {
          languages: {
            'uk-UA': `${siteUrl}/ua${page.path}`,
            'ru-RU': `${siteUrl}/ru${page.path}`,
            'en-US': `${siteUrl}/en${page.path}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}

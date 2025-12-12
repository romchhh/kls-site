import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";
import Link from "next/link";
import { Package, FileText, Zap, Anchor, Globe2, ArrowRight } from "lucide-react";

export default async function EuWorldPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const services = [
    { 
      key: "fba", 
      href: `/${locale}/delivery/fba`,
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    { 
      key: "ddp", 
      href: `/${locale}/delivery/ddp`,
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    { 
      key: "express", 
      href: `/${locale}/delivery/express`,
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
    },
    { 
      key: "portToPort", 
      href: `/${locale}/delivery/port-to-port`,
      icon: Anchor,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    { 
      key: "crossBorder", 
      href: `/${locale}/delivery/cross-border`,
      icon: Globe2,
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-5xl md:text-6xl font-bold text-gray-900">
                {t.delivery.euWorld}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {locale === "ua" &&
                  "Доставка вантажів в країни Європейського Союзу та інші країни світу. Широкий спектр логістичних рішень для міжнародної торгівлі."}
                {locale === "ru" &&
                  "Доставка грузов в страны Европейского Союза и другие страны мира. Широкий спектр логистических решений для международной торговли."}
                {locale === "en" &&
                  "Delivery of cargo to European Union countries and other countries around the world. A wide range of logistics solutions for international trade."}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold text-gray-900">
              {locale === "ua" ? "Послуги доставки" : locale === "ru" ? "Услуги доставки" : "Delivery Services"}
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                const serviceText = t.delivery[service.key as keyof typeof t.delivery];
                return (
                  <Link
                    key={service.key}
                    href={service.href}
                    className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Градієнтний фон при hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Контент */}
                    <div className="relative z-10">
                      {/* Іконка */}
                      <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${service.gradient} p-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Заголовок */}
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                        {typeof serviceText === 'string' ? serviceText : service.key}
                      </h3>
                      
                      {/* Стрілка */}
                      <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                        <span className="text-sm mr-2">
                          {locale === "ua" ? "Детальніше" : locale === "ru" ? "Подробнее" : "Learn more"}
                        </span>
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


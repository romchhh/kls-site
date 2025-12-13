import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import Link from "next/link";
import { Ship, Plane, Train, Globe, ArrowRight } from "lucide-react";

export default async function UkraineTurnkeyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const services = [
    { 
      key: "sea", 
      href: `/${locale}/delivery/sea`,
      icon: Ship,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    { 
      key: "air", 
      href: `/${locale}/delivery/air`,
      icon: Plane,
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50",
    },
    { 
      key: "rail", 
      href: `/${locale}/delivery/rail`,
      icon: Train,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    { 
      key: "multimodal", 
      href: `/${locale}/delivery/multimodal`,
      icon: Globe,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-teal-50 to-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-5xl md:text-6xl font-bold text-gray-900">
                {t.delivery.ukraineTurnkey}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {locale === "ua" &&
                  "Комплексна доставка вантажів з Китаю в Україну під ключ. Ми беремо на себе всі етапи логістичного процесу від отримання вантажу на складі в Китаї до доставки в Україну."}
                {locale === "ru" &&
                  "Комплексная доставка грузов из Китая в Украину под ключ. Мы берем на себя все этапы логистического процесса от получения груза на складе в Китае до доставки в Украину."}
                {locale === "en" &&
                  "Comprehensive delivery of cargo from China to Ukraine turnkey. We take care of all stages of the logistics process from receiving cargo at the warehouse in China to delivery to Ukraine."}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Services */}
              <div className="lg:col-span-2">
                <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold text-gray-900">
                  {locale === "ua" ? "Види доставки" : locale === "ru" ? "Виды доставки" : "Delivery Types"}
                </h2>
                
                <div className="grid gap-8 md:grid-cols-2">
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

              {/* Right column - Contact Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  <ContactForm locale={locale} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


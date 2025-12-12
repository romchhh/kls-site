import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";
import Link from "next/link";
import { Ship, Plane, Train, Truck, ArrowRight, CheckCircle2 } from "lucide-react";

const content = {
  ua: {
    intro: "Ми забезпечуємо повний комплекс логістичних рішень для міжнародних вантажних перевезень, поєднуючи надійність, прозорість та індивідуальний підхід. Наша команда організовує доставку будь-яким видом транспорту — морським, авіаційним, залізничним та автомобільним, а також бере на себе всі експедиторські операції.",
    whatIncludes: "Що входить у наші послуги",
    services: [
      "організація міжнародних перевезень FCL / LCL, FTL / LTL",
      "підбір оптимального маршруту за вартістю та термінами",
      "експедирування в портах, аеропортах, терміналах",
      "митне оформлення та суправа документації",
      "мультимодальні рішення (комбінація кількох видів транспорту)",
      "страхування вантажів та додаткові сервісні послуги",
      "повний контроль та відстеження на всіх етапах доставки",
    ],
    advantages: "Наші ключові переваги",
    advantagesList: [
      "глобальна мережа партнерів та агентів",
      "гнучкі тарифи та індивідуальний підхід до кожного клієнта",
      "стандарти безпеки та прозорість логістики",
      "команда, що працює з різними типами вантажів — від стандартних до негабаритних та чутливих",
    ],
    forWhom: "Для кого це підходить",
    clients: [
      "імпортери та експортери",
      "e-commerce бізнес та виробники",
      "дистриб'ютори й торговельні компанії",
      "підприємства, що працюють із регулярними чи проектними відправленнями",
    ],
  },
  ru: {
    intro: "Мы обеспечиваем полный комплекс логистических решений для международных грузовых перевозок, сочетая надежность, прозрачность и индивидуальный подход. Наша команда организует доставку любым видом транспорта — морским, авиационным, железнодорожным и автомобильным, а также берет на себя все экспедиторские операции.",
    whatIncludes: "Что входит в наши услуги",
    services: [
      "организация международных перевозок FCL / LCL, FTL / LTL",
      "подбор оптимального маршрута по стоимости и срокам",
      "экспедирование в портах, аэропортах, терминалах",
      "таможенное оформление и сопровождение документации",
      "мультимодальные решения (комбинация нескольких видов транспорта)",
      "страхование грузов и дополнительные сервисные услуги",
      "полный контроль и отслеживание на всех этапах доставки",
    ],
    advantages: "Наши ключевые преимущества",
    advantagesList: [
      "глобальная сеть партнеров и агентов",
      "гибкие тарифы и индивидуальный подход к каждому клиенту",
      "стандарты безопасности и прозрачность логистики",
      "команда, работающая с разными типами грузов — от стандартных до негабаритных и чувствительных",
    ],
    forWhom: "Для кого это подходит",
    clients: [
      "импортеры и экспортеры",
      "e-commerce бизнес и производители",
      "дистрибьюторы и торговые компании",
      "предприятия, работающие с регулярными или проектными отправлениями",
    ],
  },
  en: {
    intro: "We provide a full range of logistics solutions for international freight transportation, combining reliability, transparency and individual approach. Our team organizes delivery by any type of transport — sea, air, rail and road, and also takes on all forwarding operations.",
    whatIncludes: "What is included in our services",
    services: [
      "organization of international transportation FCL / LCL, FTL / LTL",
      "selection of optimal route by cost and terms",
      "forwarding in ports, airports, terminals",
      "customs clearance and document support",
      "multimodal solutions (combination of several transport types)",
      "cargo insurance and additional service services",
      "full control and tracking at all delivery stages",
    ],
    advantages: "Our key advantages",
    advantagesList: [
      "global network of partners and agents",
      "flexible tariffs and individual approach to each client",
      "safety standards and logistics transparency",
      "team working with different cargo types — from standard to oversized and sensitive",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and exporters",
      "e-commerce business and manufacturers",
      "distributors and trading companies",
      "enterprises working with regular or project shipments",
    ],
  },
};

export default async function InternationalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const data = content[locale];

  const services = [
    { 
      key: "seaContainer", 
      href: `/${locale}/delivery/sea-container`,
      icon: Ship,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    { 
      key: "airCargo", 
      href: `/${locale}/delivery/air-cargo`,
      icon: Plane,
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50",
    },
    { 
      key: "railCargo", 
      href: `/${locale}/delivery/rail-cargo`,
      icon: Train,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    { 
      key: "roadCargo", 
      href: `/${locale}/delivery/road-cargo`,
      icon: Truck,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-20 overflow-hidden mb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-5xl md:text-6xl font-bold text-gray-900">
                {t.delivery.international}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                {data.intro}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Services List */}
          <section className="mb-20">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">{data.whatIncludes}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {data.services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-teal-300 hover:shadow-md"
                >
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-teal-600" />
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Advantages & For Whom */}
          <section className="mb-20 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-4">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">{data.forWhom}</h2>
              <ul className="space-y-4">
                {data.clients.map((client, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="text-gray-700">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Transportation Types */}
          <section>
            <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold text-gray-900">
              {locale === "ua" ? "Види перевезень" : locale === "ru" ? "Виды перевозок" : "Transportation Types"}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


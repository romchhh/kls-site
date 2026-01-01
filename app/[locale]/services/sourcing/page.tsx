import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";
import Image from "next/image";

const content = {
  ua: {
    title: "Сервіс пошуку та закупівлі в Китаї та Кореї",
    subtitle: "Пошук постачальників / Перевірка фабрик / Ведення переговорів / Закупівля під ключ",
    intro: "Ми надаємо комплексний сервіс з пошуку товарів та виробників у Китаї та Південній Кореї, допомагаючи бізнесу отримати надійних постачальників, вигідні умови та повний супровід у процесі закупівлі.",
    ourServices: "Наші послуги",
    services: [
      {
        title: "Пошук постачальників і фабрик",
        icon: "/services/sourcing.svg",
        items: [
      "підбір виробників за вашим технічним завданням",
      "пошук товарів на 1688, Taobao, Alibaba, китайських і корейських B2B-платформах",
      "аналіз ринку та порівняння цін",
    ],
      },
      {
        title: "Перевірка постачальників (Factory Check)",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "перевірка документів та легальності компанії",
      "аналіз відгуків, рейтингу, виробничих потужностей",
      "запит сертифікації та підтверджуючих матеріалів",
    ],
      },
      {
        title: "Переговори з постачальниками",
        icon: "/why-choose-us/personal-approach.svg",
        items: [
      "узгодження цін, умов виробництва та поставки",
      "контроль специфікацій і відповідності вимогам",
      "погодження умов Incoterms, термінів та оплати",
    ],
      },
      {
        title: "Закупівля та оформлення замовлень",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "оформлення замовлення \"під ключ\"",
      "оплата постачальнику або фабриці",
      "контроль виробництва (за потреби – фото/відео звіти)",
    ],
      },
      {
        title: "Контроль якості та інспекція",
        icon: "/why-choose-us/quality.svg",
        items: [
      "перевірка товару перед відправкою",
      "перевірка кількості, маркування, пакування",
      "тестування (якщо потрібно)",
    ],
      },
    ],
    advantages: "Чому наш сервіс ефективний",
    advantagesList: [
      "великий досвід роботи з китайськими та корейськими виробниками",
      "реальна перевірка постачальників — мінімізація ризиків",
      "прямий контакт з фабриками без посередників",
      "оптимальні ціни і повна прозорість закупівель",
      "супровід усіх етапів — від пошуку до доставки",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "малого, середнього та великого бізнесу",
      "e-commerce та маркетплейсів",
      "виробників та дистриб'юторів",
      "компаній, що хочуть замовляти напряму з Китаю або Кореї",
    ],
  },
  ru: {
    title: "Сервис поиска и закупки в Китае и Корее",
    subtitle: "Поиск поставщиков / Проверка фабрик / Ведение переговоров / Закупка под ключ",
    intro: "Мы предоставляем комплексный сервис по поиску товаров и производителей в Китае и Южной Корее, помогая бизнесу получить надежных поставщиков, выгодные условия и полное сопровождение в процессе закупки.",
    ourServices: "Наши услуги",
    services: [
      {
        title: "Поиск поставщиков и фабрик",
        icon: "/services/sourcing.svg",
        items: [
      "подбор производителей по вашему техническому заданию",
      "поиск товаров на 1688, Taobao, Alibaba, китайских и корейских B2B-платформах",
      "анализ рынка и сравнение цен",
    ],
      },
      {
        title: "Проверка поставщиков (Factory Check)",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "проверка документов и легальности компании",
      "анализ отзывов, рейтинга, производственных мощностей",
      "запрос сертификации и подтверждающих материалов",
    ],
      },
      {
        title: "Переговоры с поставщиками",
        icon: "/why-choose-us/personal-approach.svg",
        items: [
      "согласование цен, условий производства и поставки",
      "контроль спецификаций и соответствия требованиям",
      "согласование условий Incoterms, сроков и оплаты",
    ],
      },
      {
        title: "Закупка и оформление заказов",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "оформление заказа \"под ключ\"",
      "оплата поставщику или фабрике",
      "контроль производства (при необходимости – фото/видео отчеты)",
    ],
      },
      {
        title: "Контроль качества и инспекция",
        icon: "/why-choose-us/quality.svg",
        items: [
      "проверка товара перед отправкой",
      "проверка количества, маркировки, упаковки",
      "тестирование (если нужно)",
    ],
      },
    ],
    advantages: "Почему наш сервис эффективен",
    advantagesList: [
      "большой опыт работы с китайскими и корейскими производителями",
      "реальная проверка поставщиков — минимизация рисков",
      "прямой контакт с фабриками без посредников",
      "оптимальные цены и полная прозрачность закупок",
      "сопровождение всех этапов — от поиска до доставки",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "малого, среднего и крупного бизнеса",
      "e-commerce и маркетплейсов",
      "производителей и дистрибьюторов",
      "компаний, которые хотят заказывать напрямую из Китая или Кореи",
    ],
  },
  en: {
    title: "Search and Procurement Service in China and Korea",
    subtitle: "Supplier Search / Factory Verification / Negotiations / Turnkey Procurement",
    intro: "We provide a comprehensive service for finding goods and manufacturers in China and South Korea, helping businesses get reliable suppliers, favorable terms and full support in the procurement process.",
    ourServices: "Our services",
    services: [
      {
        title: "Supplier and Factory Search",
        icon: "/services/sourcing.svg",
        items: [
      "selection of manufacturers according to your technical specification",
      "product search on 1688, Taobao, Alibaba, Chinese and Korean B2B platforms",
      "market analysis and price comparison",
    ],
      },
      {
        title: "Supplier Verification (Factory Check)",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "verification of documents and company legality",
      "analysis of reviews, ratings, production capacity",
      "request for certification and supporting materials",
    ],
      },
      {
        title: "Negotiations with Suppliers",
        icon: "/why-choose-us/personal-approach.svg",
        items: [
      "coordination of prices, production and delivery terms",
      "control of specifications and compliance with requirements",
      "coordination of Incoterms, terms and payment",
    ],
      },
      {
        title: "Procurement and Order Processing",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "turnkey order processing",
      "payment to supplier or factory",
      "production control (if needed – photo/video reports)",
    ],
      },
      {
        title: "Quality Control and Inspection",
        icon: "/why-choose-us/quality.svg",
        items: [
      "product verification before shipment",
      "verification of quantity, labeling, packaging",
      "testing (if needed)",
    ],
      },
    ],
    advantages: "Why our service is effective",
    advantagesList: [
      "extensive experience working with Chinese and Korean manufacturers",
      "real supplier verification — risk minimization",
      "direct contact with factories without intermediaries",
      "optimal prices and full transparency of purchases",
      "support of all stages — from search to delivery",
    ],
    forWhom: "For whom it suits",
    clients: [
      "small, medium and large businesses",
      "e-commerce and marketplaces",
      "manufacturers and distributors",
      "companies that want to order directly from China or Korea",
    ],
  },
};

export default async function SourcingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vygruzka-gruzovikov-v-logisticeskom-centre-s-vozduha 1.jpg"
            alt="KLS Logistics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-[1]" />
              </div>

        {/* Content */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left - Text Content */}
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                {data.title}
              </h1>
              <p className="mb-6 text-base font-normal leading-relaxed text-white/95 md:text-lg">
                {data.subtitle}
              </p>
              </div>

            {/* Right - Contact Form */}
            <div className="flex justify-end">
              <div className="mt-12 max-w-md w-full shadow-2xl">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-[#E8FDF8] p-8">
            <p className="text-base font-normal leading-relaxed text-gray-700 md:text-lg">
              {data.intro}
            </p>
          </div>
              </div>
      </section>

      {/* Our Services Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.ourServices}
            </h2>
              </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.services.map((service, index) => (
              <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                      {service.title}
                    </h3>
                <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="mt-1.5 text-teal-600">•</span>
                          <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                            {item}
                          </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="relative bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {data.advantages}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
                {data.advantagesList.map((advantage, index) => (
              <div key={index} className="flex w-full flex-col items-center text-center md:w-[calc(33.333%-1rem)]">
                <div className="mb-4 flex-shrink-0">
                  <Image
                    src="/icons/misc/Group 7.svg"
                    alt="Check"
                    width={43}
                    height={43}
                    className="object-contain"
                  />
                </div>
                <p className="text-base font-normal leading-relaxed text-white md:text-lg">
                  {advantage}
                </p>
            </div>
            ))}
          </div>
            </div>
      </section>

      {/* For Whom Section */}
      <section className="pt-12 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.forWhom}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.clients.map((client, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-[#006D77] bg-white px-6 py-4 text-center transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-sm"
              >
                <p className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-teal-700 [&::first-letter]:uppercase">
                  {client}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}

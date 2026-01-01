import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";
import Image from "next/image";

const content = {
  ua: {
    title: "Митно-брокерські послуги",
    subtitle: "Оформлення вантажів / Консультації / Підготовка документів / Супровід на митниці",
    intro: "Ми надаємо повний комплекс митно-брокерських послуг для імпортних та експортних вантажів. Забезпечуємо швидке та коректне оформлення вантажів на всіх етапах — від підготовки документів до успішного проходження митного контролю.",
    ourServices: "Наші послуги",
    services: [
      {
        title: "Оформлення митних декларацій",
        icon: "/services/customs.svg",
        items: [
      "імпортні та експортні декларації",
      "попередні декларації",
      "оформлення для всіх видів транспорту (авто, авіа, море, ж/д)",
    ],
      },
      {
        title: "Сертифікати та дозвільні документи",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "сертифікати відповідності",
      "фітосанітарні та ветеринарні сертифікати",
      "дозвільні документи для специфічних товарів",
    ],
      },
      {
        title: "Підготовка та перевірка документів",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "інвойси, пакувальні листи, контракти",
      "сертифікати відповідності, CO, дозвільні документи",
      "перевірка коректності даних для митниці",
    ],
      },
      {
        title: "Визначення кодів УКТЗЕД",
        icon: "/why-choose-us/quick-calculation.svg",
        items: [
      "коректний підбір коду товару",
      "мінімізація ризиків штрафів та затримок",
      "розрахунок ставок мита, ПДВ та інших платежів",
    ],
      },
      {
        title: "Розрахунок митних платежів",
        icon: "/why-choose-us/affordable-prices.svg",
        items: [
      "мито, ПДВ, акциз",
      "передача точних розрахунків перед оформленням",
      "планування витрат для клієнта",
    ],
      },
      {
        title: "Супровід вантажу на митниці",
        icon: "/why-choose-us/personal-manager.svg",
        items: [
      "координація з митними органами",
      "термінове вирішення питань",
      "представництво інтересів клієнта",
    ],
      },
    ],
    advantages: "Переваги нашого сервісу",
    advantagesList: [
      "швидке оформлення без затримок",
      "точність у документації та кодуванні",
      "досвід роботи з будь-якими групами товарів",
      "постійна комунікація з клієнтом",
      "прозорі тарифи й повна звітність",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "імпортерів та експортерів",
      "компаній, що працюють з Китаєм та іншими країнами",
      "бізнесу, який регулярно оформлює вантажі",
      "нових підприємців, які потребують супроводу «під ключ»",
    ],
  },
  ru: {
    title: "Таможенно-брокерские услуги",
    subtitle: "Оформление грузов / Консультации / Подготовка документов / Сопровождение на таможне",
    intro: "Мы предоставляем полный комплекс таможенно-брокерских услуг для импортных и экспортных грузов. Обеспечиваем быстрое и корректное оформление грузов на всех этапах — от подготовки документов до успешного прохождения таможенного контроля.",
    ourServices: "Наши услуги",
    services: [
      {
        title: "Оформление таможенных деклараций",
        icon: "/services/customs.svg",
        items: [
      "импортные и экспортные декларации",
      "предварительные декларации",
      "оформление для всех видов транспорта (авто, авиа, море, ж/д)",
    ],
      },
      {
        title: "Сертификаты и разрешительные документы",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "сертификаты соответствия",
      "фитосанитарные и ветеринарные сертификаты",
      "разрешительные документы для специфических товаров",
    ],
      },
      {
        title: "Подготовка и проверка документов",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "инвойсы, упаковочные листы, контракты",
      "сертификаты соответствия, CO, разрешительные документы",
      "проверка корректности данных для таможни",
    ],
      },
      {
        title: "Определение кодов УКТЗЕД",
        icon: "/why-choose-us/quick-calculation.svg",
        items: [
      "корректный подбор кода товара",
      "минимизация рисков штрафов и задержек",
      "расчет ставок пошлины, НДС и других платежей",
    ],
      },
      {
        title: "Расчет таможенных платежей",
        icon: "/why-choose-us/affordable-prices.svg",
        items: [
      "пошлина, НДС, акциз",
      "передача точных расчетов перед оформлением",
      "планирование расходов для клиента",
    ],
      },
      {
        title: "Сопровождение груза на таможне",
        icon: "/why-choose-us/personal-manager.svg",
        items: [
      "координация с таможенными органами",
      "срочное решение вопросов",
      "представление интересов клиента",
    ],
      },
    ],
    advantages: "Преимущества нашего сервиса",
    advantagesList: [
      "быстрое оформление без задержек",
      "точность в документации и кодировании",
      "опыт работы с любыми группами товаров",
      "постоянная коммуникация с клиентом",
      "прозрачные тарифы и полная отчетность",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "импортеров и экспортеров",
      "компаний, работающих с Китаем и другими странами",
      "бизнеса, который регулярно оформляет грузы",
      "новых предпринимателей, которые нуждаются в сопровождении «под ключ»",
    ],
  },
  en: {
    title: "Customs Brokerage Services",
    subtitle: "Cargo Clearance / Consultations / Document Preparation / Customs Support",
    intro: "We provide a full range of customs brokerage services for import and export cargo. We ensure fast and correct cargo clearance at all stages — from document preparation to successful customs control.",
    ourServices: "Our services",
    services: [
      {
        title: "Customs Declaration Processing",
        icon: "/services/customs.svg",
        items: [
      "import and export declarations",
      "preliminary declarations",
      "clearance for all types of transport (auto, air, sea, rail)",
    ],
      },
      {
        title: "Certificates and Permits",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "certificates of conformity",
      "phytosanitary and veterinary certificates",
      "permits for specific goods",
    ],
      },
      {
        title: "Document Preparation and Verification",
        icon: "/why-choose-us/reliability.svg",
        items: [
      "invoices, packing lists, contracts",
      "certificates of conformity, CO, permits",
      "verification of data correctness for customs",
    ],
      },
      {
        title: "HS Code Determination",
        icon: "/why-choose-us/quick-calculation.svg",
        items: [
      "correct product code selection",
      "minimization of fine and delay risks",
          "calculation of duty, VAT and other payment rates",
    ],
      },
      {
        title: "Customs Payment Calculation",
        icon: "/why-choose-us/affordable-prices.svg",
        items: [
      "duty, VAT, excise",
          "accurate calculation transfer before clearance",
      "expense planning for client",
    ],
      },
      {
        title: "Cargo Support at Customs",
        icon: "/why-choose-us/personal-manager.svg",
        items: [
      "coordination with customs authorities",
      "urgent issue resolution",
          "client interest representation",
        ],
      },
    ],
    advantages: "Advantages of our service",
    advantagesList: [
      "fast clearance without delays",
      "accuracy in documentation and coding",
      "experience working with any product groups",
      "constant communication with client",
      "transparent tariffs and full reporting",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and exporters",
      "companies working with China and other countries",
      "businesses that regularly clear cargo",
      "new entrepreneurs who need turnkey support",
    ],
  },
};

export default async function CustomsPage({
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

import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";
import Image from "next/image";

const content = {
  ua: {
    title: "Експедирування вантажів",
    subtitle: "Повний супровід / Контроль на всіх етапах / Оптимізація логістики",
    intro: "Ми забезпечуємо професійне експедирування вантажів у міжнародній та внутрішній логістиці. Контролюємо весь процес доставки — від забору вантажу до моменту передачі отримувачу. Гарантуємо своєчасність, безпеку та точність кожного етапу.",
    ourServices: "Наші експедиторські послуги",
    services: [
      {
        title: "Організація перевезень будь-якими видами транспорту",
        icon: "/services/forwarding.svg",
        items: [
      "морські (FCL / LCL)",
      "авіа",
      "авто",
      "залізничні міжнародні доставки",
    ],
      },
      {
        title: "Забір та передача вантажу",
        icon: "/why-choose-us/fast-delivery.svg",
        items: [
      "координація транспорту для забору",
      "доставка на склади консолідації та термінали",
      "супровід при перевантаженні й транзиті",
    ],
      },
      {
        title: "Контроль документів та оформлення",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "перевірка комерційних документів",
      "координація із митними брокерами",
      "оформлення транспортних документів (коносаменти, накладні, маніфести)",
    ],
      },
      {
        title: "Моніторинг та відстеження",
        icon: "/why-choose-us/support-24-7.svg",
        items: [
      "повне відстеження маршруту",
      "інформування клієнта про всі статуси",
      "оперативне вирішення нестандартних ситуацій",
    ],
      },
      {
        title: "Супровід на митних процедурах",
        icon: "/services/customs.svg",
        items: [
      "організація оглядів",
      "обробка запитів від митниці",
      "комунікація з контролюючими органами",
    ],
      },
      {
        title: "Організація складських операцій",
        icon: "/services/warehousing.svg",
        items: [
      "консолідація",
      "пакування й перепакування",
      "інспекція та перевірка перед відправкою",
        ],
      },
    ],
    advantages: "Наші переваги",
    advantagesList: [
      "персональний менеджер на всіх етапах доставки",
      "точне планування маршрутів і дедлайнів",
      "великий досвід роботи з Китаєм, Кореєю, США, ЄС",
      "прозора взаємодія та постійний контроль",
      "оптимізація витрат клієнта на логістику",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "імпортерів і експортерів",
      "компаній з регулярними поставками",
      "бізнесів, що працюють з Азією та Європою",
      "підприємств, які потребують повного логістичного супроводу",
    ],
  },
  ru: {
    title: "Экспедирование грузов",
    subtitle: "Полное сопровождение / Контроль на всех этапах / Оптимизация логистики",
    intro: "Мы обеспечиваем профессиональное экспедирование грузов в международной и внутренней логистике. Контролируем весь процесс доставки — от забора груза до момента передачи получателю. Гарантируем своевременность, безопасность и точность каждого этапа.",
    ourServices: "Наши экспедиторские услуги",
    services: [
      {
        title: "Организация перевозок любыми видами транспорта",
        icon: "/services/forwarding.svg",
        items: [
      "морские (FCL / LCL)",
      "авиа",
      "авто",
      "железнодорожные международные доставки",
    ],
      },
      {
        title: "Забор и передача груза",
        icon: "/why-choose-us/fast-delivery.svg",
        items: [
      "координация транспорта для забора",
      "доставка на склады консолидации и терминалы",
      "сопровождение при перегрузке и транзите",
    ],
      },
      {
        title: "Контроль документов и оформление",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "проверка коммерческих документов",
      "координация с таможенными брокерами",
      "оформление транспортных документов (коносаменты, накладные, манифесты)",
    ],
      },
      {
        title: "Мониторинг и отслеживание",
        icon: "/why-choose-us/support-24-7.svg",
        items: [
      "полное отслеживание маршрута",
      "информирование клиента о всех статусах",
      "оперативное решение нестандартных ситуаций",
    ],
      },
      {
        title: "Сопровождение на таможенных процедурах",
        icon: "/services/customs.svg",
        items: [
      "организация осмотров",
      "обработка запросов от таможни",
      "коммуникация с контролирующими органами",
    ],
      },
      {
        title: "Организация складских операций",
        icon: "/services/warehousing.svg",
        items: [
      "консолидация",
      "упаковка и переупаковка",
      "инспекция и проверка перед отправкой",
        ],
      },
    ],
    advantages: "Наши преимущества",
    advantagesList: [
      "персональный менеджер на всех этапах доставки",
      "точное планирование маршрутов и дедлайнов",
      "большой опыт работы с Китаем, Кореей, США, ЕС",
      "прозрачное взаимодействие и постоянный контроль",
      "оптимизация расходов клиента на логистику",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "импортеров и экспортеров",
      "компаний с регулярными поставками",
      "бизнесов, работающих с Азией и Европой",
      "предприятий, которые нуждаются в полном логистическом сопровождении",
    ],
  },
  en: {
    title: "Cargo Forwarding",
    subtitle: "Full Support / Control at All Stages / Logistics Optimization",
    intro: "We provide professional cargo forwarding in international and domestic logistics. We control the entire delivery process — from cargo pickup to the moment of transfer to the recipient. We guarantee timeliness, safety and accuracy of each stage.",
    ourServices: "Our forwarding services",
    services: [
      {
        title: "Organization of Transportation by Any Type of Transport",
        icon: "/services/forwarding.svg",
        items: [
      "sea (FCL / LCL)",
      "air",
      "auto",
      "rail international deliveries",
    ],
      },
      {
        title: "Cargo Pickup and Transfer",
        icon: "/why-choose-us/fast-delivery.svg",
        items: [
      "transport coordination for pickup",
      "delivery to consolidation warehouses and terminals",
      "support during transshipment and transit",
    ],
      },
      {
        title: "Document Control and Processing",
        icon: "/why-choose-us/transparency.svg",
        items: [
      "verification of commercial documents",
      "coordination with customs brokers",
      "processing of transport documents (bills of lading, waybills, manifests)",
    ],
      },
      {
        title: "Monitoring and Tracking",
        icon: "/why-choose-us/support-24-7.svg",
        items: [
      "full route tracking",
      "informing client about all statuses",
      "operational resolution of non-standard situations",
    ],
      },
      {
        title: "Support at Customs Procedures",
        icon: "/services/customs.svg",
        items: [
      "organization of inspections",
      "processing of customs requests",
      "communication with controlling authorities",
    ],
      },
      {
        title: "Organization of Warehouse Operations",
        icon: "/services/warehousing.svg",
        items: [
      "consolidation",
      "packaging and repackaging",
      "inspection and verification before shipment",
        ],
      },
    ],
    advantages: "Our advantages",
    advantagesList: [
      "personal manager at all delivery stages",
      "accurate route and deadline planning",
      "extensive experience working with China, Korea, USA, EU",
      "transparent interaction and constant control",
      "optimization of client logistics costs",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and exporters",
      "companies with regular deliveries",
      "businesses working with Asia and Europe",
      "enterprises that need full logistics support",
    ],
  },
};

export default async function ForwardingPage({
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

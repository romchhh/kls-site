import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Експедирування вантажів",
    subtitle: "Повний супровід / Контроль на всіх етапах / Оптимізація логістики",
    intro: "Ми забезпечуємо професійне експедирування вантажів у міжнародній та внутрішній логістиці. Контролюємо весь процес доставки — від забору вантажу до моменту передачі отримувачу. Гарантуємо своєчасність, безпеку та точність кожного етапу.",
    ourServices: "Наші експедиторські послуги",
    organization: "Організація перевезень будь-якими видами транспорту",
    transportTypes: [
      "морські (FCL / LCL)",
      "авіа",
      "авто",
      "залізничні міжнародні доставки",
    ],
    pickup: "Забір та передача вантажу",
    pickupServices: [
      "координація транспорту для забору",
      "доставка на склади консолідації та термінали",
      "супровід при перевантаженні й транзиті",
    ],
    documents: "Контроль документів та оформлення",
    documentServices: [
      "перевірка комерційних документів",
      "координація із митними брокерами",
      "оформлення транспортних документів (коносаменти, накладні, маніфести)",
    ],
    monitoring: "Моніторинг та відстеження",
    monitoringServices: [
      "повне відстеження маршруту",
      "інформування клієнта про всі статуси",
      "оперативне вирішення нестандартних ситуацій",
    ],
    customs: "Супровід на митних процедурах",
    customsServices: [
      "організація оглядів",
      "обробка запитів від митниці",
      "комунікація з контролюючими органами",
    ],
    warehouse: "Організація складських операцій",
    warehouseServices: [
      "консолідація",
      "пакування й перепакування",
      "інспекція та перевірка перед відправкою",
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
    organization: "Организация перевозок любыми видами транспорта",
    transportTypes: [
      "морские (FCL / LCL)",
      "авиа",
      "авто",
      "железнодорожные международные доставки",
    ],
    pickup: "Забор и передача груза",
    pickupServices: [
      "координация транспорта для забора",
      "доставка на склады консолидации и терминалы",
      "сопровождение при перегрузке и транзите",
    ],
    documents: "Контроль документов и оформление",
    documentServices: [
      "проверка коммерческих документов",
      "координация с таможенными брокерами",
      "оформление транспортных документов (коносаменты, накладные, манифесты)",
    ],
    monitoring: "Мониторинг и отслеживание",
    monitoringServices: [
      "полное отслеживание маршрута",
      "информирование клиента о всех статусах",
      "оперативное решение нестандартных ситуаций",
    ],
    customs: "Сопровождение на таможенных процедурах",
    customsServices: [
      "организация осмотров",
      "обработка запросов от таможни",
      "коммуникация с контролирующими органами",
    ],
    warehouse: "Организация складских операций",
    warehouseServices: [
      "консолидация",
      "упаковка и переупаковка",
      "инспекция и проверка перед отправкой",
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
    organization: "Organization of Transportation by Any Type of Transport",
    transportTypes: [
      "sea (FCL / LCL)",
      "air",
      "auto",
      "rail international deliveries",
    ],
    pickup: "Cargo Pickup and Transfer",
    pickupServices: [
      "transport coordination for pickup",
      "delivery to consolidation warehouses and terminals",
      "support during transshipment and transit",
    ],
    documents: "Document Control and Processing",
    documentServices: [
      "verification of commercial documents",
      "coordination with customs brokers",
      "processing of transport documents (bills of lading, waybills, manifests)",
    ],
    monitoring: "Monitoring and Tracking",
    monitoringServices: [
      "full route tracking",
      "informing client about all statuses",
      "operational resolution of non-standard situations",
    ],
    customs: "Support at Customs Procedures",
    customsServices: [
      "organization of inspections",
      "processing of customs requests",
      "communication with controlling authorities",
    ],
    warehouse: "Organization of Warehouse Operations",
    warehouseServices: [
      "consolidation",
      "packaging and repackaging",
      "inspection and verification before shipment",
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
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{data.title}</h1>
          <p className="mb-8 text-xl text-gray-600">{data.subtitle}</p>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.ourServices}</h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.organization}</h3>
                <ul className="space-y-2">
                  {data.transportTypes.map((type, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{type}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.pickup}</h3>
                <ul className="space-y-2">
                  {data.pickupServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.documents}</h3>
                <ul className="space-y-2">
                  {data.documentServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.monitoring}</h3>
                <ul className="space-y-2">
                  {data.monitoringServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.customs}</h3>
                <ul className="space-y-2">
                  {data.customsServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">🏬 {data.warehouse}</h3>
                <ul className="space-y-2">
                  {data.warehouseServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-violet-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-green-600 font-bold">✔</span>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
              <ul className="space-y-3">
                {data.clients.map((client, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-violet-600">•</span>
                    <span className="text-gray-600">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


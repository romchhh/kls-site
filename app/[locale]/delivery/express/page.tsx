import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "ЕКСПРЕС ДОСТАВКА",
    subtitle: "Express Air — найшвидший спосіб доставки товарів з Китаю у будь-яку країну світу",
    intro: "Ідеально для термінових відправок, тестових партій, зразків та легких товарів.",
    whatIs: "Що це таке?",
    description: "Express-доставка — це авіаперевезення з використанням міжнародних кур'єрських служб (DHL, UPS, FedEx, SF Express), які забезпечують доставку від дверей до дверей у найкоротші строки.",
    advantages: "Переваги Express Air:",
    advantagesList: [
      "Швидко — 3–7 днів у більшість країн",
      "Повне відстеження вантажу",
      "Мінімальна бюрократія",
      "Ідеально для малих обсягів",
      "Безпечне транспортування та пріоритетна обробка",
    ],
    whatWeDo: "Що ми робимо:",
    services: [
      "пакуємо та оформлюємо документи",
      "відправляємо через надійні кур'єрські служби",
      "надаємо трекінг одразу після відправки",
    ],
    forWhom: "Для кого підходить:",
    clients: [
      "Amazon-продавці (зразки, невеликі партії)",
      "Dropshipping та e-commerce",
      "Доставка аксесуарів, електроніки, легких товарів",
      "Термінові поставки",
    ],
    cta: "Потрібно доставити вантаж «на вчора»? Ми впораємося з цим.",
  },
  ru: {
    title: "ЭКСПРЕСС ДОСТАВКА",
    subtitle: "Express Air — самый быстрый способ доставки товаров из Китая в любую страну мира",
    intro: "Идеально для срочных отправлений, тестовых партий, образцов и легких товаров.",
    whatIs: "Что это такое?",
    description: "Express-доставка — это авиаперевозки с использованием международных курьерских служб (DHL, UPS, FedEx, SF Express), которые обеспечивают доставку от дверей до дверей в кратчайшие сроки.",
    advantages: "Преимущества Express Air:",
    advantagesList: [
      "Быстро — 3–7 дней в большинство стран",
      "Полное отслеживание груза",
      "Минимальная бюрократия",
      "Идеально для малых объемов",
      "Безопасная транспортировка и приоритетная обработка",
    ],
    whatWeDo: "Что мы делаем:",
    services: [
      "упаковываем и оформляем документы",
      "отправляем через надежные курьерские службы",
      "предоставляем трекинг сразу после отправки",
    ],
    forWhom: "Для кого подходит:",
    clients: [
      "Amazon-продавцы (образцы, небольшие партии)",
      "Dropshipping и e-commerce",
      "Доставка аксессуаров, электроники, легких товаров",
      "Срочные поставки",
    ],
    cta: "Нужно доставить груз «на вчера»? Мы справимся с этим.",
  },
  en: {
    title: "EXPRESS DELIVERY",
    subtitle: "Express Air — the fastest way to deliver goods from China to any country in the world",
    intro: "Perfect for urgent shipments, test batches, samples and light goods.",
    whatIs: "What is it?",
    description: "Express delivery is air transportation using international courier services (DHL, UPS, FedEx, SF Express) that provide door-to-door delivery in the shortest time.",
    advantages: "Express Air advantages:",
    advantagesList: [
      "Fast — 3–7 days to most countries",
      "Full cargo tracking",
      "Minimal bureaucracy",
      "Perfect for small volumes",
      "Safe transportation and priority handling",
    ],
    whatWeDo: "What we do:",
    services: [
      "pack and prepare documents",
      "ship through reliable courier services",
      "provide tracking immediately after shipment",
    ],
    forWhom: "For whom it suits:",
    clients: [
      "Amazon sellers (samples, small batches)",
      "Dropshipping and e-commerce",
      "Delivery of accessories, electronics, light goods",
      "Urgent deliveries",
    ],
    cta: "Need to deliver cargo \"yesterday\"? We'll handle it.",
  },
};

export default async function ExpressDeliveryPage({
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
          <p className="mb-2 text-xl text-gray-600">{data.subtitle}</p>
          <p className="mb-12 text-lg text-gray-500">{data.intro}</p>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatIs}</h2>
            <p className="text-lg text-gray-700">{data.description}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-yellow-600 font-bold">✓</span>
                    <span className="text-gray-600">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeDo}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-yellow-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
            <ul className="space-y-2">
              {data.clients.map((client, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-yellow-600">•</span>
                  <span className="text-gray-600">{client}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-50 p-8">
            <p className="text-lg font-semibold text-gray-900">{data.cta}</p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


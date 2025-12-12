import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Залізничні вантажоперевезення",
    intro: "Ми організовуємо залізничну доставку вантажів будь-якого розміру — від невеликих відправлень 20–50 кг до палет, контейнерів та оптових партій. Ви отримуєте готове рішення \"all inclusive\" з мінімальною вартістю та повною прозорістю маршруту.",
    whatWeDo: "Що ми робимо",
    services: [
      "Консолідація дрібних вантажів (LCL)",
      "Пакування та переупаковка",
      "Маркування та фотофіксація",
      "Доставка залізницею до хаба/країни призначення",
      "Завершальна доставка «останньою милею»",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "онлайн-магазини",
      "дрібні та середні постачальники",
      "бізнеси, які хочуть знизити витрати на логістику",
      "приватні відправлення",
    ],
    tariffs: "Тарифи",
    tariffFrom: "від 4$ / кг",
    terms: "Терміни",
    termsValue: "РЕАЛЬНИЙ термін нашої доставки від 30 до 40 днів",
  },
  ru: {
    title: "Железнодорожные грузоперевозки",
    intro: "Мы организуем железнодорожную доставку грузов любого размера — от небольших отправлений 20–50 кг до палет, контейнеров и оптовых партий. Вы получаете готовое решение \"all inclusive\" с минимальной стоимостью и полной прозрачностью маршрута.",
    whatWeDo: "Что мы делаем",
    services: [
      "Консолидация мелких грузов (LCL)",
      "Упаковка и переупаковка",
      "Маркировка и фотофиксация",
      "Доставка железной дорогой до хаба/страны назначения",
      "Завершающая доставка «последней милей»",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "онлайн-магазины",
      "мелкие и средние поставщики",
      "бизнесы, которые хотят снизить расходы на логистику",
      "частные отправления",
    ],
    tariffs: "Тарифы",
    tariffFrom: "от 4$ / кг",
    terms: "Сроки",
    termsValue: "РЕАЛЬНЫЙ срок нашей доставки от 30 до 40 дней",
  },
  en: {
    title: "Rail Freight Transportation",
    intro: "We organize rail delivery of cargo of any size — from small shipments of 20–50 kg to pallets, containers and wholesale batches. You get a ready-made \"all inclusive\" solution with minimal cost and full route transparency.",
    whatWeDo: "What we do",
    services: [
      "Consolidation of small cargo (LCL)",
      "Packaging and repackaging",
      "Marking and photo documentation",
      "Rail delivery to hub/destination country",
      "Final delivery \"last mile\"",
    ],
    forWhom: "For whom it suits",
    clients: [
      "online stores",
      "small and medium suppliers",
      "businesses that want to reduce logistics costs",
      "private shipments",
    ],
    tariffs: "Tariffs",
    tariffFrom: "from $4 / kg",
    terms: "Terms",
    termsValue: "REAL delivery time from 30 to 40 days",
  },
};

export default async function RailDeliveryPage({
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
          <h1 className="mb-8 text-4xl font-bold text-gray-900">{data.title}</h1>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeDo}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-teal-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
              <ul className="space-y-3">
                {data.clients.map((client, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-teal-600">•</span>
                    <span className="text-gray-600">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.tariffs}</h3>
              <p className="text-2xl font-bold text-teal-600">{data.tariffFrom}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.terms}</h3>
              <p className="text-lg font-bold text-teal-600">{data.termsValue}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


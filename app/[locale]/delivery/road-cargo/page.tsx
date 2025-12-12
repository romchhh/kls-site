import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Автомобільні вантажні перевезення (FTL/LTL)",
    intro: "Гнучкий та швидкий спосіб доставки з Китаю до України, країн ЄС та за індивідуальними міжнародними маршрутами.",
    ftlTitle: "FTL (Full Truck Load) — повне завантаження автомобіля",
    ftlFeatures: [
      "максимальна швидкість та безпека",
      "прямий маршрут без перевантажень",
      "оптимально для великих партій і цінного вантажу",
    ],
    ltlTitle: "LTL (Less Truck Load) — збірні автоперевезення",
    ltlFeatures: [
      "оплата лише за зайнятий об'єм",
      "ідеально для невеликих партій",
      "регулярна консолідація та гнучкі маршрути",
    ],
    whatWeOffer: "Ми пропонуємо",
    services: [
      "тентовані, рефрижераторні, борти, мікроавтобуси",
      "експрес-доставка, групаж, ADR",
      "транспортування палетних та негабаритних вантажів",
      "оптимальні тарифи та швидкі терміни доставки",
    ],
  },
  ru: {
    title: "Автомобильные грузовые перевозки (FTL/LTL)",
    intro: "Гибкий и быстрый способ доставки из Китая в Украину, страны ЕС и по индивидуальным международным маршрутам.",
    ftlTitle: "FTL (Full Truck Load) — полная загрузка автомобиля",
    ftlFeatures: [
      "максимальная скорость и безопасность",
      "прямой маршрут без перегрузок",
      "оптимально для крупных партий и ценного груза",
    ],
    ltlTitle: "LTL (Less Truck Load) — сборные автоперевозки",
    ltlFeatures: [
      "оплата только за занятый объем",
      "идеально для небольших партий",
      "регулярная консолидация и гибкие маршруты",
    ],
    whatWeOffer: "Мы предлагаем",
    services: [
      "тентованные, рефрижераторные, борта, микроавтобусы",
      "экспресс-доставка, групповые перевозки, ADR",
      "транспортировка палетных и негабаритных грузов",
      "оптимальные тарифы и быстрые сроки доставки",
    ],
  },
  en: {
    title: "Road Freight Transportation (FTL / LTL)",
    intro: "Flexible and fast delivery method from China to Ukraine, EU countries and on individual international routes.",
    ftlTitle: "FTL (Full Truck Load) — full truck loading",
    ftlFeatures: [
      "maximum speed and safety",
      "direct route without transshipments",
      "optimal for large batches and valuable cargo",
    ],
    ltlTitle: "LTL (Less Truck Load) — consolidated road transportation",
    ltlFeatures: [
      "payment only for occupied volume",
      "perfect for small batches",
      "regular consolidation and flexible routes",
    ],
    whatWeOffer: "We offer",
    services: [
      "curtain-sided, refrigerated, flatbed, minibuses",
      "express delivery, groupage, ADR",
      "transportation of palletized and oversized cargo",
      "optimal tariffs and fast delivery times",
    ],
  },
};

export default async function RoadCargoPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-indigo-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.ftlTitle}</h2>
              <ul className="space-y-3">
                {data.ftlFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-indigo-600">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-purple-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.ltlTitle}</h2>
              <ul className="space-y-3">
                {data.ltlFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-purple-600">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeOffer}</h2>
            <ul className="space-y-3">
              {data.services.map((service, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-indigo-600">•</span>
                  <span className="text-gray-600">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


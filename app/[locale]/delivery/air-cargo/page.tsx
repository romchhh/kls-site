import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Авіаційні вантажні перевезення (FCL / LCL)",
    intro: "Ми забезпечуємо швидку та надійну авіадоставку по всьому світу, пропонуючи як індивідуальні, так і збірні рішення під будь-які обсяги вантажів.",
    fclTitle: "FCL — індивідуальна авіа-відправка",
    fclDescription: "FCL (Full Cargo Load) — виділене вантажне місце або окрема авіапалета/контейнер для вашої партії.",
    fclAdvantages: "Переваги:",
    fclAdvantagesList: [
      "найкоротші транзитні терміни",
      "мінімальний ризик пошкодження",
      "пріоритетна обробка вантажу",
      "ідеально для термінових або високовартісних відправлень",
    ],
    lclTitle: "LCL — авіа-збірні вантажі",
    lclDescription: "LCL (Less than Cargo Load) — консолідація дрібних партій у спільне авіавантаження.",
    lclAdvantages: "Переваги:",
    lclAdvantagesList: [
      "значно нижча вартість у порівнянні з повною відправкою",
      "регулярні рейси та гнучкий графік",
      "підходить для невеликих товарів, e-commerce, тестових партій",
    ],
    whatWeProvide: "Ми забезпечуємо",
    services: [
      "відправлення з будь-яких міжнародних аеропортів",
      "варіанти door-to-door та airport-to-airport",
      "контроль температури, спеціальні умови, ADR",
      "митне оформлення та повний документальний супровід",
    ],
  },
  ru: {
    title: "Авиационные грузовые перевозки (FCL / LCL)",
    intro: "Мы обеспечиваем быструю и надежную авиадоставку по всему миру, предлагая как индивидуальные, так и сборные решения под любые объемы грузов.",
    fclTitle: "FCL — индивидуальная авиа-отправка",
    fclDescription: "FCL (Full Cargo Load) — выделенное грузовое место или отдельная авиапалета/контейнер для вашей партии.",
    fclAdvantages: "Преимущества:",
    fclAdvantagesList: [
      "самые короткие транзитные сроки",
      "минимальный риск повреждения",
      "приоритетная обработка груза",
      "идеально для срочных или высокоценных отправлений",
    ],
    lclTitle: "LCL — авиа-сборные грузы",
    lclDescription: "LCL (Less than Cargo Load) — консолидация мелких партий в общее авиагруз.",
    lclAdvantages: "Преимущества:",
    lclAdvantagesList: [
      "значительно ниже стоимость по сравнению с полной отправкой",
      "регулярные рейсы и гибкий график",
      "подходит для небольших товаров, e-commerce, тестовых партий",
    ],
    whatWeProvide: "Мы обеспечиваем",
    services: [
      "отправления из любых международных аэропортов",
      "варианты door-to-door и airport-to-airport",
      "контроль температуры, специальные условия, ADR",
      "таможенное оформление и полное документальное сопровождение",
    ],
  },
  en: {
    title: "Air Cargo Transportation (FCL / LCL)",
    intro: "We provide fast and reliable air delivery worldwide, offering both individual and consolidated solutions for any cargo volumes.",
    fclTitle: "FCL — individual air shipment",
    fclDescription: "FCL (Full Cargo Load) — dedicated cargo space or separate air pallet/container for your batch.",
    fclAdvantages: "Advantages:",
    fclAdvantagesList: [
      "shortest transit times",
      "minimal damage risk",
      "priority cargo handling",
      "perfect for urgent or high-value shipments",
    ],
    lclTitle: "LCL — air consolidated cargo",
    lclDescription: "LCL (Less than Cargo Load) — consolidation of small batches into shared air cargo.",
    lclAdvantages: "Advantages:",
    lclAdvantagesList: [
      "significantly lower cost compared to full shipment",
      "regular flights and flexible schedule",
      "suitable for small goods, e-commerce, test batches",
    ],
    whatWeProvide: "We provide",
    services: [
      "shipments from any international airports",
      "door-to-door and airport-to-airport options",
      "temperature control, special conditions, ADR",
      "customs clearance and full documentary support",
    ],
  },
};

export default async function AirCargoPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 space-y-12">
            <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.fclTitle}</h2>
              <p className="mb-6 text-gray-600">{data.fclDescription}</p>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.fclAdvantages}</h3>
                <ul className="space-y-2">
                  {data.fclAdvantagesList.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border-2 border-sky-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.lclTitle}</h2>
              <p className="mb-6 text-gray-600">{data.lclDescription}</p>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.lclAdvantages}</h3>
                <ul className="space-y-2">
                  {data.lclAdvantagesList.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-sky-600">•</span>
                      <span className="text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeProvide}</h2>
            <ul className="space-y-3">
              {data.services.map((service, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
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


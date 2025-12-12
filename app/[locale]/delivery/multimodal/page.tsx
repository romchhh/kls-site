import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Мультимодальна доставка",
    subtitle: "МУЛЬТИМОДАЛЬНА ДОСТАВКА (ЖД + АВТО + МОРЕ + АВІА)",
    intro: "Гнучкий маршрут під ваш бюджет. \"Під ключ\".",
    description: "Ми комбінуємо різні види транспорту, щоб забезпечити найкращий баланс швидкості, ціни та безпеки. Один контракт, одна відповідальність, один оператор.",
    whatIncludes: "Що може входити у послугу",
    services: [
      "Забір вантажу з будь-якої адреси",
      "Мультимодальний маршрут (авто + жд + море/авіа)",
      "Консолідація дрібних відправлень",
      "Оформлення документів",
      "Страхування за бажанням",
      "Доставка до складу/дверей отримувача",
    ],
    combinations: "Наші можливі комбінації",
    comboList: [
      "Залізниця + автодоставка",
      "Залізниця + морський фрахт",
      "Авіа + авто (для термінових вантажів)",
      "Комплексні маршрути через порти ЄС/Азії",
    ],
    advantages: "Переваги мультимодальної логістики",
    advantagesList: [
      "Дешевше, ніж авіа",
      "Швидше, ніж чисто морем",
      "Гнучкий маршрут під ваш бюджет",
      "Працюємо з будь-якою вагою",
      "Один оператор на всьому шляху",
    ],
    tariffs: "Тарифи",
    tariffFrom: "від 6$ / кг",
    terms: "Терміни",
    termsValue: "РЕАЛЬНИЙ термін нашої доставки від 25 до 35 днів",
  },
  ru: {
    title: "Мультимодальная доставка",
    subtitle: "МУЛЬТИМОДАЛЬНАЯ ДОСТАВКА (ЖД + АВТО + МОРЕ + АВИА)",
    intro: "Гибкий маршрут под ваш бюджет. \"Под ключ\".",
    description: "Мы комбинируем разные виды транспорта, чтобы обеспечить лучший баланс скорости, цены и безопасности. Один контракт, одна ответственность, один оператор.",
    whatIncludes: "Что может входить в услугу",
    services: [
      "Забор груза с любого адреса",
      "Мультимодальный маршрут (авто + жд + море/авиа)",
      "Консолидация мелких отправлений",
      "Оформление документов",
      "Страхование по желанию",
      "Доставка до склада/дверей получателя",
    ],
    combinations: "Наши возможные комбинации",
    comboList: [
      "Железная дорога + автодоставка",
      "Железная дорога + морской фрахт",
      "Авиа + авто (для срочных грузов)",
      "Комплексные маршруты через порты ЕС/Азии",
    ],
    advantages: "Преимущества мультимодальной логистики",
    advantagesList: [
      "Дешевле, чем авиа",
      "Быстрее, чем чисто морем",
      "Гибкий маршрут под ваш бюджет",
      "Работаем с любым весом",
      "Один оператор на всем пути",
    ],
    tariffs: "Тарифы",
    tariffFrom: "от 6$ / кг",
    terms: "Сроки",
    termsValue: "РЕАЛЬНЫЙ срок нашей доставки от 25 до 35 дней",
  },
  en: {
    title: "Multimodal Delivery",
    subtitle: "MULTIMODAL DELIVERY (RAIL + AUTO + SEA + AIR)",
    intro: "Flexible route for your budget. \"Turnkey\".",
    description: "We combine different types of transport to ensure the best balance of speed, price and safety. One contract, one responsibility, one operator.",
    whatIncludes: "What may be included in the service",
    services: [
      "Cargo pickup from any address",
      "Multimodal route (auto + rail + sea/air)",
      "Consolidation of small shipments",
      "Documentation",
      "Insurance if desired",
      "Delivery to warehouse/door of recipient",
    ],
    combinations: "Our possible combinations",
    comboList: [
      "Railway + auto delivery",
      "Railway + sea freight",
      "Air + auto (for urgent cargo)",
      "Complex routes through EU/Asia ports",
    ],
    advantages: "Advantages of multimodal logistics",
    advantagesList: [
      "Cheaper than air",
      "Faster than pure sea",
      "Flexible route for your budget",
      "We work with any weight",
      "One operator for the entire route",
    ],
    tariffs: "Tariffs",
    tariffFrom: "from $6 / kg",
    terms: "Terms",
    termsValue: "REAL delivery time from 25 to 35 days",
  },
};

export default async function MultimodalDeliveryPage({
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
          <p className="mb-2 text-xl font-semibold text-gray-700">{data.subtitle}</p>
          <p className="mb-8 text-lg text-gray-600">{data.intro}</p>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <p className="text-lg text-gray-700">{data.description}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatIncludes}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-purple-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.combinations}</h2>
              <ul className="space-y-3">
                {data.comboList.map((combo, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-purple-600">•</span>
                    <span className="text-gray-600">{combo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
            <ul className="space-y-2">
              {data.advantagesList.map((advantage, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✔</span>
                  <span className="text-gray-700">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.tariffs}</h3>
              <p className="text-2xl font-bold text-purple-600">{data.tariffFrom}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.terms}</h3>
              <p className="text-lg font-bold text-purple-600">{data.termsValue}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Морські контейнерні перевезення (FCL / LCL)",
    intro: "Ми забезпечуємо надійні та вигідні морські контейнерні перевезення по всьому світу, пропонуючи як FCL, так і LCL рішення — залежно від ваших обсягів, термінів та бюджету.",
    fclTitle: "FCL — повне завантаження контейнера",
    fclDescription: "FCL (Full Container Load) — оптимальний вибір для великих партій або вантажів, що потребують підвищеної безпеки.",
    fclAdvantages: "Переваги FCL:",
    fclAdvantagesList: [
      "повний контроль над контейнером",
      "мінімальна кількість перевалок",
      "швидші транзитні терміни",
      "вигідна вартість для великих обсягів",
      "знижений ризик пошкоджень та змішування вантажів",
    ],
    fclForWhom: "Підходить для регулярних поставок, промислових партій, цінних або чутливих товарів.",
    lclTitle: "LCL — збірні відправлення",
    lclDescription: "LCL (Less than Container Load) — ідеальне рішення для малих та середніх вантажів, коли немає потреби орендувати цілий контейнер.",
    lclAdvantages: "Переваги LCL:",
    lclAdvantagesList: [
      "оплата лише за фактичний об'єм або вагу",
      "оптимальна вартість для невеликих партій",
      "гнучкість у плануванні поставок",
      "швидкий старт — не потрібно чекати заповнення контейнера",
    ],
    lclForWhom: "Підходить для малого бізнесу, e-commerce, тестових партій та регулярних відправок невеликими обсягами.",
    whatWeOffer: "Що ми пропонуємо",
    services: [
      "доставки port-to-port та door-to-door",
      "повний супровід документів",
      "митне оформлення",
      "роботу зі стандартними та спеціалізованими контейнерами (20', 40', High Cube, рефрижератори тощо)",
      "глобальну мережу агентів і надійних судноплавних ліній",
    ],
  },
  ru: {
    title: "Морские контейнерные перевозки (FCL / LCL)",
    intro: "Мы обеспечиваем надежные и выгодные морские контейнерные перевозки по всему миру, предлагая как FCL, так и LCL решения — в зависимости от ваших объемов, сроков и бюджета.",
    fclTitle: "FCL — полная загрузка контейнера",
    fclDescription: "FCL (Full Container Load) — оптимальный выбор для крупных партий или грузов, требующих повышенной безопасности.",
    fclAdvantages: "Преимущества FCL:",
    fclAdvantagesList: [
      "полный контроль над контейнером",
      "минимальное количество перевалок",
      "более быстрые транзитные сроки",
      "выгодная стоимость для больших объемов",
      "сниженный риск повреждений и смешивания грузов",
    ],
    fclForWhom: "Подходит для регулярных поставок, промышленных партий, ценных или чувствительных товаров.",
    lclTitle: "LCL — сборные отправления",
    lclDescription: "LCL (Less than Container Load) — идеальное решение для малых и средних грузов, когда нет необходимости арендовать целый контейнер.",
    lclAdvantages: "Преимущества LCL:",
    lclAdvantagesList: [
      "оплата только за фактический объем или вес",
      "оптимальная стоимость для небольших партий",
      "гибкость в планировании поставок",
      "быстрый старт — не нужно ждать заполнения контейнера",
    ],
    lclForWhom: "Подходит для малого бизнеса, e-commerce, тестовых партий и регулярных отправлений небольшими объемами.",
    whatWeOffer: "Что мы предлагаем",
    services: [
      "доставки port-to-port и door-to-door",
      "полное сопровождение документов",
      "таможенное оформление",
      "работу со стандартными и специализированными контейнерами (20', 40', High Cube, рефрижераторы и т.д.)",
      "глобальную сеть агентов и надежных судоходных линий",
    ],
  },
  en: {
    title: "Sea Container Transportation (FCL / LCL)",
    intro: "We provide reliable and profitable sea container transportation worldwide, offering both FCL and LCL solutions — depending on your volumes, terms and budget.",
    fclTitle: "FCL — full container load",
    fclDescription: "FCL (Full Container Load) — optimal choice for large batches or cargo requiring increased security.",
    fclAdvantages: "FCL advantages:",
    fclAdvantagesList: [
      "full control over container",
      "minimal number of transshipments",
      "faster transit times",
      "profitable cost for large volumes",
      "reduced risk of damage and cargo mixing",
    ],
    fclForWhom: "Suitable for regular deliveries, industrial batches, valuable or sensitive goods.",
    lclTitle: "LCL — consolidated shipments",
    lclDescription: "LCL (Less than Container Load) — ideal solution for small and medium cargo when there's no need to rent a whole container.",
    lclAdvantages: "LCL advantages:",
    lclAdvantagesList: [
      "payment only for actual volume or weight",
      "optimal cost for small batches",
      "flexibility in delivery planning",
      "quick start — no need to wait for container filling",
    ],
    lclForWhom: "Suitable for small business, e-commerce, test batches and regular shipments in small volumes.",
    whatWeOffer: "What we offer",
    services: [
      "port-to-port and door-to-door deliveries",
      "full document support",
      "customs clearance",
      "work with standard and specialized containers (20', 40', High Cube, refrigerators, etc.)",
      "global network of agents and reliable shipping lines",
    ],
  },
};

export default async function SeaContainerPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 space-y-12">
            <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.fclTitle}</h2>
              <p className="mb-6 text-gray-600">{data.fclDescription}</p>
              <div className="mb-4">
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
              <p className="text-gray-600 italic">{data.fclForWhom}</p>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{data.lclTitle}</h2>
              <p className="mb-6 text-gray-600">{data.lclDescription}</p>
              <div className="mb-4">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.lclAdvantages}</h3>
                <ul className="space-y-2">
                  {data.lclAdvantagesList.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-teal-600">•</span>
                      <span className="text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-600 italic">{data.lclForWhom}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeOffer}</h2>
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


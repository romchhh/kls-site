import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Залізничні вантажні перевезення FCL/LCL",
    intro: "Надійне рішення для середніх та великих партій, коли важлива вартість та стабільність доставки. Ідеально підходить для маршрутів Європа — Азія.",
    advantages: "Переваги залізничної доставки",
    advantagesList: [
      "оптимальне співвідношення ціни та швидкості",
      "високий рівень безпеки вантажу",
      "стабільні графіки та відсутність погодних ризиків",
      "підходить для контейнерних і збірних вантажів",
      "можливість перевезення об'ємних, важких або промислових товарів",
    ],
    ourCapabilities: "Наші можливості",
    services: [
      "FCL та LCL контейнерні відправлення",
      "мультимодальні рішення (ж/д + авто або морський транспорт)",
      "перевезення 20' / 40' контейнерів, High Cube",
      "повний документальний супровід та митні процедури",
      "door-to-door доставка через міжнародні термінали",
    ],
  },
  ru: {
    title: "Железнодорожные грузовые перевозки FCL/LCL",
    intro: "Надежное решение для средних и крупных партий, когда важны стоимость и стабильность доставки. Идеально подходит для маршрутов Европа — Азия.",
    advantages: "Преимущества железнодорожной доставки",
    advantagesList: [
      "оптимальное соотношение цены и скорости",
      "высокий уровень безопасности груза",
      "стабильные графики и отсутствие погодных рисков",
      "подходит для контейнерных и сборных грузов",
      "возможность перевозки объемных, тяжелых или промышленных товаров",
    ],
    ourCapabilities: "Наши возможности",
    services: [
      "FCL и LCL контейнерные отправления",
      "мультимодальные решения (ж/д + авто или морской транспорт)",
      "перевозка 20' / 40' контейнеров, High Cube",
      "полное документальное сопровождение и таможенные процедуры",
      "door-to-door доставка через международные терминалы",
    ],
  },
  en: {
    title: "Rail Freight Transportation FCL / LCL",
    intro: "Reliable solution for medium and large batches when cost and delivery stability are important. Perfect for Europe — Asia routes.",
    advantages: "Rail delivery advantages",
    advantagesList: [
      "optimal price-to-speed ratio",
      "high level of cargo security",
      "stable schedules and no weather risks",
      "suitable for container and consolidated cargo",
      "ability to transport bulky, heavy or industrial goods",
    ],
    ourCapabilities: "Our capabilities",
    services: [
      "FCL and LCL container shipments",
      "multimodal solutions (rail + auto or sea transport)",
      "transportation of 20' / 40' containers, High Cube",
      "full documentary support and customs procedures",
      "door-to-door delivery through international terminals",
    ],
  },
};

export default async function RailCargoPage({
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
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-amber-600">•</span>
                    <span className="text-gray-600">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.ourCapabilities}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-amber-600">•</span>
                    <span className="text-gray-600">{service}</span>
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


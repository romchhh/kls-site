import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "PORT TO PORT",
    intro: "Port-to-Port — це міжнародна доставка вантажу від порту відправлення до порту призначення без внутрішніх перевезень. Ви самостійно доставляєте товар до порту відправлення та забираєте його в порті прибуття. (порт чи аеропорт)",
    whatIncludes: "Що включає Port-to-Port:",
    services: [
      "Прийом вантажу в порту Китаю (аеропорту в т.ч.)",
      "Контейнерне або LCL-завантаження",
      "Міжнародне морське або авіаперевезення",
      "Вивантаження у порту країни призначення",
    ],
    whatNotIncludes: "Що НЕ входить:",
    notIncluded: [
      "Доставка «Від дверей»",
      "Митне оформлення",
      "Оплата мит та податків",
      "Внутрішня доставка по країні імпорту",
    ],
    forWhom: "Кому підходить",
    clients: [
      "Вантажам великого об'єму (FCL, LCL)",
      "Клієнтам, які хочуть контролювати імпорт та локальну доставку",
      "Тим, хто шукає найдешевший спосіб міжнародного транспортування",
    ],
    advantages: "Переваги:",
    advantagesList: [
      "Найнижча вартість міжнародної доставки",
      "Гнучкість у виборі маршруту та порту",
      "Підходить для великих і регулярних відправок",
    ],
    cta: "Потрібен розрахунок Port-to-Port? Напишіть нам — підберемо оптимальний маршрут і ставку.",
  },
  ru: {
    title: "PORT TO PORT",
    intro: "Port-to-Port — это международная доставка груза от порта отправления до порта назначения без внутренних перевозок. Вы самостоятельно доставляете товар до порта отправления и забираете его в порту прибытия. (порт или аэропорт)",
    whatIncludes: "Что включает Port-to-Port:",
    services: [
      "Прием груза в порту Китая (аэропорту в т.ч.)",
      "Контейнерная или LCL-загрузка",
      "Международная морская или авиаперевозка",
      "Выгрузка в порту страны назначения",
    ],
    whatNotIncludes: "Что НЕ входит:",
    notIncluded: [
      "Доставка «От дверей»",
      "Таможенное оформление",
      "Оплата пошлин и налогов",
      "Внутренняя доставка по стране импорта",
    ],
    forWhom: "Кому подходит",
    clients: [
      "Грузам большого объема (FCL, LCL)",
      "Клиентам, которые хотят контролировать импорт и локальную доставку",
      "Тем, кто ищет самый дешевый способ международной транспортировки",
    ],
    advantages: "Преимущества:",
    advantagesList: [
      "Самая низкая стоимость международной доставки",
      "Гибкость в выборе маршрута и порта",
      "Подходит для крупных и регулярных отправлений",
    ],
    cta: "Нужен расчет Port-to-Port? Напишите нам — подберем оптимальный маршрут и ставку.",
  },
  en: {
    title: "PORT TO PORT",
    intro: "Port-to-Port is international cargo delivery from port of departure to port of destination without internal transportation. You independently deliver goods to the port of departure and pick them up at the port of arrival. (port or airport)",
    whatIncludes: "What Port-to-Port includes:",
    services: [
      "Cargo acceptance at China port (airport included)",
      "Container or LCL loading",
      "International sea or air transportation",
      "Unloading at destination country port",
    ],
    whatNotIncludes: "What is NOT included:",
    notIncluded: [
      "Door-to-door delivery",
      "Customs clearance",
      "Payment of duties and taxes",
      "Internal delivery within import country",
    ],
    forWhom: "For whom it suits",
    clients: [
      "Large volume cargo (FCL, LCL)",
      "Clients who want to control import and local delivery",
      "Those looking for the cheapest international transportation method",
    ],
    advantages: "Advantages:",
    advantagesList: [
      "Lowest cost of international delivery",
      "Flexibility in route and port selection",
      "Suitable for large and regular shipments",
    ],
    cta: "Need a Port-to-Port calculation? Write to us — we'll select the optimal route and rate.",
  },
};

export default async function PortToPortPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatIncludes}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-cyan-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatNotIncludes}</h2>
              <ul className="space-y-3">
                {data.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-red-600">✗</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
            <ul className="space-y-2 mb-6">
              {data.clients.map((client, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-600">•</span>
                  <span className="text-gray-600">{client}</span>
                </li>
              ))}
            </ul>
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.advantages}</h3>
              <ul className="space-y-2">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✔</span>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
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


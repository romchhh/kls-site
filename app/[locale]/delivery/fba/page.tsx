import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Доставка на склади FBA",
    subtitle: "Повний супровід від Китаю до складів Amazon без вашої участі",
    intro: "Пропонуємо комплексну логістичну послугу DDP (Delivered Duty Paid) — найзручніший та найпопулярніший спосіб доставки товарів з Китаю на склади Amazon FBA. Ми беремо на себе весь процес: від забору товару у виробника до передачі на склад Amazon. Ви отримуєте доставку «під ключ» без зайвої бюрократії, ризиків і непередбачених витрат.",
    whatIncludes: "Що може входити у нашу послугу",
    services: [
      "Забір товару з фабрики",
      "Підготовка та маркування під стандарти Amazon FBA",
      "Доставка авіа / морем / залізницею",
      "Митне оформлення та сплата податків",
      "Domestic-доставка до складів Amazon",
      "Повний супровід та трекінг",
    ],
    advantages: "Наші переваги",
    advantagesList: [
      "Фіксована ціна за кг",
      "Жодної бюрократії для вас",
      "Швидкі терміни доставки",
      "Повна відповідальність за кожен етап",
      "Прозора комунікація та звіти",
    ],
    deliveryTypes: "Види доставки",
    deliveryOptions: [
      "Авіа – 8–15 днів",
      "Море – 55–65 днів",
      "Потяг (ЄС) – 30–35 днів",
    ],
    cta: "Готові доставити ваш товар на FBA? Зв'яжіться з нами — зробимо точний розрахунок під вашу партію.",
  },
  ru: {
    title: "Доставка на склады FBA",
    subtitle: "Полное сопровождение от Китая до складов Amazon без вашего участия",
    intro: "Предлагаем комплексную логистическую услугу DDP (Delivered Duty Paid) — самый удобный и популярный способ доставки товаров из Китая на склады Amazon FBA. Мы берем на себя весь процесс: от забора товара у производителя до передачи на склад Amazon. Вы получаете доставку «под ключ» без лишней бюрократии, рисков и непредвиденных расходов.",
    whatIncludes: "Что может входить в нашу услугу",
    services: [
      "Забор товара с фабрики",
      "Подготовка и маркировка под стандарты Amazon FBA",
      "Доставка авиа / морем / железной дорогой",
      "Таможенное оформление и уплата налогов",
      "Domestic-доставка до складов Amazon",
      "Полное сопровождение и трекинг",
    ],
    advantages: "Наши преимущества",
    advantagesList: [
      "Фиксированная цена за кг",
      "Никакой бюрократии для вас",
      "Быстрые сроки доставки",
      "Полная ответственность за каждый этап",
      "Прозрачная коммуникация и отчеты",
    ],
    deliveryTypes: "Виды доставки",
    deliveryOptions: [
      "Авиа – 8–15 дней",
      "Море – 55–65 дней",
      "Поезд (ЕС) – 30–35 дней",
    ],
    cta: "Готовы доставить ваш товар на FBA? Свяжитесь с нами — сделаем точный расчет под вашу партию.",
  },
  en: {
    title: "Delivery to FBA Warehouses",
    subtitle: "Full support from China to Amazon warehouses without your participation",
    intro: "We offer a comprehensive DDP (Delivered Duty Paid) logistics service — the most convenient and popular way to deliver goods from China to Amazon FBA warehouses. We take care of the entire process: from picking up goods from the manufacturer to transferring to Amazon warehouse. You get turnkey delivery without unnecessary bureaucracy, risks and unforeseen costs.",
    whatIncludes: "What may be included in our service",
    services: [
      "Product pickup from factory",
      "Preparation and labeling according to Amazon FBA standards",
      "Air / sea / rail delivery",
      "Customs clearance and tax payment",
      "Domestic delivery to Amazon warehouses",
      "Full support and tracking",
    ],
    advantages: "Our advantages",
    advantagesList: [
      "Fixed price per kg",
      "No bureaucracy for you",
      "Fast delivery times",
      "Full responsibility for each stage",
      "Transparent communication and reports",
    ],
    deliveryTypes: "Delivery types",
    deliveryOptions: [
      "Air – 8–15 days",
      "Sea – 55–65 days",
      "Train (EU) – 30–35 days",
    ],
    cta: "Ready to deliver your goods to FBA? Contact us — we'll make an accurate calculation for your batch.",
  },
};

export default async function FBADeliveryPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatIncludes}</h2>
              <ul className="space-y-3">
                {data.services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-orange-600">•</span>
                    <span className="text-gray-600">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✔</span>
                    <span className="text-gray-600">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.deliveryTypes}</h2>
            <ul className="space-y-2">
              {data.deliveryOptions.map((option, index) => (
                <li key={index} className="text-gray-700">{option}</li>
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


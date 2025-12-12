import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Cross-Border",
    intro: "Cross-Border — це міжнародна доставка товарів через кордон між двома країнами без складного імпорту з вашого боку. Товар перевозиться з однієї країни в іншу через офіційні або спрощені митні канали, після чого передається локальній кур'єрській службі для доставки \"до дверей\".",
    howItWorks: "Як це працює:",
    steps: [
      "Забір товару у відправника",
      "Митний транзит або спрощене оформлення на кордоні",
      "Перетин кордону (Китай → ЄС, Польща → Німеччина, Китай → Україна тощо)",
      "Передача місцевому перевізнику",
      "Доставка до складу або до дверей отримувача",
    ],
    advantages: "Переваги Cross-Border:",
    advantagesList: [
      "Швидше, ніж класична міжнародна доставка",
      "Оптимальна ціна",
      "Спрощені митні процедури",
      "Ідеально для e-commerce, маркетплейсів і регулярних відправок",
    ],
    forWhom: "Кому підходить:",
    clients: [
      "Інтернет-магазинам",
      "Amazon, eBay, Shopify продавцям",
      "Компаніям, які працюють у кількох країнах",
      "Доставкам між сусідніми або близькими регіонами",
    ],
    cta: "Потрібна Cross-Border доставка? Звертайтесь — підберемо найшвидший і найбільш вигідний маршрут.",
  },
  ru: {
    title: "Cross-Border",
    intro: "Cross-Border — это международная доставка товаров через границу между двумя странами без сложного импорта с вашей стороны. Товар перевозится из одной страны в другую через официальные или упрощенные таможенные каналы, после чего передается локальной курьерской службе для доставки \"до дверей\".",
    howItWorks: "Как это работает:",
    steps: [
      "Забор товара у отправителя",
      "Таможенный транзит или упрощенное оформление на границе",
      "Пересечение границы (Китай → ЕС, Польша → Германия, Китай → Украина и т.д.)",
      "Передача местному перевозчику",
      "Доставка до склада или до дверей получателя",
    ],
    advantages: "Преимущества Cross-Border:",
    advantagesList: [
      "Быстрее, чем классическая международная доставка",
      "Оптимальная цена",
      "Упрощенные таможенные процедуры",
      "Идеально для e-commerce, маркетплейсов и регулярных отправлений",
    ],
    forWhom: "Кому подходит:",
    clients: [
      "Интернет-магазинам",
      "Amazon, eBay, Shopify продавцам",
      "Компаниям, которые работают в нескольких странах",
      "Доставкам между соседними или близкими регионами",
    ],
    cta: "Нужна Cross-Border доставка? Обращайтесь — подберем самый быстрый и наиболее выгодный маршрут.",
  },
  en: {
    title: "Cross-Border",
    intro: "Cross-Border is international delivery of goods across the border between two countries without complex import on your part. Goods are transported from one country to another through official or simplified customs channels, then transferred to a local courier service for \"door-to-door\" delivery.",
    howItWorks: "How it works:",
    steps: [
      "Product pickup from sender",
      "Customs transit or simplified clearance at border",
      "Border crossing (China → EU, Poland → Germany, China → Ukraine, etc.)",
      "Transfer to local carrier",
      "Delivery to warehouse or door of recipient",
    ],
    advantages: "Cross-Border advantages:",
    advantagesList: [
      "Faster than classic international delivery",
      "Optimal price",
      "Simplified customs procedures",
      "Perfect for e-commerce, marketplaces and regular shipments",
    ],
    forWhom: "For whom it suits:",
    clients: [
      "Online stores",
      "Amazon, eBay, Shopify sellers",
      "Companies working in multiple countries",
      "Deliveries between neighboring or close regions",
    ],
    cta: "Need Cross-Border delivery? Contact us — we'll select the fastest and most profitable route.",
  },
};

export default async function CrossBorderPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.howItWorks}</h2>
            <ol className="space-y-4">
              {data.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-gray-600">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-600 font-bold">✔</span>
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
                    <span className="mt-1 text-green-600">•</span>
                    <span className="text-gray-600">{client}</span>
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


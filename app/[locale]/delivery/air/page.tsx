import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Авіа перевезення",
    subtitle: "Авіа-доставка — коли швидкість і гнучкість вирішують все",
    intro: "Авіаперевезення — найкраще рішення для бізнесу, який працює з товарами, де час = прибуток. Особливо коли йдеться про малогабаритні, трендові або термінові вантажі.",
    sections: [
      {
        title: "Максимальна швидкість",
        text: "Авіа — найшвидший спосіб доставки. Ідеально, коли товар потрібен «на вчора», а кожна доба затримки коштує бізнесу грошей.",
      },
      {
        title: "Створено для малогабаритних вантажів",
        text: "Компактні партії, преміальні товари, невеликі обсяги — саме тут авіа показує максимум ефективності. Не потрібно чекати заповнення контейнера або переплачувати за великі об'єми.",
      },
      {
        title: "Трендові товари — на ринку першими",
        text: "Популярні новинки, електроніка, аксесуари, сезонний одяг — усе, що має короткий пік попиту, повинно приїжджати максимально швидко. Авіадоставка дає бізнесу перевагу над конкурентами.",
      },
      {
        title: "Працюємо навіть із проблемними вантажами",
        text: "Ми беремо в роботу те, що часто ускладнює логістику: хімія, електроніка, різний одяг та взуття. Це дозволяє бізнесу імпортувати складні категорії без зайвих ризиків та затримок.",
      },
    ],
    cta: "Потрібно доставити терміновий, трендовий чи проблемний вантаж? Ми впораємося з цим.",
    tariffs: "Тарифи",
    tariffFrom: "від 10$ / кг",
    terms: "Терміни",
    termsValue: "РЕАЛЬНИЙ термін нашої доставки від 15 до 21 дня",
  },
  ru: {
    title: "Авиа перевозки",
    subtitle: "Авиа-доставка — когда скорость и гибкость решают все",
    intro: "Авиаперевозки — лучшее решение для бизнеса, который работает с товарами, где время = прибыль. Особенно когда речь идет о малогабаритных, трендовых или срочных грузах.",
    sections: [
      {
        title: "Максимальная скорость",
        text: "Авиа — самый быстрый способ доставки. Идеально, когда товар нужен «на вчера», а каждый день задержки стоит бизнесу денег.",
      },
      {
        title: "Создано для малогабаритных грузов",
        text: "Компактные партии, премиальные товары, небольшие объемы — именно здесь авиа показывает максимум эффективности. Не нужно ждать заполнения контейнера или переплачивать за большие объемы.",
      },
      {
        title: "Трендовые товары — на рынке первыми",
        text: "Популярные новинки, электроника, аксессуары, сезонная одежда — все, что имеет короткий пик спроса, должно приезжать максимально быстро. Авиадоставка дает бизнесу преимущество над конкурентами.",
      },
      {
        title: "Работаем даже с проблемными грузами",
        text: "Мы берем в работу то, что часто усложняет логистику: химия, электроника, разная одежда и обувь. Это позволяет бизнесу импортировать сложные категории без лишних рисков и задержек.",
      },
    ],
    cta: "Нужно доставить срочный, трендовый или проблемный груз? Мы справимся с этим.",
    tariffs: "Тарифы",
    tariffFrom: "от 10$ / кг",
    terms: "Сроки",
    termsValue: "РЕАЛЬНЫЙ срок нашей доставки от 15 до 21 дня",
  },
  en: {
    title: "Air Transportation",
    subtitle: "Air delivery — when speed and flexibility decide everything",
    intro: "Air transportation is the best solution for businesses that work with goods where time = profit. Especially when it comes to compact, trendy or urgent cargo.",
    sections: [
      {
        title: "Maximum speed",
        text: "Air is the fastest delivery method. Perfect when goods are needed 'yesterday', and each day of delay costs the business money.",
      },
      {
        title: "Created for compact cargo",
        text: "Compact batches, premium goods, small volumes — this is where air shows maximum efficiency. No need to wait for container filling or overpay for large volumes.",
      },
      {
        title: "Trendy goods — first to market",
        text: "Popular novelties, electronics, accessories, seasonal clothing — everything with a short demand peak should arrive as quickly as possible. Air delivery gives businesses an advantage over competitors.",
      },
      {
        title: "We work even with problematic cargo",
        text: "We take on what often complicates logistics: chemicals, electronics, various clothing and footwear. This allows businesses to import complex categories without unnecessary risks and delays.",
      },
    ],
    cta: "Need to deliver urgent, trendy or problematic cargo? We'll handle it.",
    tariffs: "Tariffs",
    tariffFrom: "from $10 / kg",
    terms: "Terms",
    termsValue: "REAL delivery time from 15 to 21 days",
  },
};

export default async function AirDeliveryPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="space-y-8 mb-12">
            {data.sections.map((section, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h2 className="mb-3 text-2xl font-semibold text-gray-900">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-2xl bg-gray-50 p-8">
            <p className="mb-6 text-lg font-semibold text-gray-900">{data.cta}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.tariffs}</h3>
              <p className="text-2xl font-bold text-blue-600">{data.tariffFrom}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.terms}</h3>
              <p className="text-lg font-bold text-blue-600">{data.termsValue}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


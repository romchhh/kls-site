import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import { Ship, Plane, Train, Globe } from "lucide-react";
import DeliverySidebarNav from "../../../../components/DeliverySidebarNav";

const seaContent = {
  ua: {
    title: "Морські перевезення",
    subtitle: "Доставка морем — найвигідніший вибір для середнього та великого бізнесу",
    intro: "Працюєте з великими партіями товару? Тоді морська логістика — ваш шлях до суттєвої економії.",
    sections: [
      {
        title: "Економія на об'ємах",
        text: "Морські перевезення дозволяють суттєво знизити собівартість доставки при великих закупівлях. Чим стабільніші ваші обсяги — тим вигідніше кожна поставка.",
      },
      {
        title: "Планові закупівлі без зайвих витрат",
        text: "Навіть із довшим терміном доставки, бізнес може заздалегідь визначити, коли робити замовлення, щоб товар прибув у потрібний період — без переплат за авіа чи терміновість.",
      },
      {
        title: "Раціональне рішення для зростаючого бізнесу",
        text: "Морська логістика допомагає оптимізувати витрати та інвестувати зекономлене у масштабування.",
      },
    ],
    cta: "Готові перейти на більш вигідний формат доставки? Ми забезпечимо надійну та економічну доставку морем.",
    tariffs: "Наші тарифи",
    tariffFrom: "від 1.5$/кг",
    tariffFcl: "FCL - за запитом (Full container load - повний контейнер)",
    terms: "Терміни",
    termsValue: "55-75 днів",
  },
  ru: {
    title: "Морские перевозки",
    subtitle: "Доставка морем — самый выгодный выбор для среднего и крупного бизнеса",
    intro: "Работаете с большими партиями товара? Тогда морская логистика — ваш путь к существенной экономии.",
    sections: [
      {
        title: "Экономия на объемах",
        text: "Морские перевозки позволяют существенно снизить себестоимость доставки при крупных закупках. Чем стабильнее ваши объемы — тем выгоднее каждая поставка.",
      },
      {
        title: "Плановые закупки без лишних расходов",
        text: "Даже с более длительным сроком доставки, бизнес может заранее определить, когда делать заказ, чтобы товар прибыл в нужный период — без переплат за авиа или срочность.",
      },
      {
        title: "Рациональное решение для растущего бизнеса",
        text: "Морская логистика помогает оптимизировать расходы и инвестировать сэкономленное в масштабирование.",
      },
    ],
    cta: "Готовы перейти на более выгодный формат доставки? Мы обеспечим надежную и экономичную доставку морем.",
    tariffs: "Наши тарифы",
    tariffFrom: "от 1.5$/кг",
    tariffFcl: "FCL - по запросу (Full container load - полный контейнер)",
    terms: "Сроки",
    termsValue: "55-75 дней",
  },
  en: {
    title: "Sea Transportation",
    subtitle: "Sea delivery — the most profitable choice for medium and large businesses",
    intro: "Working with large batches of goods? Then sea logistics is your path to significant savings.",
    sections: [
      {
        title: "Volume savings",
        text: "Sea transportation allows you to significantly reduce delivery costs for large purchases. The more stable your volumes — the more profitable each shipment.",
      },
      {
        title: "Planned purchases without extra costs",
        text: "Even with a longer delivery time, businesses can determine in advance when to place an order so that goods arrive in the right period — without overpaying for air or urgency.",
      },
      {
        title: "Rational solution for growing business",
        text: "Sea logistics helps optimize costs and invest savings in scaling.",
      },
    ],
    cta: "Ready to switch to a more profitable delivery format? We will provide reliable and economical sea delivery.",
    tariffs: "Our tariffs",
    tariffFrom: "from $1.5/kg",
    tariffFcl: "FCL - on request (Full container load)",
    terms: "Terms",
    termsValue: "55-75 days",
  },
};

const airContent = {
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

const railContent = {
  ua: {
    title: "Залізничні перевезення",
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

const multimodalContent = {
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

export default async function UkraineTurnkeyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const seaData = seaContent[locale];
  const airData = airContent[locale];
  const railData = railContent[locale];
  const multimodalData = multimodalContent[locale];

  const deliveryTypes = [
    { id: "sea", title: seaData.title, iconId: "ship", color: "teal" },
    { id: "air", title: airData.title, iconId: "plane", color: "blue" },
    { id: "rail", title: railData.title, iconId: "train", color: "amber" },
    { id: "multimodal", title: multimodalData.title, iconId: "globe", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-50 via-teal-50 to-white py-12 sm:py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Title and Description */}
              <div className="lg:col-span-2">
                <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 break-words">
                  {t.delivery.ukraineTurnkey}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed break-words">
                  {locale === "ua" &&
                    "Комплексна доставка вантажів з Китаю в Україну під ключ. Ми беремо на себе всі етапи логістичного процесу від отримання вантажу на складі в Китаї до доставки в Україну."}
                  {locale === "ru" &&
                    "Комплексная доставка грузов из Китая в Украину под ключ. Мы берем на себя все этапы логистического процесса от получения груза на складе в Китае до доставки в Украину."}
                  {locale === "en" &&
                    "Comprehensive delivery of cargo from China to Ukraine turnkey. We take care of all stages of the logistics process from receiving cargo at the warehouse in China to delivery to Ukraine."}
                </p>
              </div>

              {/* Right column - Contact Form */}
              <div className="lg:col-span-1">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </section>

        {/* Content with Sidebar */}
        <section id="content-section" className="py-12 sm:py-20 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-4">
              {/* Left Sidebar Navigation - Desktop only */}
              <DeliverySidebarNav deliveryTypes={deliveryTypes} locale={locale} />

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-20">
                {/* Sea Transportation */}
                <section id="sea" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                      <Ship className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{seaData.title}</h2>
                  </div>
                  <p className="mb-6 text-lg sm:text-xl text-gray-600 break-words">{seaData.subtitle}</p>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-4 sm:p-6 md:p-8">
                    <p className="text-base sm:text-lg text-gray-700 break-words">{seaData.intro}</p>
                  </div>

                  <div className="space-y-6 sm:space-y-8 mb-8">
                    {seaData.sections.map((section, index) => (
                      <div key={index} className="border-l-4 border-teal-500 pl-4 sm:pl-6">
                        <h3 className="mb-3 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{section.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">{section.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8 rounded-2xl bg-gray-50 p-4 sm:p-6 md:p-8">
                    <p className="mb-6 text-base sm:text-lg font-semibold text-gray-900 break-words">{seaData.cta}</p>
                  </div>

                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{seaData.tariffs}</h3>
                      <p className="mb-2 text-xl sm:text-2xl font-bold text-teal-600 break-words">{seaData.tariffFrom}</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{seaData.tariffFcl}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{seaData.terms}</h3>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600 break-words">{seaData.termsValue}</p>
                    </div>
                  </div>
                </section>

                {/* Air Transportation */}
                <section id="air" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-3">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{airData.title}</h2>
                  </div>
                  <p className="mb-6 text-lg sm:text-xl text-gray-600 break-words">{airData.subtitle}</p>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
                    <p className="text-base sm:text-lg text-gray-700 break-words">{airData.intro}</p>
                  </div>

                  <div className="space-y-6 sm:space-y-8 mb-8">
                    {airData.sections.map((section, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                        <h3 className="mb-3 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{section.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">{section.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8 rounded-2xl bg-gray-50 p-4 sm:p-6 md:p-8">
                    <p className="mb-6 text-base sm:text-lg font-semibold text-gray-900 break-words">{airData.cta}</p>
                  </div>

                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{airData.tariffs}</h3>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600 break-words">{airData.tariffFrom}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{airData.terms}</h3>
                      <p className="text-base sm:text-lg font-bold text-blue-600 break-words">{airData.termsValue}</p>
                    </div>
                  </div>
                </section>

                {/* Rail Transportation */}
                <section id="rail" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-3">
                      <Train className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{railData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 md:p-8">
                    <p className="text-base sm:text-lg text-gray-700 break-words">{railData.intro}</p>
                  </div>

                  <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{railData.whatWeDo}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {railData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-1 text-teal-600 flex-shrink-0">•</span>
                            <span className="text-sm sm:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{railData.forWhom}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {railData.clients.map((client, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-1 text-teal-600 flex-shrink-0">•</span>
                            <span className="text-sm sm:text-base text-gray-600 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{railData.tariffs}</h3>
                      <p className="text-xl sm:text-2xl font-bold text-teal-600 break-words">{railData.tariffFrom}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{railData.terms}</h3>
                      <p className="text-base sm:text-lg font-bold text-teal-600 break-words">{railData.termsValue}</p>
                    </div>
                  </div>
                </section>

                {/* Multimodal Transportation */}
                <section id="multimodal" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{multimodalData.title}</h2>
                  </div>
                  <p className="mb-2 text-lg sm:text-xl font-semibold text-gray-700 break-words">{multimodalData.subtitle}</p>
                  <p className="mb-6 text-base sm:text-lg text-gray-600 break-words">{multimodalData.intro}</p>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 md:p-8">
                    <p className="text-base sm:text-lg text-gray-700 break-words">{multimodalData.description}</p>
                  </div>

                  <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{multimodalData.whatIncludes}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {multimodalData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-1 text-purple-600 flex-shrink-0">•</span>
                            <span className="text-sm sm:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{multimodalData.combinations}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {multimodalData.comboList.map((combo, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-1 text-purple-600 flex-shrink-0">•</span>
                            <span className="text-sm sm:text-base text-gray-600 break-words">{combo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
                    <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">{multimodalData.advantages}</h3>
                    <ul className="space-y-2">
                      {multimodalData.advantagesList.map((advantage, index) => (
                        <li key={index} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                          <span className="text-sm sm:text-base text-gray-700 break-words">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{multimodalData.tariffs}</h3>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600 break-words">{multimodalData.tariffFrom}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h3 className="mb-3 text-base sm:text-lg font-semibold text-gray-900">{multimodalData.terms}</h3>
                      <p className="text-base sm:text-lg font-bold text-purple-600 break-words">{multimodalData.termsValue}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

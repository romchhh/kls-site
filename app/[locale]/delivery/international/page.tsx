import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import { Ship, Plane, Train, Truck, CheckCircle2 } from "lucide-react";
import DeliverySidebarNav from "../../../../components/DeliverySidebarNav";

const seaContainerContent = {
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

const airCargoContent = {
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

const railCargoContent = {
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

const roadCargoContent = {
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
    title: "Road Freight Transportation (FTL and LTL)",
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

const mainContent = {
  ua: {
    intro: "Ми забезпечуємо повний комплекс логістичних рішень для міжнародних вантажних перевезень, поєднуючи надійність, прозорість та індивідуальний підхід. Наша команда організовує доставку будь-яким видом транспорту — морським, авіаційним, залізничним та автомобільним, а також бере на себе всі експедиторські операції.",
    whatIncludes: "Що входить у наші послуги",
    services: [
      "організація міжнародних перевезень FCL і LCL, FTL і LTL",
      "підбір оптимального маршруту за вартістю та термінами",
      "експедирування в портах, аеропортах, терміналах",
      "митне оформлення та суправа документації",
      "мультимодальні рішення (комбінація кількох видів транспорту)",
      "страхування вантажів та додаткові сервісні послуги",
      "повний контроль та відстеження на всіх етапах доставки",
    ],
    advantages: "Наші ключові переваги",
    advantagesList: [
      "глобальна мережа партнерів та агентів",
      "гнучкі тарифи та індивідуальний підхід до кожного клієнта",
      "стандарти безпеки та прозорість логістики",
      "команда, що працює з різними типами вантажів — від стандартних до негабаритних та чутливих",
    ],
    forWhom: "Для кого це підходить",
    clients: [
      "імпортери та експортери",
      "e-commerce бізнес та виробники",
      "дистриб'ютори й торговельні компанії",
      "підприємства, що працюють із регулярними чи проектними відправленнями",
    ],
  },
  ru: {
    intro: "Мы обеспечиваем полный комплекс логистических решений для международных грузовых перевозок, сочетая надежность, прозрачность и индивидуальный подход. Наша команда организует доставку любым видом транспорта — морским, авиационным, железнодорожным и автомобильным, а также берет на себя все экспедиторские операции.",
    whatIncludes: "Что входит в наши услуги",
    services: [
      "организация международных перевозок FCL и LCL, FTL и LTL",
      "подбор оптимального маршрута по стоимости и срокам",
      "экспедирование в портах, аэропортах, терминалах",
      "таможенное оформление и сопровождение документации",
      "мультимодальные решения (комбинация нескольких видов транспорта)",
      "страхование грузов и дополнительные сервисные услуги",
      "полный контроль и отслеживание на всех этапах доставки",
    ],
    advantages: "Наши ключевые преимущества",
    advantagesList: [
      "глобальная сеть партнеров и агентов",
      "гибкие тарифы и индивидуальный подход к каждому клиенту",
      "стандарты безопасности и прозрачность логистики",
      "команда, работающая с разными типами грузов — от стандартных до негабаритных и чувствительных",
    ],
    forWhom: "Для кого это подходит",
    clients: [
      "импортеры и экспортеры",
      "e-commerce бизнес и производители",
      "дистрибьюторы и торговые компании",
      "предприятия, работающие с регулярными или проектными отправлениями",
    ],
  },
  en: {
    intro: "We provide a full range of logistics solutions for international freight transportation, combining reliability, transparency and individual approach. Our team organizes delivery by any type of transport — sea, air, rail and road, and also takes on all forwarding operations.",
    whatIncludes: "What is included in our services",
    services: [
      "organization of international transportation FCL and LCL, FTL and LTL",
      "selection of optimal route by cost and terms",
      "forwarding in ports, airports, terminals",
      "customs clearance and document support",
      "multimodal solutions (combination of several transport types)",
      "cargo insurance and additional service services",
      "full control and tracking at all delivery stages",
    ],
    advantages: "Our key advantages",
    advantagesList: [
      "global network of partners and agents",
      "flexible tariffs and individual approach to each client",
      "safety standards and logistics transparency",
      "team working with different cargo types — from standard to oversized and sensitive",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and exporters",
      "e-commerce business and manufacturers",
      "distributors and trading companies",
      "enterprises working with regular or project shipments",
    ],
  },
};

export default async function InternationalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const data = mainContent[locale];

  const seaContainerData = seaContainerContent[locale];
  const airCargoData = airCargoContent[locale];
  const railCargoData = railCargoContent[locale];
  const roadCargoData = roadCargoContent[locale];

  const deliveryTypes = [
    { id: "sea-container", title: seaContainerData.title, iconId: "ship", color: "blue" },
    { id: "air-cargo", title: airCargoData.title, iconId: "plane", color: "teal" },
    { id: "rail-cargo", title: railCargoData.title, iconId: "train", color: "amber" },
    { id: "road-cargo", title: roadCargoData.title, iconId: "truck", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-20 overflow-hidden mb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Title and Description */}
              <div className="lg:col-span-2">
                <h1 className="mb-6 text-5xl md:text-6xl font-bold text-gray-900">
                  {t.delivery.international}
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {data.intro}
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
        <section id="content-section" className="py-20 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Left Sidebar Navigation - Desktop only */}
              <DeliverySidebarNav 
                deliveryTypes={deliveryTypes} 
                locale={locale}
                title={locale === "ua" ? "Види перевезень" : locale === "ru" ? "Виды перевозок" : "Transportation Types"}
              />

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-20">
                {/* Main Info Section */}
                <section>
                  <h2 className="mb-8 text-3xl font-bold text-gray-900">{data.whatIncludes}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-teal-300 hover:shadow-md"
                      >
                        <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-teal-600" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Advantages & For Whom */}
                <section className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">{data.advantages}</h2>
                    <ul className="space-y-4">
                      {data.advantagesList.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                          <span className="text-gray-700">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">{data.forWhom}</h2>
                    <ul className="space-y-4">
                      {data.clients.map((client, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-500" />
                          <span className="text-gray-700">{client}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Sea Container Transportation */}
                <section id="sea-container" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                      <Ship className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{seaContainerData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                    <p className="text-lg text-gray-700">{seaContainerData.intro}</p>
                  </div>

                  <div className="mb-8 space-y-12">
                    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{seaContainerData.fclTitle}</h3>
                      <p className="mb-6 text-gray-600">{seaContainerData.fclDescription}</p>
                      <div className="mb-4">
                        <h4 className="mb-3 text-xl font-semibold text-gray-900">{seaContainerData.fclAdvantages}</h4>
                        <ul className="space-y-2">
                          {seaContainerData.fclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-1 text-blue-600">•</span>
                              <span className="text-gray-600">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-gray-600 italic">{seaContainerData.fclForWhom}</p>
                    </div>

                    <div className="rounded-xl border-2 border-teal-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{seaContainerData.lclTitle}</h3>
                      <p className="mb-6 text-gray-600">{seaContainerData.lclDescription}</p>
                      <div className="mb-4">
                        <h4 className="mb-3 text-xl font-semibold text-gray-900">{seaContainerData.lclAdvantages}</h4>
                        <ul className="space-y-2">
                          {seaContainerData.lclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-1 text-teal-600">•</span>
                              <span className="text-gray-600">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-gray-600 italic">{seaContainerData.lclForWhom}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{seaContainerData.whatWeOffer}</h3>
                    <ul className="space-y-3">
                      {seaContainerData.services.map((service, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 text-blue-600">•</span>
                          <span className="text-gray-600">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Air Cargo Transportation */}
                <section id="air-cargo" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-3">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{airCargoData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-8">
                    <p className="text-lg text-gray-700">{airCargoData.intro}</p>
                  </div>

                  <div className="mb-8 space-y-12">
                    <div className="rounded-xl border-2 border-blue-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{airCargoData.fclTitle}</h3>
                      <p className="mb-6 text-gray-600">{airCargoData.fclDescription}</p>
                      <div>
                        <h4 className="mb-3 text-xl font-semibold text-gray-900">{airCargoData.fclAdvantages}</h4>
                        <ul className="space-y-2">
                          {airCargoData.fclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-1 text-blue-600">•</span>
                              <span className="text-gray-600">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl border-2 border-sky-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{airCargoData.lclTitle}</h3>
                      <p className="mb-6 text-gray-600">{airCargoData.lclDescription}</p>
                      <div>
                        <h4 className="mb-3 text-xl font-semibold text-gray-900">{airCargoData.lclAdvantages}</h4>
                        <ul className="space-y-2">
                          {airCargoData.lclAdvantagesList.map((advantage, index) => (
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
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{airCargoData.whatWeProvide}</h3>
                    <ul className="space-y-3">
                      {airCargoData.services.map((service, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 text-blue-600">•</span>
                          <span className="text-gray-600">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Rail Cargo Transportation */}
                <section id="rail-cargo" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-3">
                      <Train className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{railCargoData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                    <p className="text-lg text-gray-700">{railCargoData.intro}</p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{railCargoData.advantages}</h3>
                      <ul className="space-y-3">
                        {railCargoData.advantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-amber-600">•</span>
                            <span className="text-gray-600">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{railCargoData.ourCapabilities}</h3>
                      <ul className="space-y-3">
                        {railCargoData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-amber-600">•</span>
                            <span className="text-gray-600">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Road Cargo Transportation */}
                <section id="road-cargo" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{roadCargoData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                    <p className="text-lg text-gray-700">{roadCargoData.intro}</p>
                  </div>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border-2 border-indigo-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{roadCargoData.ftlTitle}</h3>
                      <ul className="space-y-3">
                        {roadCargoData.ftlFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-indigo-600">•</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border-2 border-purple-200 bg-white p-8 shadow-sm">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900">{roadCargoData.ltlTitle}</h3>
                      <ul className="space-y-3">
                        {roadCargoData.ltlFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-purple-600">•</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{roadCargoData.whatWeOffer}</h3>
                    <ul className="space-y-3">
                      {roadCargoData.services.map((service, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 text-indigo-600">•</span>
                          <span className="text-gray-600">{service}</span>
                        </li>
                      ))}
                    </ul>
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

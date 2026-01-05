import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import { CheckCircle2 } from "lucide-react";
import DeliverySidebarNav from "../../../../components/DeliverySidebarNav";
import Image from "next/image";
import { Metadata } from "next";
import { generateDeliveryMetadata } from "../../../../lib/metadata";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const deliveryNames = {
    ua: "Міжнародні вантажні перевезення | Морські, авіаційні, залізничні та автомобільні перевезення",
    ru: "Международные грузовые перевозки | Морские, авиационные, железнодорожные и автомобильные перевозки",
    en: "International Freight Transportation | Sea, Air, Rail and Road Freight",
  };
  const deliveryDescriptions = {
    ua: "Комплексні міжнародні вантажні перевезення: морські контейнерні перевезення (FCL/LCL), авіаційні перевезення, залізничні перевезення FCL/LCL, автомобільні перевезення FTL/LTL. Організація міжнародних перевезень, підбір оптимального маршруту, митне оформлення, повний супровід. KLS Logistics - надійний партнер для міжнародної логістики.",
    ru: "Комплексные международные грузовые перевозки: морские контейнерные перевозки (FCL/LCL), авиационные перевозки, железнодорожные перевозки FCL/LCL, автомобильные перевозки FTL/LTL. Организация международных перевозок, подбор оптимального маршрута, таможенное оформление, полное сопровождение. KLS Logistics - надежный партнер для международной логистики.",
    en: "Comprehensive international freight transportation: sea container shipping (FCL/LCL), air cargo transportation, rail freight FCL/LCL, road freight FTL/LTL. International shipping organization, optimal route selection, customs clearance, full support. KLS Logistics - reliable partner for international logistics.",
  };
  return generateDeliveryMetadata(locale, "international", deliveryNames, deliveryDescriptions);
}

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
      {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/vygruzka-gruzovikov-v-logisticeskom-centre-s-vozduha 1.jpg"
              alt={locale === "ua" ? "Міжнародні вантажні перевезення - морські, авіаційні, залізничні та автомобільні перевезення" : locale === "ru" ? "Международные грузовые перевозки - морские, авиационные, железнодорожные и автомобильные перевозки" : "International freight transportation - sea, air, rail and road freight"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60 z-[1]" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20 md:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left - Text Content */}
              <div className="text-white">
                <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl" style={{ whiteSpace: 'pre-line' }}>
                  {t.delivery.international}
                </h1>
                <p className="mb-6 text-base font-normal leading-relaxed text-white/95 md:text-lg">
                  {data.intro}
                </p>
              </div>

              {/* Right - Contact Form */}
              <div className="flex justify-end">
                <div className="mt-12 max-w-md w-full shadow-2xl">
                  <ContactForm locale={locale} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content with Sidebar */}
        <section id="content-section" className="py-12 sm:py-20 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-4">
              {/* Left Sidebar Navigation - Desktop only */}
              <DeliverySidebarNav 
                deliveryTypes={deliveryTypes} 
                locale={locale}
                title={locale === "ua" ? "Види перевезень" : locale === "ru" ? "Виды перевозок" : "Transportation Types"}
              />

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Main Info Section */}
                <section className="mb-8">
                  <h2 className="mb-8 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 break-words text-center">{data.whatIncludes}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.services.map((service, index) => (
                      <div
                        key={index}
                        className="group flex items-start gap-3 sm:gap-4 rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600 transition-colors duration-300 group-hover:text-teal-700" />
                        <span className="text-sm sm:text-base text-gray-700 break-words transition-colors duration-300 group-hover:text-slate-800">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Advantages & For Whom */}
                <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 sm:p-6 md:p-8">
                    <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 break-words">{data.advantages}</h2>
                    <ul className="space-y-3 sm:space-y-4">
                      {data.advantagesList.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-teal-600" />
                          <span className="text-sm sm:text-base text-gray-600 break-words">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:p-6 md:p-8">
                    <h2 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 break-words">{data.forWhom}</h2>
                    <ul className="space-y-3 sm:space-y-4">
                      {data.clients.map((client, index) => (
                        <li key={index} className="flex items-center gap-2 sm:gap-3">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-teal-600" />
                          <span className="text-sm sm:text-base text-gray-600 break-words">{client}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Sea Container Transportation */}
                <section id="sea-container" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{seaContainerData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{seaContainerData.intro}</p>
                    </div>
                  </div>

                  <div className="mb-8 space-y-8 sm:space-y-12">
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 break-words text-center">{seaContainerData.fclTitle}</h3>
                      <p className="mb-6 text-sm sm:text-base text-gray-600 break-words">{seaContainerData.fclDescription}</p>
                      <div className="mb-4">
                        <h4 className="mb-3 text-lg sm:text-xl font-semibold text-gray-900 break-words text-left">{seaContainerData.fclAdvantages}</h4>
                        <ul className="space-y-2">
                          {seaContainerData.fclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 italic break-words">{seaContainerData.fclForWhom}</p>
                    </div>

                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 break-words text-center">{seaContainerData.lclTitle}</h3>
                      <p className="mb-6 text-sm sm:text-base text-gray-600 break-words">{seaContainerData.lclDescription}</p>
                      <div className="mb-4">
                        <h4 className="mb-3 text-lg sm:text-xl font-semibold text-gray-900 break-words text-left">{seaContainerData.lclAdvantages}</h4>
                        <ul className="space-y-2">
                          {seaContainerData.lclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 italic break-words">{seaContainerData.lclForWhom}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 sm:p-6">
                    <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{seaContainerData.whatWeOffer}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {seaContainerData.services.slice(0, 2).map((service, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {seaContainerData.services.slice(2, 4).map((service, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {seaContainerData.services.slice(4).map((service, index) => (
                          <li key={index + 4} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Air Cargo Transportation */}
                <section id="air-cargo" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{airCargoData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{airCargoData.intro}</p>
                    </div>
                  </div>

                  <div className="mb-8 space-y-8 sm:space-y-12">
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 break-words text-center">{airCargoData.fclTitle}</h3>
                      <p className="mb-6 text-sm sm:text-base text-gray-600 break-words">{airCargoData.fclDescription}</p>
                      <div>
                        <h4 className="mb-3 text-lg sm:text-xl font-semibold text-gray-900 break-words text-left">{airCargoData.fclAdvantages}</h4>
                        <ul className="space-y-2">
                          {airCargoData.fclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-baseline gap-2 sm:gap-3">
                              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 break-words text-center">{airCargoData.lclTitle}</h3>
                      <p className="mb-6 text-sm sm:text-base text-gray-600 break-words">{airCargoData.lclDescription}</p>
                      <div>
                        <h4 className="mb-3 text-lg sm:text-xl font-semibold text-gray-900 break-words text-left">{airCargoData.lclAdvantages}</h4>
                        <ul className="space-y-2">
                          {airCargoData.lclAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-baseline gap-2 sm:gap-3">
                              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 sm:p-6">
                    <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{airCargoData.whatWeProvide}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {airCargoData.services.slice(0, 2).map((service, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {airCargoData.services.slice(2, 3).map((service, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {airCargoData.services.slice(3).map((service, index) => (
                          <li key={index + 3} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Rail Cargo Transportation */}
                <section id="rail-cargo" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{railCargoData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{railCargoData.intro}</p>
                    </div>
                  </div>

                  {/* Переваги залізничної доставки */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{railCargoData.advantages}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.advantagesList.slice(0, 2).map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.advantagesList.slice(2, 4).map((advantage, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.advantagesList.slice(4).map((advantage, index) => (
                          <li key={index + 4} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Наші можливості */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{railCargoData.ourCapabilities}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.services.slice(0, 2).map((service, index) => (
                          <li key={index} className="flex items-baseline gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-sm bg-teal-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.services.slice(2, 4).map((service, index) => (
                          <li key={index + 2} className="flex items-baseline gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-sm bg-teal-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {railCargoData.services.slice(4).map((service, index) => (
                          <li key={index + 4} className="flex items-baseline gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-sm bg-teal-600 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Road Cargo Transportation */}
                <section id="road-cargo" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{roadCargoData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{roadCargoData.intro}</p>
                    </div>
                  </div>

                  <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 break-words text-left">{roadCargoData.ftlTitle}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {roadCargoData.ftlFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-1" />
                            <span className="text-sm sm:text-base text-gray-600 break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 break-words text-left">{roadCargoData.ltlTitle}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {roadCargoData.ltlFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-600 flex-shrink-0 mt-1" />
                            <span className="text-sm sm:text-base text-gray-600 break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 sm:p-6">
                    <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{roadCargoData.whatWeOffer}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {roadCargoData.services.slice(0, 2).map((service, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {roadCargoData.services.slice(2, 3).map((service, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {roadCargoData.services.slice(3).map((service, index) => (
                          <li key={index + 3} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      <SiteFooter locale={locale} />
    </div>
  );
}

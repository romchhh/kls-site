import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import DeliverySidebarNav from "../../../../components/DeliverySidebarNav";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const fbaContent = {
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
      { type: "Авіа", days: "8–15 днів", icon: "/calculator/air-delivery.svg" },
      { type: "Море", days: "55–65 днів", icon: "/calculator/sea-delivery.svg" },
      { type: "Потяг (ЄС)", days: "30–35 днів", icon: "/calculator/rail-delivery.svg" },
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
      { type: "Авиа", days: "8–15 дней", icon: "/calculator/air-delivery.svg" },
      { type: "Море", days: "55–65 дней", icon: "/calculator/sea-delivery.svg" },
      { type: "Поезд (ЕС)", days: "30–35 дней", icon: "/calculator/rail-delivery.svg" },
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
      { type: "Air", days: "8–15 days", icon: "/calculator/air-delivery.svg" },
      { type: "Sea", days: "55–65 days", icon: "/calculator/sea-delivery.svg" },
      { type: "Train (EU)", days: "30–35 days", icon: "/calculator/rail-delivery.svg" },
    ],
    cta: "Ready to deliver your goods to FBA? Contact us — we'll make an accurate calculation for your batch.",
  },
};

const ddpContent = {
  ua: {
    title: "Доставка вантажів на умовах DDP/DDU",
    dduTitle: "DDU — доставка до країни отримувача без сплати мит і податків",
    dduIntro: "Ми доставляємо ваш товар до пункту призначення, а імпортні платежі та митне оформлення оплачуєте - ви.",
    dduWhatIncludes: "Що може включати DDU:",
    dduServices: [
      "Забір товару з фабрики",
      "Пакування та відправлення",
      "Міжнародна доставка (авіа / море / залізниця)",
      "Передача вантажу митниці країни імпорту",
    ],
    dduPays: "Що оплачує отримувач:",
    dduPaysList: [
      "мита та податки",
      "митний брокер",
      "локальні збори",
    ],
    dduForWhom: "Кому підходить DDU:",
    dduClients: [
      "Тим, хто має власну компанію або імпортера",
      "Тим, хто хоче сам контролювати митне оформлення",
      "Тим, кому потрібна дешевша альтернатива DDP",
    ],
    ddpTitle: "DDP — це повна доставка \"під ключ\"",
    ddpIntro: "Від фабрики в Китаї до складу отримувача з уже сплаченими митами та податками. Ми беремо на себе весь логістичний процес, а ви отримуєте готовий товар без бюрократії та додаткових витрат.",
    ddpWhatIncludes: "Що може входити у DDP:",
    ddpServices: [
      "Забір товару з фабрики",
      "Пакування та маркування",
      "Міжнародна доставка (авіа / море / залізниця)",
      "Митне оформлення та сплата податків",
      "Domestic-доставка до кінцевого складу (в т.ч. Amazon FBA)",
    ],
    ddpAdvantages: "Переваги:",
    ddpAdvantagesList: [
      "Фіксована ціна без прихованих платежів",
      "Жодних дій з боку отримувача",
      "Повна відповідальність за весь процес",
      "Ідеально для Amazon FBA та e-commerce",
    ],
    cta: "Зв'яжіться з нами — зробимо точний розрахунок під вашу партію.",
  },
  ru: {
    title: "Доставка грузов на условиях DDP/DDU",
    dduTitle: "DDU — доставка до страны получателя без уплаты пошлин и налогов",
    dduIntro: "Мы доставляем ваш товар до пункта назначения, а импортные платежи и таможенное оформление оплачиваете - вы.",
    dduWhatIncludes: "Что может включать DDU:",
    dduServices: [
      "Забор товара с фабрики",
      "Упаковка и отправка",
      "Международная доставка (авиа / море / железная дорога)",
      "Передача груза таможне страны импорта",
    ],
    dduPays: "Что оплачивает получатель:",
    dduPaysList: [
      "пошлины и налоги",
      "таможенный брокер",
      "локальные сборы",
    ],
    dduForWhom: "Кому подходит DDU:",
    dduClients: [
      "Тем, кто имеет собственную компанию или импортера",
      "Тем, кто хочет сам контролировать таможенное оформление",
      "Тем, кому нужна более дешевая альтернатива DDP",
    ],
    ddpTitle: "DDP — это полная доставка \"под ключ\"",
    ddpIntro: "От фабрики в Китае до склада получателя с уже уплаченными пошлинами и налогами. Мы берем на себя весь логистический процесс, а вы получаете готовый товар без бюрократии и дополнительных расходов.",
    ddpWhatIncludes: "Что может входить в DDP:",
    ddpServices: [
      "Забор товара с фабрики",
      "Упаковка и маркировка",
      "Международная доставка (авиа / море / железная дорога)",
      "Таможенное оформление и уплата налогов",
      "Domestic-доставка до конечного склада (в т.ч. Amazon FBA)",
    ],
    ddpAdvantages: "Преимущества:",
    ddpAdvantagesList: [
      "Фиксированная цена без скрытых платежей",
      "Никаких действий со стороны получателя",
      "Полная ответственность за весь процесс",
      "Идеально для Amazon FBA и e-commerce",
    ],
    cta: "Свяжитесь с нами — сделаем точный расчет под вашу партию.",
  },
  en: {
    title: "Delivery of Goods on DDP and DDU Terms",
    dduTitle: "DDU — delivery to recipient country without payment of duties and taxes",
    dduIntro: "We deliver your goods to the destination, and you pay import payments and customs clearance.",
    dduWhatIncludes: "What DDU may include:",
    dduServices: [
      "Product pickup from factory",
      "Packaging and shipping",
      "International delivery (air / sea / rail)",
      "Transfer of cargo to customs of import country",
    ],
    dduPays: "What the recipient pays:",
    dduPaysList: [
      "duties and taxes",
      "customs broker",
      "local fees",
    ],
    dduForWhom: "For whom DDU suits:",
    dduClients: [
      "Those who have their own company or importer",
      "Those who want to control customs clearance themselves",
      "Those who need a cheaper alternative to DDP",
    ],
    ddpTitle: "DDP — full turnkey delivery",
    ddpIntro: "From factory in China to recipient warehouse with already paid duties and taxes. We take care of the entire logistics process, and you get ready goods without bureaucracy and additional costs.",
    ddpWhatIncludes: "What may be included in DDP:",
    ddpServices: [
      "Product pickup from factory",
      "Packaging and labeling",
      "International delivery (air / sea / rail)",
      "Customs clearance and tax payment",
      "Domestic delivery to final warehouse (including Amazon FBA)",
    ],
    ddpAdvantages: "Advantages:",
    ddpAdvantagesList: [
      "Fixed price without hidden payments",
      "No actions required from recipient",
      "Full responsibility for entire process",
      "Perfect for Amazon FBA and e-commerce",
    ],
    cta: "Contact us — we'll make an accurate calculation for your batch.",
  },
};

const expressContent = {
  ua: {
    title: "ЕКСПРЕС ДОСТАВКА",
    subtitle: "Express Air — найшвидший спосіб доставки товарів з Китаю у будь-яку країну світу",
    intro: "Ідеально для термінових відправок, тестових партій, зразків та легких товарів.",
    whatIs: "Що це таке?",
    description: "Express-доставка — це авіаперевезення з використанням міжнародних кур'єрських служб (DHL, UPS, FedEx, SF Express), які забезпечують доставку від дверей до дверей у найкоротші строки.",
    advantages: "Переваги Express Air:",
    advantagesList: [
      "Швидко — 3–7 днів у більшість країн",
      "Повне відстеження вантажу",
      "Мінімальна бюрократія",
      "Ідеально для малих обсягів",
      "Безпечне транспортування та пріоритетна обробка",
    ],
    whatWeDo: "Що ми робимо:",
    services: [
      "пакуємо та оформлюємо документи",
      "відправляємо через надійні кур'єрські служби",
      "надаємо трекінг одразу після відправки",
    ],
    forWhom: "Для кого підходить:",
    clients: [
      "Amazon-продавці (зразки, невеликі партії)",
      "Dropshipping та e-commerce",
      "Доставка аксесуарів, електроніки, легких товарів",
      "Термінові поставки",
    ],
    cta: "Потрібно доставити вантаж «на вчора»? Ми впораємося з цим.",
  },
  ru: {
    title: "ЭКСПРЕСС ДОСТАВКА",
    subtitle: "Express Air — самый быстрый способ доставки товаров из Китая в любую страну мира",
    intro: "Идеально для срочных отправлений, тестовых партий, образцов и легких товаров.",
    whatIs: "Что это такое?",
    description: "Express-доставка — это авиаперевозки с использованием международных курьерских служб (DHL, UPS, FedEx, SF Express), которые обеспечивают доставку от дверей до дверей в кратчайшие сроки.",
    advantages: "Преимущества Express Air:",
    advantagesList: [
      "Быстро — 3–7 дней в большинство стран",
      "Полное отслеживание груза",
      "Минимальная бюрократия",
      "Идеально для малых объемов",
      "Безопасная транспортировка и приоритетная обработка",
    ],
    whatWeDo: "Что мы делаем:",
    services: [
      "упаковываем и оформляем документы",
      "отправляем через надежные курьерские службы",
      "предоставляем трекинг сразу после отправки",
    ],
    forWhom: "Для кого подходит:",
    clients: [
      "Amazon-продавцы (образцы, небольшие партии)",
      "Dropshipping и e-commerce",
      "Доставка аксессуаров, электроники, легких товаров",
      "Срочные поставки",
    ],
    cta: "Нужно доставить груз «на вчера»? Мы справимся с этим.",
  },
  en: {
    title: "EXPRESS DELIVERY",
    subtitle: "Express Air — the fastest way to deliver goods from China to any country in the world",
    intro: "Perfect for urgent shipments, test batches, samples and light goods.",
    whatIs: "What is it?",
    description: "Express delivery is air transportation using international courier services (DHL, UPS, FedEx, SF Express) that provide door-to-door delivery in the shortest time.",
    advantages: "Express Air advantages:",
    advantagesList: [
      "Fast — 3–7 days to most countries",
      "Full cargo tracking",
      "Minimal bureaucracy",
      "Perfect for small volumes",
      "Safe transportation and priority handling",
    ],
    whatWeDo: "What we do:",
    services: [
      "pack and prepare documents",
      "ship through reliable courier services",
      "provide tracking immediately after shipment",
    ],
    forWhom: "For whom it suits:",
    clients: [
      "Amazon sellers (samples, small batches)",
      "Dropshipping and e-commerce",
      "Delivery of accessories, electronics, light goods",
      "Urgent deliveries",
    ],
    cta: "Need to deliver cargo \"yesterday\"? We'll handle it.",
  },
};

const portToPortContent = {
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

const crossBorderContent = {
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

export default async function EuWorldPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const fbaData = fbaContent[locale];
  const ddpData = ddpContent[locale];
  const expressData = expressContent[locale];
  const portToPortData = portToPortContent[locale];
  const crossBorderData = crossBorderContent[locale];

  const deliveryTypes = [
    { id: "fba", title: fbaData.title, iconId: "package", color: "orange" },
    { id: "ddp", title: ddpData.title, iconId: "filetext", color: "purple" },
    { id: "express", title: expressData.title, iconId: "zap", color: "yellow" },
    { id: "port-to-port", title: portToPortData.title, iconId: "anchor", color: "blue" },
    { id: "cross-border", title: crossBorderData.title, iconId: "globe2", color: "teal" },
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
              alt="Delivery"
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
                  {t.delivery.euWorld}
                </h1>
                <p className="mb-6 text-base font-normal leading-relaxed text-white/95 md:text-lg">
                  {locale === "ua" &&
                    "Доставка вантажів в країни Європейського Союзу та інші країни світу. Широкий спектр логістичних рішень для міжнародної торгівлі."}
                  {locale === "ru" &&
                    "Доставка грузов в страны Европейского Союза и другие страны мира. Широкий спектр логистических решений для международной торговли."}
                  {locale === "en" &&
                    "Delivery of cargo to European Union countries and other countries around the world. A wide range of logistics solutions for international trade."}
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
                title={locale === "ua" ? "Послуги доставки" : locale === "ru" ? "Услуги доставки" : "Delivery Services"}
              />

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-20">
                {/* FBA Delivery */}
                <section id="fba" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{fbaData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <p className="text-lg sm:text-xl text-gray-600 break-words mb-6 text-center">{fbaData.subtitle}</p>
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{fbaData.intro}</p>
                    </div>
                  </div>

                  {/* Що може входити у нашу послугу */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{fbaData.whatIncludes}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.services.slice(0, 2).map((service, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.services.slice(2, 4).map((service, index) => (
                          <li key={index + 2} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.services.slice(4).map((service, index) => (
                          <li key={index + 4} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Наші переваги */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{fbaData.advantages}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.advantagesList.slice(0, 2).map((advantage, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.advantagesList.slice(2, 4).map((advantage, index) => (
                          <li key={index + 2} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {fbaData.advantagesList.slice(4).map((advantage, index) => (
                          <li key={index + 4} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Види доставки */}
                  <div className="mb-8">
                    <h3 className="mb-8 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{fbaData.deliveryTypes}</h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                      {fbaData.deliveryOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
                          <div className="relative w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                            <Image
                              src={option.icon}
                              alt={option.type}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs sm:text-base md:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">{option.type}</p>
                            <p className="text-[10px] sm:text-sm md:text-base text-gray-600">{option.days}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center">
                    <p className="mb-2 text-2xl sm:text-3xl font-bold text-[#006D77] break-words" style={{ fontFamily: 'Unbounded' }}>
                      {fbaData.cta.includes('?') ? fbaData.cta.split('?')[0] + '?' : fbaData.cta}
                    </p>
                    {fbaData.cta.includes('?') && (
                      <p className="text-lg sm:text-xl text-slate-900 break-words">
                        {fbaData.cta.split('?')[1]?.trim()}
                      </p>
                    )}
                  </div>
                </section>

                {/* DDP/DDU Delivery */}
                <section id="ddp" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{ddpData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">
                        {locale === "ua" && "Комплексна доставка з повним супроводом та оформленням всієї документації."}
                        {locale === "ru" && "Комплексная доставка с полным сопровождением и оформлением всей документации."}
                        {locale === "en" && "Comprehensive delivery with full support and processing of all documentation."}
                      </p>
                    </div>
                  </div>
                  
                  {/* DDU Section */}
                  <div className="mb-8">
                    <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-900 break-words text-center">{ddpData.dduTitle}</h3>
                    <p className="mb-8 text-base sm:text-lg text-gray-600 break-words text-center">{ddpData.dduIntro}</p>
                  </div>
                  
                  <div className="mb-12 rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                    <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 break-words">{ddpData.dduWhatIncludes}</h4>
                        <ul className="space-y-2">
                          {ddpData.dduServices.map((service, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 break-words">{ddpData.dduPays}</h4>
                        <ul className="space-y-2">
                          {ddpData.dduPaysList.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 break-words">{ddpData.dduForWhom}</h4>
                      <ul className="space-y-2">
                        {ddpData.dduClients.map((client, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3">
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                            <span className="text-sm sm:text-base text-gray-600 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* DDP Section */}
                  <div className="mb-8">
                    <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-900 break-words text-center">{ddpData.ddpTitle}</h3>
                    <p className="mb-8 text-base sm:text-lg text-gray-600 break-words text-center">{ddpData.ddpIntro}</p>
                  </div>
                  
                  <div className="group mb-8 rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 break-words transition-colors duration-300 group-hover:text-teal-600">{ddpData.ddpWhatIncludes}</h4>
                        <ul className="space-y-2">
                          {ddpData.ddpServices.map((service, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                              <span className="text-sm sm:text-base text-gray-600 break-words">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="mb-4 text-lg sm:text-xl font-semibold text-gray-900 break-words transition-colors duration-300 group-hover:text-teal-600">{ddpData.ddpAdvantages}</h4>
                        <ul className="space-y-2">
                          {ddpData.ddpAdvantagesList.map((advantage, index) => (
                            <li key={index} className="flex items-center gap-2 sm:gap-3">
                              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                              <span className="text-sm sm:text-base text-gray-700 break-words">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center">
                    <p className="mb-2 text-2xl sm:text-3xl font-bold text-[#006D77] break-words" style={{ fontFamily: 'Unbounded' }}>
                      {ddpData.cta.includes('?') ? ddpData.cta.split('?')[0] + '?' : ddpData.cta}
                    </p>
                    {ddpData.cta.includes('?') && (
                      <p className="text-lg sm:text-xl text-slate-900 break-words">
                        {ddpData.cta.split('?')[1]?.trim()}
                      </p>
                    )}
                  </div>
                </section>

                {/* Express Delivery */}
                <section id="express" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{expressData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <p className="mb-2 text-lg sm:text-xl text-gray-600 break-words text-center">{expressData.subtitle}</p>
                    <p className="mb-6 text-base sm:text-lg text-gray-500 break-words">{expressData.intro}</p>
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                        <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{expressData.whatIs}</h3>
                      <p className="text-base sm:text-lg text-gray-700 break-words">{expressData.description}</p>
                    </div>
                  </div>

                  {/* Переваги Express Air */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{expressData.advantages}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.advantagesList.slice(0, 2).map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.advantagesList.slice(2, 4).map((advantage, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.advantagesList.slice(4).map((advantage, index) => (
                          <li key={index + 4} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Що ми робимо */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{expressData.whatWeDo}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.services.slice(0, 1).map((service, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.services.slice(1, 2).map((service, index) => (
                          <li key={index + 1} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.services.slice(2).map((service, index) => (
                          <li key={index + 2} className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Для кого підходить */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{expressData.forWhom}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.clients.slice(0, 2).map((client, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.clients.slice(2, 3).map((client, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {expressData.clients.slice(3).map((client, index) => (
                          <li key={index + 3} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center">
                    <p className="mb-2 text-2xl sm:text-3xl font-bold text-[#006D77] break-words" style={{ fontFamily: 'Unbounded' }}>
                      {expressData.cta.includes('?') ? expressData.cta.split('?')[0] + '?' : expressData.cta}
                    </p>
                    {expressData.cta.includes('?') && (
                      <p className="text-lg sm:text-xl text-slate-900 break-words">
                        {expressData.cta.split('?')[1]?.trim()}
                      </p>
                    )}
                  </div>
                </section>

                {/* Port-to-Port */}
                <section id="port-to-port" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{portToPortData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{portToPortData.intro}</p>
                    </div>
                  </div>

                  <div className="mb-8 grid gap-6 sm:gap-8 md:grid-cols-2">
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{portToPortData.whatIncludes}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {portToPortData.services.map((service, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3">
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-teal-600" />
                            <span className="text-sm sm:text-base text-gray-600 break-words">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border-2 border-[#006D77] bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words text-center">{portToPortData.whatNotIncludes}</h3>
                      <ul className="space-y-2 sm:space-y-3">
                        {portToPortData.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-1 text-red-600 flex-shrink-0">✗</span>
                            <span className="text-sm sm:text-base text-gray-600 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Кому підходить */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{portToPortData.forWhom}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.clients.slice(0, 1).map((client, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.clients.slice(1, 2).map((client, index) => (
                          <li key={index + 1} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.clients.slice(2).map((client, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Переваги */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{portToPortData.advantages}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.advantagesList.slice(0, 1).map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.advantagesList.slice(1, 2).map((advantage, index) => (
                          <li key={index + 1} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {portToPortData.advantagesList.slice(2).map((advantage, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center">
                    <p className="mb-2 text-2xl sm:text-3xl font-bold text-[#006D77] break-words" style={{ fontFamily: 'Unbounded' }}>
                      {portToPortData.cta.includes('?') ? portToPortData.cta.split('?')[0] + '?' : portToPortData.cta}
                    </p>
                    {portToPortData.cta.includes('?') && (
                      <p className="text-lg sm:text-xl text-slate-900 break-words">
                        {portToPortData.cta.split('?')[1]?.trim()}
                      </p>
                    )}
                  </div>
                </section>

                {/* Cross-Border */}
                <section id="cross-border" className="scroll-mt-32">
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 break-words text-center">{crossBorderData.title}</h2>

                  {/* Intro */}
                  <div className="mb-8">
                    <div className="rounded-2xl bg-[#E8FDF8] p-4 sm:p-6 md:p-8">
                      <p className="text-base sm:text-lg text-gray-700 break-words">{crossBorderData.intro}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-8 sm:mb-12 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900 text-center break-words">{crossBorderData.howItWorks}</h3>
                    
                    {/* Process Timeline */}
                    <div className="relative">
                      {/* Mobile Version - Vertical Timeline */}
                      <div className="relative md:hidden">
                        <div className="relative pl-6">
                          {/* Vertical Line - positioned to go through circle centers */}
                          <div className="absolute left-[25px] top-0 bottom-0 w-0.5 bg-slate-300" />
                          
                          {/* Steps with Circles */}
                          {crossBorderData.steps.map((step, index) => (
                            <div key={index} className="relative pb-6 last:pb-0">
                              {/* Circle on Line */}
                              <div className="absolute left-[2px] top-0 -translate-x-1/2 z-10">
                                <div className="h-5 w-5 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-slate-900" />
                                </div>
                              </div>
                              
                              {/* Step Content */}
                              <div className="pl-4">
                                <div className="mb-1">
                                  <span className="text-xs font-semibold text-slate-900">
                                    {locale === "ua" ? "Крок" : locale === "ru" ? "Шаг" : "Step"} {index + 1}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-slate-900 leading-relaxed break-words">
                                  {step}
                                </h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Desktop Version - Horizontal Timeline */}
                      <div className="relative hidden md:block mb-12">
                        {/* Main Horizontal Line */}
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-300" />
                        
                        {/* Steps with Circles on Line */}
                        <div className="relative grid grid-cols-5">
                          {crossBorderData.steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col items-center">
                              {/* Empty Circle on Line */}
                              <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="h-4 w-4 rounded-full border-2 border-slate-900 bg-white" />
                              </div>
                            </div>
                          ))}
                          
                          {/* Arrow at the end */}
                          <div className="absolute top-6 right-0 -translate-y-1/2 z-10">
                            <div className="h-4 w-4 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center">
                              <svg className="h-2.5 w-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Steps Content - Desktop only */}
                      <div className="hidden md:grid gap-6 md:grid-cols-5">
                        {crossBorderData.steps.map((step, index) => (
                          <div key={index} className="relative flex flex-col items-center text-center">
                            {/* Step Number Label */}
                            <div className="mb-3">
                              <span className="text-sm font-semibold text-slate-900">
                                {locale === "ua" ? "Крок" : locale === "ru" ? "Шаг" : "Step"} {index + 1}
                              </span>
                            </div>
                            
                            {/* Step Content */}
                            <div>
                              <h4 className="text-base font-semibold text-slate-900 leading-relaxed break-words">
                                {step}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Переваги Cross-Border */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{crossBorderData.advantages}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.advantagesList.slice(0, 2).map((advantage, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.advantagesList.slice(2, 3).map((advantage, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.advantagesList.slice(3).map((advantage, index) => (
                          <li key={index + 3} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0 text-teal-600 mt-0.5" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Кому підходить */}
                  <div className="mb-12">
                    <h3 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words">{crossBorderData.forWhom}</h3>
                    <div className="grid gap-2 sm:gap-6 md:gap-8 grid-cols-3 items-start">
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.clients.slice(0, 2).map((client, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.clients.slice(2, 3).map((client, index) => (
                          <li key={index + 2} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        {crossBorderData.clients.slice(3).map((client, index) => (
                          <li key={index + 3} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 bg-teal-600 rounded-sm mt-1" />
                            <span className="text-xs sm:text-base md:text-lg text-gray-700 break-words">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 text-center">
                    <p className="mb-2 text-2xl sm:text-3xl font-bold text-[#006D77] break-words" style={{ fontFamily: 'Unbounded' }}>
                      {crossBorderData.cta.includes('?') ? crossBorderData.cta.split('?')[0] + '?' : crossBorderData.cta}
                    </p>
                    {crossBorderData.cta.includes('?') && (
                      <p className="text-lg sm:text-xl text-slate-900 break-words">
                        {crossBorderData.cta.split('?')[1]?.trim()}
                      </p>
                    )}
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

import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import { Package, FileText, Zap, Anchor, Globe2 } from "lucide-react";
import DeliverySidebarNav from "../../../../components/DeliverySidebarNav";

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
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-teal-50 via-cyan-50 to-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Title and Description */}
              <div className="lg:col-span-2">
                <h1 className="mb-6 text-5xl md:text-6xl font-bold text-gray-900">
                  {t.delivery.euWorld}
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {locale === "ua" &&
                    "Доставка вантажів в країни Європейського Союзу та інші країни світу. Широкий спектр логістичних рішень для міжнародної торгівлі."}
                  {locale === "ru" &&
                    "Доставка грузов в страны Европейского Союза и другие страны мира. Широкий спектр логистических решений для международной торговли."}
                  {locale === "en" &&
                    "Delivery of cargo to European Union countries and other countries around the world. A wide range of logistics solutions for international trade."}
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
                title={locale === "ua" ? "Послуги доставки" : locale === "ru" ? "Услуги доставки" : "Delivery Services"}
              />

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-20">
                {/* FBA Delivery */}
                <section id="fba" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{fbaData.title}</h2>
                  </div>
                  <p className="mb-6 text-xl text-gray-600">{fbaData.subtitle}</p>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-8">
                    <p className="text-lg text-gray-700">{fbaData.intro}</p>
                  </div>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{fbaData.whatIncludes}</h3>
                      <ul className="space-y-3">
                        {fbaData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-orange-600">•</span>
                            <span className="text-gray-600">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{fbaData.advantages}</h3>
                      <ul className="space-y-3">
                        {fbaData.advantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="text-green-600 font-bold">✔</span>
                            <span className="text-gray-600">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{fbaData.deliveryTypes}</h3>
                    <ul className="space-y-2">
                      {fbaData.deliveryOptions.map((option, index) => (
                        <li key={index} className="text-gray-700">{option}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-8">
                    <p className="text-lg font-semibold text-gray-900">{fbaData.cta}</p>
                  </div>
                </section>

                {/* DDP/DDU Delivery */}
                <section id="ddp" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{ddpData.title}</h2>
                  </div>
                  
                  {/* DDU Section */}
                  <div className="mb-12 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm">
                    <h3 className="mb-4 text-3xl font-bold text-gray-900">{ddpData.dduTitle}</h3>
                    <p className="mb-8 text-lg text-gray-600">{ddpData.dduIntro}</p>
                    
                    <div className="mb-8 grid gap-8 md:grid-cols-2">
                      <div>
                        <h4 className="mb-4 text-xl font-semibold text-gray-900">{ddpData.dduWhatIncludes}</h4>
                        <ul className="space-y-2">
                          {ddpData.dduServices.map((service, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-1 text-blue-600">•</span>
                              <span className="text-gray-600">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-4 text-xl font-semibold text-gray-900">{ddpData.dduPays}</h4>
                        <ul className="space-y-2">
                          {ddpData.dduPaysList.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="mt-1 text-blue-600">•</span>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="mb-4 text-xl font-semibold text-gray-900">{ddpData.dduForWhom}</h4>
                      <ul className="space-y-2">
                        {ddpData.dduClients.map((client, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-blue-600">-</span>
                            <span className="text-gray-600">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* DDP Section */}
                  <div className="mb-8 rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-8 shadow-sm">
                    <h3 className="mb-4 text-3xl font-bold text-gray-900">{ddpData.ddpTitle}</h3>
                    <p className="mb-8 text-lg text-gray-600">{ddpData.ddpIntro}</p>
                    
                    <div className="mb-8">
                      <h4 className="mb-4 text-xl font-semibold text-gray-900">{ddpData.ddpWhatIncludes}</h4>
                      <ul className="space-y-2">
                        {ddpData.ddpServices.map((service, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-teal-600">•</span>
                            <span className="text-gray-600">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="mb-4 text-xl font-semibold text-gray-900">{ddpData.ddpAdvantages}</h4>
                      <ul className="space-y-2">
                        {ddpData.ddpAdvantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="text-green-600 font-bold">✔</span>
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-8">
                    <p className="text-lg font-semibold text-gray-900">{ddpData.cta}</p>
                  </div>
                </section>

                {/* Express Delivery */}
                <section id="express" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-3">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{expressData.title}</h2>
                  </div>
                  <p className="mb-2 text-xl text-gray-600">{expressData.subtitle}</p>
                  <p className="mb-8 text-lg text-gray-500">{expressData.intro}</p>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{expressData.whatIs}</h3>
                    <p className="text-lg text-gray-700">{expressData.description}</p>
                  </div>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{expressData.advantages}</h3>
                      <ul className="space-y-3">
                        {expressData.advantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-yellow-600 font-bold">✓</span>
                            <span className="text-gray-600">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{expressData.whatWeDo}</h3>
                      <ul className="space-y-3">
                        {expressData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-yellow-600">•</span>
                            <span className="text-gray-600">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{expressData.forWhom}</h3>
                    <ul className="space-y-2">
                      {expressData.clients.map((client, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 text-yellow-600">•</span>
                          <span className="text-gray-600">{client}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-8">
                    <p className="text-lg font-semibold text-gray-900">{expressData.cta}</p>
                  </div>
                </section>

                {/* Port-to-Port */}
                <section id="port-to-port" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                      <Anchor className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{portToPortData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
                    <p className="text-lg text-gray-700">{portToPortData.intro}</p>
                  </div>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{portToPortData.whatIncludes}</h3>
                      <ul className="space-y-3">
                        {portToPortData.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-cyan-600">•</span>
                            <span className="text-gray-600">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{portToPortData.whatNotIncludes}</h3>
                      <ul className="space-y-3">
                        {portToPortData.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-red-600">✗</span>
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-900">{portToPortData.forWhom}</h3>
                    <ul className="space-y-2 mb-6">
                      {portToPortData.clients.map((client, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-1 text-cyan-600">•</span>
                          <span className="text-gray-600">{client}</span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <h4 className="mb-3 text-xl font-semibold text-gray-900">{portToPortData.advantages}</h4>
                      <ul className="space-y-2">
                        {portToPortData.advantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="text-green-600 font-bold">✔</span>
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-8">
                    <p className="text-lg font-semibold text-gray-900">{portToPortData.cta}</p>
                  </div>
                </section>

                {/* Cross-Border */}
                <section id="cross-border" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-3">
                      <Globe2 className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{crossBorderData.title}</h2>
                  </div>
                  
                  <div className="mb-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                    <p className="text-lg text-gray-700">{crossBorderData.intro}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-6 text-2xl font-semibold text-gray-900">{crossBorderData.howItWorks}</h3>
                    <ol className="space-y-4">
                      {crossBorderData.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-4">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="pt-1 text-gray-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mb-8 grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{crossBorderData.advantages}</h3>
                      <ul className="space-y-3">
                        {crossBorderData.advantagesList.map((advantage, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <span className="text-green-600 font-bold">✔</span>
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{crossBorderData.forWhom}</h3>
                      <ul className="space-y-3">
                        {crossBorderData.clients.map((client, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 text-green-600">•</span>
                            <span className="text-gray-600">{client}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-8">
                    <p className="text-lg font-semibold text-gray-900">{crossBorderData.cta}</p>
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

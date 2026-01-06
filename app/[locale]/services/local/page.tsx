import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";
import Image from "next/image";

const content = {
  ua: {
    title: "Локальна доставка в Китаї",
    subtitle: "Забір товарів / Доставка по місту / Міжміські перевезення / Доставка до складів",
    intro: "Ми здійснюємо швидку та надійну локальну доставку по всьому Китаю, забезпечуючи зручну логістику між постачальниками, фабриками, складами та транспортними хабами. Працюємо з будь-якими видами вантажів — від дрібних пакунків до великих палетних партій та контейнерів.",
    ourCapabilities: "Наші можливості",
    services: [
      {
        title: "Забір товару від виробників та постачальників",
        icon: "/services/local-icons/cargo-forwarding.svg",
        items: [
      "виїзд на фабрики, заводи та склади",
      "перевірка вантажу під час забору (за потреби)",
      "фото/відео фіксація",
    ],
      },
      {
        title: "Доставка до консолідаційних складів",
        icon: "/services/local-icons/luggage.svg",
        items: [
      "переміщення товарів між складами",
      "підготовка до міжнародної відправки",
      "швидкий та безпечний транзит",
    ],
      },
      {
        title: "Міська та міжміська доставка",
        icon: "/services/local-icons/direct-route.svg",
        items: [
      "оперативна доставка в межах одного міста",
      "міжнародні хаби: Гуанчжоу, Іу, Шеньчжень, Шанхай, Нінбо, Пекін",
      "міжміські вантажоперевезення по всій території КНР",
    ],
      },
      {
        title: "Доставка на морські, авіа та ж/д термінали",
        icon: "/services/local-icons/multimodal-transportation.svg",
        items: [
      "доставка в порти та аеропорти для експорту",
      "доставка до ж/д станцій для відправок у Європу",
      "точне дотримання дедлайнів відправлень",
    ],
      },
    ],
    cargoTypes: "Типи вантажів",
    cargoTypesList: [
      {
        title: "Дрібні пакунки",
        description: "Швидка доставка невеликих посилок та індивідуальних замовлень по містах Китаю. Ідеально для e-commerce та персональних покупок.",
      },
      {
        title: "Палетні та коробкові вантажі",
        description: "Професійна логістика стандартних палетних та коробкових партій. Оптимізація маршрутів та витрат для середніх обсягів товарів.",
      },
      {
        title: "Великогабаритні та важкі товари",
        description: "Спеціалізована доставка великогабаритного обладнання, меблів та важких вантажів. Використання спеціального транспорту та обладнання.",
      },
      {
        title: "Товарні партії для Amazon FBA / e-commerce",
        description: "Підготовка та доставка товарних партій до складів Amazon FBA та інших e-commerce платформ. Дотримання всіх вимог платформи.",
      },
    ],
    advantages: "Переваги нашого сервісу",
    advantagesList: [
      "чітка логістика",
      "оптимальні тарифи по всьому Китаю",
      "досвід роботи з фабриками, локальними кур'єрами та складами",
      "постійне відстеження вантажу",
      "повний супровід до моменту передачі на міжнародну доставку",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "імпортерів та закупівельників",
      "бізнесу, що працює з фабриками Китаю",
      "e-commerce продавців та маркетплейсів",
      "компаній, що потребують швидкої доставки між складами й терміналами",
    ],
  },
  ru: {
    title: "Локальная доставка в Китае",
    subtitle: "Забор товаров / Доставка по городу / Междугородние перевозки / Доставка до складов",
    intro: "Мы осуществляем быструю и надежную локальную доставку по всему Китаю, обеспечивая удобную логистику между поставщиками, фабриками, складами и транспортными хабами. Работаем с любыми видами грузов — от мелких посылок до крупных палетных партий и контейнеров.",
    ourCapabilities: "Наши возможности",
    services: [
      {
        title: "Забор товара от производителей и поставщиков",
        icon: "/services/local-icons/cargo-forwarding.svg",
        items: [
      "выезд на фабрики, заводы и склады",
      "проверка груза при заборе (при необходимости)",
      "фото/видео фиксация",
    ],
      },
      {
        title: "Доставка до консолидационных складов",
        icon: "/services/local-icons/luggage.svg",
        items: [
      "перемещение товаров между складами",
      "подготовка к международной отправке",
      "быстрый и безопасный транзит",
    ],
      },
      {
        title: "Городская и междугородняя доставка",
        icon: "/services/local-icons/direct-route.svg",
        items: [
      "оперативная доставка в пределах одного города",
      "международные хабы: Гуанчжоу, Иу, Шэньчжэнь, Шанхай, Нинбо, Пекин",
      "междугородние грузоперевозки по всей территории КНР",
    ],
      },
      {
        title: "Доставка на морские, авиа и ж/д терминалы",
        icon: "/services/local-icons/multimodal-transportation.svg",
        items: [
      "доставка в порты и аэропорты для экспорта",
      "доставка до ж/д станций для отправок в Европу",
      "точное соблюдение дедлайнов отправлений",
    ],
      },
    ],
    cargoTypes: "Типы грузов",
    cargoTypesList: [
      {
        title: "Мелкие посылки",
        description: "Быстрая доставка небольших посылок и индивидуальных заказов по городам Китая. Идеально для e-commerce и личных покупок.",
      },
      {
        title: "Палетные и коробочные грузы",
        description: "Профессиональная логистика стандартных палетных и коробочных партий. Оптимизация маршрутов и затрат для средних объемов товаров.",
      },
      {
        title: "Крупногабаритные и тяжелые товары",
        description: "Специализированная доставка крупногабаритного оборудования, мебели и тяжелых грузов. Использование специального транспорта и оборудования.",
      },
      {
        title: "Товарные партии для Amazon FBA / e-commerce",
        description: "Подготовка и доставка товарных партий на склады Amazon FBA и других e-commerce платформ. Соблюдение всех требований платформы.",
      },
    ],
    advantages: "Преимущества нашего сервиса",
    advantagesList: [
      "четкая логистика",
      "оптимальные тарифы по всему Китаю",
      "опыт работы с фабриками, локальными курьерами и складами",
      "постоянное отслеживание груза",
      "полное сопровождение до момента передачи на международную доставку",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "импортеров и закупщиков",
      "бизнеса, работающего с фабриками Китая",
      "e-commerce продавцов и маркетплейсов",
      "компаний, которые нуждаются в быстрой доставке между складами и терминалами",
    ],
  },
  en: {
    title: "Local Delivery in China",
    subtitle: "Product Pickup / City Delivery / Intercity Transportation / Delivery to Warehouses",
    intro: "We provide fast and reliable local delivery throughout China, ensuring convenient logistics between suppliers, factories, warehouses and transport hubs. We work with any types of cargo — from small packages to large palletized batches and containers.",
    ourCapabilities: "Our capabilities",
    services: [
      {
        title: "Product Pickup from Manufacturers and Suppliers",
        icon: "/services/local-icons/cargo-forwarding.svg",
        items: [
      "visits to factories, plants and warehouses",
      "cargo verification during pickup (if needed)",
      "photo/video documentation",
    ],
      },
      {
        title: "Delivery to Consolidation Warehouses",
        icon: "/services/local-icons/luggage.svg",
        items: [
      "movement of goods between warehouses",
      "preparation for international shipment",
      "fast and safe transit",
    ],
      },
      {
        title: "City and Intercity Delivery",
        icon: "/services/local-icons/direct-route.svg",
        items: [
      "operational delivery within one city",
      "international hubs: Guangzhou, Yiwu, Shenzhen, Shanghai, Ningbo, Beijing",
      "intercity freight transportation throughout PRC",
    ],
      },
      {
        title: "Delivery to Sea, Air and Rail Terminals",
        icon: "/services/local-icons/multimodal-transportation.svg",
        items: [
      "delivery to ports and airports for export",
      "delivery to rail stations for shipments to Europe",
      "strict adherence to shipment deadlines",
    ],
      },
    ],
    cargoTypes: "Cargo Types",
    cargoTypesList: [
      {
        title: "Small packages",
        description: "Fast delivery of small parcels and individual orders across Chinese cities. Perfect for e-commerce and personal purchases.",
      },
      {
        title: "Palletized and boxed cargo",
        description: "Professional logistics for standard palletized and boxed shipments. Route and cost optimization for medium volumes of goods.",
      },
      {
        title: "Oversized and heavy goods",
        description: "Specialized delivery of oversized equipment, furniture, and heavy cargo. Use of specialized transport and equipment.",
      },
      {
        title: "Goods batches for Amazon FBA / e-commerce",
        description: "Preparation and delivery of goods batches to Amazon FBA warehouses and other e-commerce platforms. Compliance with all platform requirements.",
      },
    ],
    advantages: "Advantages of our service",
    advantagesList: [
      "clear logistics",
      "optimal tariffs throughout China",
      "experience working with factories, local couriers and warehouses",
      "constant cargo tracking",
      "full support until transfer to international delivery",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and purchasers",
      "businesses working with Chinese factories",
      "e-commerce sellers and marketplaces",
      "companies that need fast delivery between warehouses and terminals",
    ],
  },
};

export default async function LocalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/local-delivery.jpg"
            alt="KLS Logistics"
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
                {data.title}
              </h1>
              <p className="mb-6 text-base font-normal leading-relaxed text-white/95 md:text-lg">
                {data.subtitle}
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

      {/* Info Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-[#E8FDF8] p-8">
            <p className="text-base font-normal leading-relaxed text-gray-700 md:text-lg">
              {data.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Our Capabilities Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.ourCapabilities}
            </h2>
              </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.services.map((service, index) => (
              <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg sm:text-xl md:text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                      {service.title}
                    </h3>
                <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="mt-1.5 text-teal-600">•</span>
                          <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                            {item}
                          </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
                ))}
            </div>
            </div>
      </section>

      {/* Cargo Types Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.cargoTypes}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Left - Image */}
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/logisticeskii-centr 1.jpg"
                alt="Cargo Types"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right - List */}
            <div className="flex flex-col space-y-4">
              {data.cargoTypesList.map((item, index) => (
                <div key={index} className="group flex-1 rounded-2xl border-2 border-[#006D77] bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8]">
                  <h3 className="mb-2 text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-teal-700">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
            </div>
      </section>

      {/* Advantages Section */}
      <section className="relative bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {data.advantages}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {data.advantagesList.map((advantage, index) => (
              <div key={index} className="flex w-full flex-col items-center text-center md:w-[calc(33.333%-1rem)]">
                <div className="mb-4 flex-shrink-0">
                  <Image
                    src="/icons/misc/Group 7.svg"
                    alt="Check"
                    width={43}
                    height={43}
                    className="object-contain"
                  />
                </div>
                <p className="text-base font-normal leading-relaxed text-white md:text-lg">
                  {advantage}
                </p>
              </div>
              ))}
              </div>
            </div>
      </section>

      {/* For Whom Section */}
      <section className="pt-12 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.forWhom}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.clients.map((client, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-[#006D77] bg-white px-6 py-4 text-center transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-sm"
              >
                <p className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-teal-700 [&::first-letter]:uppercase">
                  {client}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}

import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Локальна доставка в Китаї",
    subtitle: "Забір товарів / Доставка по місту / Міжміські перевезення / Доставка до складів",
    intro: "Ми здійснюємо швидку та надійну локальну доставку по всьому Китаю, забезпечуючи зручну логістику між постачальниками, фабриками, складами та транспортними хабами. Працюємо з будь-якими видами вантажів — від дрібних пакунків до великих палетних партій та контейнерів.",
    ourCapabilities: "Наші можливості",
    pickup: "Забір товару від виробників та постачальників",
    pickupServices: [
      "виїзд на фабрики, заводи та склади",
      "перевірка вантажу під час забору (за потреби)",
      "фото/відео фіксація",
    ],
    consolidation: "Доставка до консолідаційних складів",
    consolidationServices: [
      "переміщення товарів між складами",
      "підготовка до міжнародної відправки",
      "швидкий та безпечний транзит",
    ],
    city: "Міська та міжміська доставка",
    cityServices: [
      "оперативна доставка в межах одного міста",
      "міжнародні хаби: Гуанчжоу, Іу, Шеньчжень, Шанхай, Нінбо, Пекін",
      "міжміські вантажоперевезення по всій території КНР",
    ],
    terminals: "Доставка на морські, авіа та ж/д термінали",
    terminalsServices: [
      "доставка в порти та аеропорти для експорту",
      "доставка до ж/д станцій для відправок у Європу",
      "точне дотримання дедлайнів відправлень",
    ],
    cargoTypes: "Типи вантажів",
    cargoTypesList: [
      "дрібні пакунки",
      "палетні та коробкові вантажі",
      "великогабаритні та важкі товари",
      "товарні партії для Amazon FBA / e-commerce",
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
    pickup: "Забор товара от производителей и поставщиков",
    pickupServices: [
      "выезд на фабрики, заводы и склады",
      "проверка груза при заборе (при необходимости)",
      "фото/видео фиксация",
    ],
    consolidation: "Доставка до консолидационных складов",
    consolidationServices: [
      "перемещение товаров между складами",
      "подготовка к международной отправке",
      "быстрый и безопасный транзит",
    ],
    city: "Городская и междугородняя доставка",
    cityServices: [
      "оперативная доставка в пределах одного города",
      "международные хабы: Гуанчжоу, Иу, Шэньчжэнь, Шанхай, Нинбо, Пекин",
      "междугородние грузоперевозки по всей территории КНР",
    ],
    terminals: "Доставка на морские, авиа и ж/д терминалы",
    terminalsServices: [
      "доставка в порты и аэропорты для экспорта",
      "доставка до ж/д станций для отправок в Европу",
      "точное соблюдение дедлайнов отправлений",
    ],
    cargoTypes: "Типы грузов",
    cargoTypesList: [
      "мелкие посылки",
      "палетные и коробочные грузы",
      "крупногабаритные и тяжелые товары",
      "товарные партии для Amazon FBA / e-commerce",
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
    pickup: "Product Pickup from Manufacturers and Suppliers",
    pickupServices: [
      "visits to factories, plants and warehouses",
      "cargo verification during pickup (if needed)",
      "photo/video documentation",
    ],
    consolidation: "Delivery to Consolidation Warehouses",
    consolidationServices: [
      "movement of goods between warehouses",
      "preparation for international shipment",
      "fast and safe transit",
    ],
    city: "City and Intercity Delivery",
    cityServices: [
      "operational delivery within one city",
      "international hubs: Guangzhou, Yiwu, Shenzhen, Shanghai, Ningbo, Beijing",
      "intercity freight transportation throughout PRC",
    ],
    terminals: "Delivery to Sea, Air and Rail Terminals",
    terminalsServices: [
      "delivery to ports and airports for export",
      "delivery to rail stations for shipments to Europe",
      "strict adherence to shipment deadlines",
    ],
    cargoTypes: "Cargo Types",
    cargoTypesList: [
      "small packages",
      "palletized and boxed cargo",
      "oversized and heavy goods",
      "goods batches for Amazon FBA / e-commerce",
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
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{data.title}</h1>
          <p className="mb-8 text-xl text-gray-600">{data.subtitle}</p>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.ourCapabilities}</h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.pickup}</h3>
                <ul className="space-y-2">
                  {data.pickupServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-cyan-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.consolidation}</h3>
                <ul className="space-y-2">
                  {data.consolidationServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-cyan-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.city}</h3>
                <ul className="space-y-2">
                  {data.cityServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-cyan-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.terminals}</h3>
                <ul className="space-y-2">
                  {data.terminalsServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-cyan-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.cargoTypes}</h2>
              <ul className="space-y-2">
                {data.cargoTypesList.map((type, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-cyan-600">•</span>
                    <span className="text-gray-600">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-green-600 font-bold">✔</span>
                    <span className="text-gray-700">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
            <ul className="space-y-3">
              {data.clients.map((client, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-cyan-600">•</span>
                  <span className="text-gray-600">{client}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


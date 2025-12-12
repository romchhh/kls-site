import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Сервіс пошуку та закупівлі в Китаї та Кореї",
    subtitle: "Пошук постачальників / Перевірка фабрик / Ведення переговорів / Закупівля під ключ",
    intro: "Ми надаємо комплексний сервіс з пошуку товарів та виробників у Китаї та Південній Кореї, допомагаючи бізнесу отримати надійних постачальників, вигідні умови та повний супровід у процесі закупівлі.",
    ourServices: "Наші послуги",
    search: "Пошук постачальників і фабрик",
    searchServices: [
      "підбір виробників за вашим технічним завданням",
      "пошук товарів на 1688, Taobao, Alibaba, китайських і корейських B2B-платформах",
      "аналіз ринку та порівняння цін",
    ],
    verification: "Перевірка постачальників (Factory Check)",
    verificationServices: [
      "перевірка документів та легальності компанії",
      "аналіз відгуків, рейтингу, виробничих потужностей",
      "запит сертифікації та підтверджуючих матеріалів",
    ],
    negotiations: "Переговори з постачальниками",
    negotiationsServices: [
      "узгодження цін, умов виробництва та поставки",
      "контроль специфікацій і відповідності вимогам",
      "погодження умов Incoterms, термінів та оплати",
    ],
    purchasing: "Закупівля та оформлення замовлень",
    purchasingServices: [
      "оформлення замовлення \"під ключ\"",
      "оплата постачальнику або фабриці",
      "контроль виробництва (за потреби – фото/відео звіти)",
    ],
    quality: "Контроль якості та інспекція",
    qualityServices: [
      "перевірка товару перед відправкою",
      "перевірка кількості, маркування, пакування",
      "тестування (якщо потрібно)",
    ],
    whyEffective: "Чому наш сервіс ефективний",
    advantagesList: [
      "великий досвід роботи з китайськими та корейськими виробниками",
      "реальна перевірка постачальників — мінімізація ризиків",
      "прямий контакт з фабриками без посередників",
      "оптимальні ціни і повна прозорість закупівель",
      "супровід усіх етапів — від пошуку до доставки",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "малого, середнього та великого бізнесу",
      "e-commerce та маркетплейсів",
      "виробників та дистриб'юторів",
      "компаній, що хочуть замовляти напряму з Китаю або Кореї",
    ],
  },
  ru: {
    title: "Сервис поиска и закупки в Китае и Корее",
    subtitle: "Поиск поставщиков / Проверка фабрик / Ведение переговоров / Закупка под ключ",
    intro: "Мы предоставляем комплексный сервис по поиску товаров и производителей в Китае и Южной Корее, помогая бизнесу получить надежных поставщиков, выгодные условия и полное сопровождение в процессе закупки.",
    ourServices: "Наши услуги",
    search: "Поиск поставщиков и фабрик",
    searchServices: [
      "подбор производителей по вашему техническому заданию",
      "поиск товаров на 1688, Taobao, Alibaba, китайских и корейских B2B-платформах",
      "анализ рынка и сравнение цен",
    ],
    verification: "Проверка поставщиков (Factory Check)",
    verificationServices: [
      "проверка документов и легальности компании",
      "анализ отзывов, рейтинга, производственных мощностей",
      "запрос сертификации и подтверждающих материалов",
    ],
    negotiations: "Переговоры с поставщиками",
    negotiationsServices: [
      "согласование цен, условий производства и поставки",
      "контроль спецификаций и соответствия требованиям",
      "согласование условий Incoterms, сроков и оплаты",
    ],
    purchasing: "Закупка и оформление заказов",
    purchasingServices: [
      "оформление заказа \"под ключ\"",
      "оплата поставщику или фабрике",
      "контроль производства (при необходимости – фото/видео отчеты)",
    ],
    quality: "Контроль качества и инспекция",
    qualityServices: [
      "проверка товара перед отправкой",
      "проверка количества, маркировки, упаковки",
      "тестирование (если нужно)",
    ],
    whyEffective: "Почему наш сервис эффективен",
    advantagesList: [
      "большой опыт работы с китайскими и корейскими производителями",
      "реальная проверка поставщиков — минимизация рисков",
      "прямой контакт с фабриками без посредников",
      "оптимальные цены и полная прозрачность закупок",
      "сопровождение всех этапов — от поиска до доставки",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "малого, среднего и крупного бизнеса",
      "e-commerce и маркетплейсов",
      "производителей и дистрибьюторов",
      "компаний, которые хотят заказывать напрямую из Китая или Кореи",
    ],
  },
  en: {
    title: "Search and Procurement Service in China and Korea",
    subtitle: "Supplier Search / Factory Verification / Negotiations / Turnkey Procurement",
    intro: "We provide a comprehensive service for finding goods and manufacturers in China and South Korea, helping businesses get reliable suppliers, favorable terms and full support in the procurement process.",
    ourServices: "Our services",
    search: "Supplier and Factory Search",
    searchServices: [
      "selection of manufacturers according to your technical specification",
      "product search on 1688, Taobao, Alibaba, Chinese and Korean B2B platforms",
      "market analysis and price comparison",
    ],
    verification: "Supplier Verification (Factory Check)",
    verificationServices: [
      "verification of documents and company legality",
      "analysis of reviews, ratings, production capacity",
      "request for certification and supporting materials",
    ],
    negotiations: "Negotiations with Suppliers",
    negotiationsServices: [
      "coordination of prices, production and delivery terms",
      "control of specifications and compliance with requirements",
      "coordination of Incoterms, terms and payment",
    ],
    purchasing: "Procurement and Order Processing",
    purchasingServices: [
      "turnkey order processing",
      "payment to supplier or factory",
      "production control (if needed – photo/video reports)",
    ],
    quality: "Quality Control and Inspection",
    qualityServices: [
      "product verification before shipment",
      "verification of quantity, labeling, packaging",
      "testing (if needed)",
    ],
    whyEffective: "Why our service is effective",
    advantagesList: [
      "extensive experience working with Chinese and Korean manufacturers",
      "real supplier verification — risk minimization",
      "direct contact with factories without intermediaries",
      "optimal prices and full transparency of purchases",
      "support of all stages — from search to delivery",
    ],
    forWhom: "For whom it suits",
    clients: [
      "small, medium and large businesses",
      "e-commerce and marketplaces",
      "manufacturers and distributors",
      "companies that want to order directly from China or Korea",
    ],
  },
};

export default async function SourcingPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.ourServices}</h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.search}</h3>
                <ul className="space-y-2">
                  {data.searchServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-pink-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.verification}</h3>
                <ul className="space-y-2">
                  {data.verificationServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-pink-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.negotiations}</h3>
                <ul className="space-y-2">
                  {data.negotiationsServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-pink-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.purchasing}</h3>
                <ul className="space-y-2">
                  {data.purchasingServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-pink-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.quality}</h3>
                <ul className="space-y-2">
                  {data.qualityServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-pink-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whyEffective}</h2>
              <ul className="space-y-3">
                {data.advantagesList.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-green-600 font-bold">✔</span>
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
                    <span className="mt-1 text-pink-600">•</span>
                    <span className="text-gray-600">{client}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


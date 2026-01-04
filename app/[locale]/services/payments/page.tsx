import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { StructuredData } from "../../../../components/StructuredData";
import { Locale } from "../../../../lib/translations";
import { generateServiceMetadata } from "../../../../lib/metadata";
import { Metadata } from "next";
import Image from "next/image";

const content = {
  ua: {
    title: "ГРОШОВІ ПЕРЕКАЗИ",
    subtitle: "Alipay / Банківські картки CNY / Wechаt / Оплата постачальникам та заводам",
    intro: "Ми здійснюємо швидкі, безпечні та вигідні грошові перекази в Китай для бізнесу та приватних осіб. Працюємо з основними платіжними інструментами КНР, що дозволяє проводити оплати постачальникам, фабрикам, виробникам та маркетплейсам.",
    ourCapabilities: "Наші можливості",
    alipay: "Alipay",
    alipayServices: [
      "миттєві перекази на акаунти Alipay",
      "поповнення балансів для закупівель",
      "оплата замовлень на 1688, Taobao, Pinduoduo тощо",
    ],
    bankCards: "Банківські картки та рахунки CNY",
    bankServices: [
      "перекази на карти китайських банків (ICBC, ABC, CCB, Bank of China та ін.)",
      "виплати постачальникам та партнерам",
      "підтримка платежів у юанях CNY",
    ],
    invoices: "Оплата інвойсів і контрактів",
    invoiceServices: [
      "офіційна оплата інвойсів для імпорту",
      "платежі на юридичних осіб у Китаї",
      "підтвердження оплат для митного оформлення",
    ],
    factories: "Платежі заводам та виробникам",
    factoryServices: [
      "передоплата, часткові оплати, фінальні платежі",
      "підтримка закупівель на фабриках та прямих виробників",
      "швидка перевірка зарахування",
    ],
    advantages: "Переваги наших переказів",
    advantagesList: [
      "швидкість — до 12 годин",
      "вигідний курс UAH → CNY / USD → CNY",
      "низькі комісії та прозорі тарифи",
      "підтвердження оплати (скрін/квитанція для постачальника)",
      "безпека — використання офіційних платіжних каналів",
      "підтримка оплат малого, середнього та великого бізнесу",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "імпортерів із Китаю",
      "закупівельників та посередників",
      "власників магазинів, складів, маркетплейсів",
      "компаній, що оплачують інвойси, партії товарів, пробні закупівлі",
      "підприємців, які працюють з фабриками та виробниками",
    ],
  },
  ru: {
    title: "ДЕНЕЖНЫЕ ПЕРЕВОДЫ",
    subtitle: "Alipay / Банковские карты CNY / Wechat / Оплата поставщикам и заводам",
    intro: "Мы осуществляем быстрые, безопасные и выгодные денежные переводы в Китай для бизнеса и частных лиц. Работаем с основными платежными инструментами КНР, что позволяет проводить оплаты поставщикам, фабрикам, производителям и маркетплейсам.",
    ourCapabilities: "Наши возможности",
    alipay: "Alipay",
    alipayServices: [
      "мгновенные переводы на аккаунты Alipay",
      "пополнение балансов для закупок",
      "оплата заказов на 1688, Taobao, Pinduoduo и т.д.",
    ],
    bankCards: "Банковские карты и счета CNY",
    bankServices: [
      "переводы на карты китайских банков (ICBC, ABC, CCB, Bank of China и др.)",
      "выплаты поставщикам и партнерам",
      "поддержка платежей в юанях CNY",
    ],
    invoices: "Оплата инвойсов и контрактов",
    invoiceServices: [
      "официальная оплата инвойсов для импорта",
      "платежи на юридических лиц в Китае",
      "подтверждение оплат для таможенного оформления",
    ],
    factories: "Платежи заводам и производителям",
    factoryServices: [
      "предоплата, частичные оплаты, финальные платежи",
      "поддержка закупок на фабриках и прямых производителей",
      "быстрая проверка зачисления",
    ],
    advantages: "Преимущества наших переводов",
    advantagesList: [
      "скорость — до 12 часов",
      "выгодный курс UAH → CNY / USD → CNY",
      "низкие комиссии и прозрачные тарифы",
      "подтверждение оплаты (скрин/квитанция для поставщика)",
      "безопасность — использование официальных платежных каналов",
      "поддержка оплат малого, среднего и крупного бизнеса",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "импортеров из Китая",
      "закупщиков и посредников",
      "владельцев магазинов, складов, маркетплейсов",
      "компаний, оплачивающих инвойсы, партии товаров, пробные закупки",
      "предпринимателей, работающих с фабриками и производителями",
    ],
  },
  en: {
    title: "MONEY TRANSFERS",
    subtitle: "Alipay / Bank Cards CNY / Wechat / Payment to Suppliers and Factories",
    intro: "We provide fast, secure and profitable money transfers to China for businesses and individuals. We work with main payment instruments of PRC, allowing payments to suppliers, factories, manufacturers and marketplaces.",
    ourCapabilities: "Our capabilities",
    alipay: "Alipay",
    alipayServices: [
      "instant transfers to Alipay accounts",
      "balance top-up for purchases",
      "payment for orders on 1688, Taobao, Pinduoduo, etc.",
    ],
    bankCards: "Bank Cards and Accounts CNY",
    bankServices: [
      "transfers to Chinese bank cards (ICBC, ABC, CCB, Bank of China, etc.)",
      "payments to suppliers and partners",
      "support for payments in CNY yuan",
    ],
    invoices: "Invoice and Contract Payment",
    invoiceServices: [
      "official invoice payment for import",
      "payments to legal entities in China",
      "payment confirmation for customs clearance",
    ],
    factories: "Payments to Factories and Manufacturers",
    factoryServices: [
      "prepayment, partial payments, final payments",
      "support for purchases at factories and direct manufacturers",
      "quick verification of crediting",
    ],
    advantages: "Advantages of our transfers",
    advantagesList: [
      "speed — up to 12 hours",
      "favorable rate UAH → CNY / USD → CNY",
      "low commissions and transparent tariffs",
      "payment confirmation (screenshot/receipt for supplier)",
      "security — use of official payment channels",
      "support for small, medium and large business payments",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers from China",
      "purchasers and intermediaries",
      "store owners, warehouses, marketplaces",
      "companies paying invoices, batches of goods, trial purchases",
      "entrepreneurs working with factories and manufacturers",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const serviceNames = {
    ua: "Грошові перекази в Китай - Alipay, WeChat, Банківські картки",
    ru: "Денежные переводы в Китай - Alipay, WeChat, Банковские карты",
    en: "Money Transfers to China - Alipay, WeChat, Bank Cards",
  };
  const serviceDescriptions = {
    ua: "Швидкі та безпечні грошові перекази в Китай. Робота з Alipay, WeChat, банківськими картками CNY. Оплата постачальникам, фабрикам та виробникам. Вигідний курс, низькі комісії, підтвердження оплати.",
    ru: "Быстрые и безопасные денежные переводы в Китай. Работа с Alipay, WeChat, банковскими картами CNY. Оплата поставщикам, фабрикам и производителям. Выгодный курс, низкие комиссии, подтверждение оплаты.",
    en: "Fast and secure money transfers to China. Working with Alipay, WeChat, CNY bank cards. Payment to suppliers, factories and manufacturers. Favorable rate, low commissions, payment confirmation.",
  };
  return generateServiceMetadata(locale, "payments", serviceNames, serviceDescriptions);
}

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <StructuredData 
        locale={locale} 
        type="Service"
        serviceName={data.title}
        serviceDescription={data.intro}
        breadcrumbs={[
          { name: locale === "ua" ? "Головна" : locale === "ru" ? "Главная" : "Home", url: `/${locale}` },
          { name: locale === "ua" ? "Послуги" : locale === "ru" ? "Услуги" : "Services", url: `/${locale}/services` },
          { name: data.title, url: `/${locale}/services/payments` },
        ]}
      />
      <Navigation locale={locale} />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vygruzka-gruzovikov-v-logisticeskom-centre-s-vozduha 1.jpg"
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
            {/* Alipay Card */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/payments-icons/alipay.svg"
                    alt="Alipay"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                    {data.alipay}
                  </h3>
                <ul className="space-y-2">
                  {data.alipayServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 text-teal-600">•</span>
                        <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                          {service}
                        </span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
              </div>

            {/* Bank Cards Card */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/payments-icons/bank-cards.svg"
                    alt="Bank Cards"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                    {data.bankCards}
                  </h3>
                <ul className="space-y-2">
                    {data.bankServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 text-teal-600">•</span>
                        <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                          {service}
                        </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

            {/* Invoices Card */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/payments-icons/invoices.svg"
                    alt="Invoices"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
            </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                    {data.invoices}
                  </h3>
                  <ul className="space-y-2">
                    {data.invoiceServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 text-teal-600">•</span>
                        <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                          {service}
                        </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
            </div>

            {/* Factories Card */}
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/payments-icons/factories.svg"
                    alt="Factories"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                    {data.factories}
                  </h3>
                  <ul className="space-y-2">
                    {data.factoryServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 text-teal-600">•</span>
                        <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                          {service}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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


import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

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

export default async function PaymentsPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.ourCapabilities}</h2>
            <div className="space-y-8">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.alipay}</h3>
                <ul className="space-y-2">
                  {data.alipayServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.bankCards}</h3>
                <ul className="space-y-2">
                  {data.bankServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.invoices}</h3>
                <ul className="space-y-2">
                  {data.invoiceServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{data.factories}</h3>
                <ul className="space-y-2">
                  {data.factoryServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-green-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
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
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
              <ul className="space-y-3">
                {data.clients.map((client, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-green-600">•</span>
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


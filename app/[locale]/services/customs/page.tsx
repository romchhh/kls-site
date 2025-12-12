import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Митно-брокерські послуги",
    subtitle: "Оформлення вантажів / Консультації / Підготовка документів / Супровід на митниці",
    intro: "Ми надаємо повний комплекс митно-брокерських послуг для імпортних та експортних вантажів. Забезпечуємо швидке та коректне оформлення вантажів на всіх етапах — від підготовки документів до успішного проходження митного контролю.",
    ourServices: "Наші послуги",
    customsDeclarations: "Оформлення митних декларацій",
    declarationsList: [
      "імпортні та експортні декларації",
      "попередні декларації",
      "оформлення для всіх видів транспорту (авто, авіа, море, ж/д)",
    ],
    certificates: "Сертифікати та дозвільні документи",
    certificatesList: [
      "сертифікати відповідності",
      "фітосанітарні та ветеринарні сертифікати",
      "дозвільні документи для специфічних товарів",
    ],
    documents: "Підготовка та перевірка документів",
    documentsList: [
      "інвойси, пакувальні листи, контракти",
      "сертифікати відповідності, CO, дозвільні документи",
      "перевірка коректності даних для митниці",
    ],
    codes: "Визначення кодів УКТЗЕД",
    codesList: [
      "коректний підбір коду товару",
      "мінімізація ризиків штрафів та затримок",
      "розрахунок ставок мита, ПДВ та інших платежів",
    ],
    calculations: "Розрахунок митних платежів",
    calculationsList: [
      "мито, ПДВ, акциз",
      "передача точних розрахунків перед оформленням",
      "планування витрат для клієнта",
    ],
    support: "Супровід вантажу на митниці",
    supportList: [
      "координація з митними органами",
      "термінове вирішення питань",
      "представництво інтересів клієнта",
    ],
    cargoTypes: "Оформлення різних типів вантажів",
    cargoTypesList: [
      "комерційні товарні партії",
      "вантажі з Китаю, США, ЄС",
      "зразки, обладнання, роздрібні партії",
      "складні або специфічні категорії товарів",
    ],
    advantages: "Переваги нашого сервісу",
    advantagesList: [
      "швидке оформлення без затримок",
      "точність у документації та кодуванні",
      "досвід роботи з будь-якими групами товарів",
      "постійна комунікація з клієнтом",
      "прозорі тарифи й повна звітність",
    ],
    forWhom: "Для кого підходить",
    clients: [
      "імпортерів та експортерів",
      "компаній, що працюють з Китаєм та іншими країнами",
      "бізнесу, який регулярно оформлює вантажі",
      "нових підприємців, які потребують супроводу «під ключ»",
    ],
  },
  ru: {
    title: "Таможенно-брокерские услуги",
    subtitle: "Оформление грузов / Консультации / Подготовка документов / Сопровождение на таможне",
    intro: "Мы предоставляем полный комплекс таможенно-брокерских услуг для импортных и экспортных грузов. Обеспечиваем быстрое и корректное оформление грузов на всех этапах — от подготовки документов до успешного прохождения таможенного контроля.",
    ourServices: "Наши услуги",
    customsDeclarations: "Оформление таможенных деклараций",
    declarationsList: [
      "импортные и экспортные декларации",
      "предварительные декларации",
      "оформление для всех видов транспорта (авто, авиа, море, ж/д)",
    ],
    certificates: "Сертификаты и разрешительные документы",
    certificatesList: [
      "сертификаты соответствия",
      "фитосанитарные и ветеринарные сертификаты",
      "разрешительные документы для специфических товаров",
    ],
    documents: "Подготовка и проверка документов",
    documentsList: [
      "инвойсы, упаковочные листы, контракты",
      "сертификаты соответствия, CO, разрешительные документы",
      "проверка корректности данных для таможни",
    ],
    codes: "Определение кодов УКТЗЕД",
    codesList: [
      "корректный подбор кода товара",
      "минимизация рисков штрафов и задержек",
      "расчет ставок пошлины, НДС и других платежей",
    ],
    calculations: "Расчет таможенных платежей",
    calculationsList: [
      "пошлина, НДС, акциз",
      "передача точных расчетов перед оформлением",
      "планирование расходов для клиента",
    ],
    support: "Сопровождение груза на таможне",
    supportList: [
      "координация с таможенными органами",
      "срочное решение вопросов",
      "представление интересов клиента",
    ],
    cargoTypes: "Оформление различных типов грузов",
    cargoTypesList: [
      "коммерческие товарные партии",
      "грузы из Китая, США, ЕС",
      "образцы, оборудование, розничные партии",
      "сложные или специфические категории товаров",
    ],
    advantages: "Преимущества нашего сервиса",
    advantagesList: [
      "быстрое оформление без задержек",
      "точность в документации и кодировании",
      "опыт работы с любыми группами товаров",
      "постоянная коммуникация с клиентом",
      "прозрачные тарифы и полная отчетность",
    ],
    forWhom: "Для кого подходит",
    clients: [
      "импортеров и экспортеров",
      "компаний, работающих с Китаем и другими странами",
      "бизнеса, который регулярно оформляет грузы",
      "новых предпринимателей, которые нуждаются в сопровождении «под ключ»",
    ],
  },
  en: {
    title: "Customs Brokerage Services",
    subtitle: "Cargo Clearance / Consultations / Document Preparation / Customs Support",
    intro: "We provide a full range of customs brokerage services for import and export cargo. We ensure fast and correct cargo clearance at all stages — from document preparation to successful customs control.",
    ourServices: "Our services",
    customsDeclarations: "Customs Declaration Processing",
    declarationsList: [
      "import and export declarations",
      "preliminary declarations",
      "clearance for all types of transport (auto, air, sea, rail)",
    ],
    certificates: "Certificates and Permits",
    certificatesList: [
      "certificates of conformity",
      "phytosanitary and veterinary certificates",
      "permits for specific goods",
    ],
    documents: "Document Preparation and Verification",
    documentsList: [
      "invoices, packing lists, contracts",
      "certificates of conformity, CO, permits",
      "verification of data correctness for customs",
    ],
    codes: "HS Code Determination",
    codesList: [
      "correct product code selection",
      "minimization of fine and delay risks",
      "calculation of duty rates, VAT and other payments",
    ],
    calculations: "Customs Payment Calculation",
    calculationsList: [
      "duty, VAT, excise",
      "transfer of accurate calculations before clearance",
      "expense planning for client",
    ],
    support: "Cargo Support at Customs",
    supportList: [
      "coordination with customs authorities",
      "urgent issue resolution",
      "representation of client interests",
    ],
    cargoTypes: "Clearance of Various Cargo Types",
    cargoTypesList: [
      "commercial goods batches",
      "cargo from China, USA, EU",
      "samples, equipment, retail batches",
      "complex or specific product categories",
    ],
    advantages: "Advantages of our service",
    advantagesList: [
      "fast clearance without delays",
      "accuracy in documentation and coding",
      "experience working with any product groups",
      "constant communication with client",
      "transparent tariffs and full reporting",
    ],
    forWhom: "For whom it suits",
    clients: [
      "importers and exporters",
      "companies working with China and other countries",
      "businesses that regularly clear cargo",
      "new entrepreneurs who need turnkey support",
    ],
  },
};

export default async function CustomsPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">{data.ourServices}</h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.customsDeclarations}</h3>
                <ul className="space-y-2">
                  {data.declarationsList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.certificates}</h3>
                <ul className="space-y-2">
                  {data.certificatesList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.documents}</h3>
                <ul className="space-y-2">
                  {data.documentsList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.codes}</h3>
                <ul className="space-y-2">
                  {data.codesList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.calculations}</h3>
                <ul className="space-y-2">
                  {data.calculationsList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.support}</h3>
                <ul className="space-y-2">
                  {data.supportList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{data.cargoTypes}</h3>
                <ul className="space-y-2">
                  {data.cargoTypesList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-indigo-600">•</span>
                      <span className="text-gray-600">{item}</span>
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
                    <span className="mt-1 text-indigo-600">•</span>
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


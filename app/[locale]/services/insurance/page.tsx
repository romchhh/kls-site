import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Страхування вантажів",
    subtitle: "Повний захист під час міжнародних перевезень / Мінімізація ризиків / Гарантія компенсації",
    intro: "Ми пропонуємо надійне страхування вантажів для всіх видів міжнародної логістики — морської, авіа, авто та залізничної. Ваш вантаж під захистом від моменту відправки до прибуття на склад.",
    whatWeInsure: "Що ми страхуємо",
    cargoTypes: [
      "комерційні партії товарів",
      "обладнання та електроніку",
      "крихкі та цінні вантажі",
      "дрібні та великогабаритні поставки",
    ],
    whatCovers: "Що покриває страхування",
    damage: "Пошкодження вантажу",
    damageText: "Під час транспортування, перевантаження, зберігання або пакування.",
    loss: "Втрата або недостача",
    lossText: "Компенсація у разі часткової чи повної втрати.",
    theft: "Крадіжка або шахрайські дії",
    theftText: "Захист у випадку інцидентів на всіх етапах маршруту.",
    forceMajeure: "Ризики форс-мажору",
    forceMajeureText: "Пожежа, повінь, аварія транспорту, стихійні явища.",
    advantages: "Переваги нашого страхування",
    advantagesList: [
      "прозора вартість, без прихованих комісій",
      "мінімізація фінансових ризиків для імпортера",
      "супровід при оформленні компенсації",
    ],
    howItWorks: "Як це працює",
    steps: [
      "Ви надаєте інформацію про вантаж",
      "Ми підбираємо оптимальне страхове покриття",
      "Оформляємо договір та поліc",
      "Контролюємо весь процес до доставки",
      "У разі страхового випадку — допомагаємо отримати компенсацію",
    ],
    forWhom: "Для кого це актуально",
    clients: [
      "імпортерів і експортерів",
      "бізнесів, що перевозять дорогі або крихкі товари",
      "компаній, які хочуть мінімізувати ризики при міжнародній доставці",
    ],
  },
  ru: {
    title: "Страхование грузов",
    subtitle: "Полная защита во время международных перевозок / Минимизация рисков / Гарантия компенсации",
    intro: "Мы предлагаем надежное страхование грузов для всех видов международной логистики — морской, авиа, авто и железнодорожной. Ваш груз под защитой от момента отправки до прибытия на склад.",
    whatWeInsure: "Что мы страхуем",
    cargoTypes: [
      "коммерческие партии товаров",
      "оборудование и электронику",
      "хрупкие и ценные грузы",
      "мелкие и крупногабаритные поставки",
    ],
    whatCovers: "Что покрывает страхование",
    damage: "Повреждение груза",
    damageText: "Во время транспортировки, перегрузки, хранения или упаковки.",
    loss: "Потеря или недостача",
    lossText: "Компенсация в случае частичной или полной потери.",
    theft: "Кража или мошеннические действия",
    theftText: "Защита в случае инцидентов на всех этапах маршрута.",
    forceMajeure: "Риски форс-мажора",
    forceMajeureText: "Пожар, наводнение, авария транспорта, стихийные явления.",
    advantages: "Преимущества нашего страхования",
    advantagesList: [
      "прозрачная стоимость, без скрытых комиссий",
      "минимизация финансовых рисков для импортера",
      "сопровождение при оформлении компенсации",
    ],
    howItWorks: "Как это работает",
    steps: [
      "Вы предоставляете информацию о грузе",
      "Мы подбираем оптимальное страховое покрытие",
      "Оформляем договор и полис",
      "Контролируем весь процесс до доставки",
      "В случае страхового случая — помогаем получить компенсацию",
    ],
    forWhom: "Для кого это актуально",
    clients: [
      "импортеров и экспортеров",
      "бизнесов, перевозящих дорогие или хрупкие товары",
      "компаний, которые хотят минимизировать риски при международной доставке",
    ],
  },
  en: {
    title: "Cargo Insurance",
    subtitle: "Full Protection During International Transportation / Risk Minimization / Compensation Guarantee",
    intro: "We offer reliable cargo insurance for all types of international logistics — sea, air, auto and rail. Your cargo is protected from the moment of shipment until arrival at the warehouse.",
    whatWeInsure: "What we insure",
    cargoTypes: [
      "commercial goods batches",
      "equipment and electronics",
      "fragile and valuable cargo",
      "small and oversized shipments",
    ],
    whatCovers: "What insurance covers",
    damage: "Cargo Damage",
    damageText: "During transportation, transshipment, storage or packaging.",
    loss: "Loss or Shortage",
    lossText: "Compensation in case of partial or complete loss.",
    theft: "Theft or Fraud",
    theftText: "Protection in case of incidents at all stages of the route.",
    forceMajeure: "Force Majeure Risks",
    forceMajeureText: "Fire, flood, transport accident, natural disasters.",
    advantages: "Advantages of our insurance",
    advantagesList: [
      "transparent cost, without hidden commissions",
      "minimization of financial risks for importer",
      "support when processing compensation",
    ],
    howItWorks: "How it works",
    steps: [
      "You provide cargo information",
      "We select optimal insurance coverage",
      "Process contract and policy",
      "Monitor entire process until delivery",
      "In case of insurance claim — help get compensation",
    ],
    forWhom: "For whom it is relevant",
    clients: [
      "importers and exporters",
      "businesses transporting expensive or fragile goods",
      "companies that want to minimize risks in international delivery",
    ],
  },
};

export default async function InsurancePage({
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Content */}
            <div className="lg:col-span-2">
              <h1 className="mb-4 text-4xl font-bold text-gray-900">{data.title}</h1>
              <p className="mb-8 text-xl text-gray-600">{data.subtitle}</p>
              
              <div className="mb-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
                <p className="text-lg text-gray-700">{data.intro}</p>
              </div>

              <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeInsure}</h2>
              <ul className="space-y-3">
                {data.cargoTypes.map((type, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-emerald-600">🔹</span>
                    <span className="text-gray-600">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatCovers}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">✔️ {data.damage}</h3>
                  <p className="text-sm text-gray-600">{data.damageText}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">✔️ {data.loss}</h3>
                  <p className="text-sm text-gray-600">{data.lossText}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">✔️ {data.theft}</h3>
                  <p className="text-sm text-gray-600">{data.theftText}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">✔️ {data.forceMajeure}</h3>
                  <p className="text-sm text-gray-600">{data.forceMajeureText}</p>
                </div>
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
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.howItWorks}</h2>
              <ol className="space-y-3">
                {data.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.forWhom}</h2>
            <ul className="space-y-3">
              {data.clients.map((client, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-600">•</span>
                  <span className="text-gray-600">{client}</span>
                </li>
              ))}
            </ul>
          </div>
            </div>

            {/* Right column - Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


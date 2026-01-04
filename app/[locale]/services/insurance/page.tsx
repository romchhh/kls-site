import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale } from "../../../../lib/translations";
import Image from "next/image";

const content = {
  ua: {
    title: "Страхування вантажів",
    subtitle: "Повний захист під час міжнародних перевезень / Мінімізація ризиків / Гарантія компенсації",
    intro: "Ми пропонуємо надійне страхування вантажів для всіх видів міжнародної логістики — морської, авіа, авто та залізничної. Ваш вантаж під захистом від моменту відправки до прибуття на склад.",
    ourCapabilities: "Що ми страхуємо",
    services: [
      {
        title: "Комерційні партії товарів",
        icon: "/services/insurance.svg",
        items: ["різноманітні товарні категорії", "оптові та роздрібні партії", "регулярні поставки"],
      },
      {
        title: "Обладнання та електроніка",
        icon: "/why-choose-us/quality.svg",
        items: ["технічне обладнання", "електронні пристрої", "чутливі до пошкоджень товари"],
      },
      {
        title: "Крихкі та цінні вантажі",
        icon: "/why-choose-us/reliability.svg",
        items: ["кришталь, кераміка", "дорогоцінні метали", "мистецтво та антикваріат"],
      },
      {
        title: "Дрібні та великогабаритні поставки",
        icon: "/why-choose-us/fast-delivery.svg",
        items: ["малі пакунки", "великогабаритні вантажі", "спеціальні умови транспортування"],
      },
    ],
    whatWeInsure: "Що ми страхуємо",
    whatWeInsureList: [
      {
        title: "Комерційні партії товарів",
        description: "Різноманітні товарні категорії, оптові та роздрібні партії, регулярні поставки.",
      },
      {
        title: "Обладнання та електроніку",
        description: "Технічне обладнання, електронні пристрої, чутливі до пошкоджень товари.",
      },
      {
        title: "Крихкі та цінні вантажі",
        description: "Кришталь, кераміка, дорогоцінні метали, мистецтво та антикваріат.",
      },
      {
        title: "Дрібні та великогабаритні поставки",
        description: "Малі пакунки, великогабаритні вантажі, спеціальні умови транспортування.",
      },
    ],
    whatCovers: "Що покриває страхування",
    coverage: [
      {
        title: "Пошкодження вантажу",
        text: "Під час транспортування, перевантаження, зберігання або пакування.",
        icon: "/services/insurance.svg",
      },
      {
        title: "Втрата або недостача",
        text: "Компенсація у разі часткової чи повної втрати.",
        icon: "/why-choose-us/reliability.svg",
      },
      {
        title: "Крадіжка або шахрайські дії",
        text: "Захист у випадку інцидентів на всіх етапах маршруту.",
        icon: "/why-choose-us/quality.svg",
      },
      {
        title: "Ризики форс-мажору",
        text: "Пожежа, повінь, аварія транспорту, стихійні явища.",
        icon: "/why-choose-us/support-24-7.svg",
      },
    ],
    advantages: "Переваги нашого страхування",
    advantagesList: [
      "прозора вартість, без прихованих комісій",
      "мінімізація фінансових ризиків для імпортера",
      "супровід при оформленні компенсації",
      "швидке оформлення полісу",
      "надійні страхові партнери",
    ],
    howItWorks: "Як це працює",
    steps: [
      {
        number: "1",
        title: "Ви надаєте інформацію про вантаж",
        description: "",
      },
      {
        number: "2",
        title: "Ми підбираємо оптимальне страхове покриття",
        description: "",
      },
      {
        number: "3",
        title: "Оформляємо договір та поліc",
        description: "",
      },
      {
        number: "4",
        title: "Контролюємо весь процес до доставки",
        description: "",
      },
      {
        number: "5",
        title: "У разі страхового випадку — допомагаємо отримати компенсацію",
        description: "",
      },
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
    ourCapabilities: "Что мы страхуем",
    services: [
      {
        title: "Коммерческие партии товаров",
        icon: "/services/insurance.svg",
        items: ["разнообразные товарные категории", "оптовые и розничные партии", "регулярные поставки"],
      },
      {
        title: "Оборудование и электроника",
        icon: "/why-choose-us/quality.svg",
        items: ["техническое оборудование", "электронные устройства", "чувствительные к повреждениям товары"],
      },
      {
        title: "Хрупкие и ценные грузы",
        icon: "/why-choose-us/reliability.svg",
        items: ["хрусталь, керамика", "драгоценные металлы", "искусство и антиквариат"],
      },
      {
        title: "Мелкие и крупногабаритные поставки",
        icon: "/why-choose-us/fast-delivery.svg",
        items: ["малые пакеты", "крупногабаритные грузы", "специальные условия транспортировки"],
      },
    ],
    whatWeInsure: "Что мы страхуем",
    whatWeInsureList: [
      {
        title: "Коммерческие партии товаров",
        description: "Разнообразные товарные категории, оптовые и розничные партии, регулярные поставки.",
      },
      {
        title: "Оборудование и электронику",
        description: "Техническое оборудование, электронные устройства, чувствительные к повреждениям товары.",
      },
      {
        title: "Хрупкие и ценные грузы",
        description: "Хрусталь, керамика, драгоценные металлы, искусство и антиквариат.",
      },
      {
        title: "Мелкие и крупногабаритные поставки",
        description: "Малые пакеты, крупногабаритные грузы, специальные условия транспортировки.",
      },
    ],
    whatCovers: "Что покрывает страхование",
    coverage: [
      {
        title: "Повреждение груза",
        text: "Во время транспортировки, перегрузки, хранения или упаковки.",
        icon: "/services/insurance.svg",
      },
      {
        title: "Потеря или недостача",
        text: "Компенсация в случае частичной или полной потери.",
        icon: "/why-choose-us/reliability.svg",
      },
      {
        title: "Кража или мошеннические действия",
        text: "Защита в случае инцидентов на всех этапах маршрута.",
        icon: "/why-choose-us/quality.svg",
      },
      {
        title: "Риски форс-мажора",
        text: "Пожар, наводнение, авария транспорта, стихийные явления.",
        icon: "/why-choose-us/support-24-7.svg",
      },
    ],
    advantages: "Преимущества нашего страхования",
    advantagesList: [
      "прозрачная стоимость, без скрытых комиссий",
      "минимизация финансовых рисков для импортера",
      "сопровождение при оформлении компенсации",
      "быстрое оформление полиса",
      "надежные страховые партнеры",
    ],
    howItWorks: "Как это работает",
    steps: [
      {
        number: "1",
        title: "Вы предоставляете информацию о грузе",
        description: "",
      },
      {
        number: "2",
        title: "Мы подбираем оптимальное страховое покрытие",
        description: "",
      },
      {
        number: "3",
        title: "Оформляем договор и полис",
        description: "",
      },
      {
        number: "4",
        title: "Контролируем весь процесс до доставки",
        description: "",
      },
      {
        number: "5",
        title: "В случае страхового случая — помогаем получить компенсацию",
        description: "",
      },
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
    ourCapabilities: "What we insure",
    services: [
      {
        title: "Commercial goods batches",
        icon: "/services/insurance.svg",
        items: ["various product categories", "wholesale and retail batches", "regular deliveries"],
      },
      {
        title: "Equipment and electronics",
        icon: "/why-choose-us/quality.svg",
        items: ["technical equipment", "electronic devices", "damage-sensitive goods"],
      },
      {
        title: "Fragile and valuable cargo",
        icon: "/why-choose-us/reliability.svg",
        items: ["crystal, ceramics", "precious metals", "art and antiques"],
      },
      {
        title: "Small and oversized shipments",
        icon: "/why-choose-us/fast-delivery.svg",
        items: ["small packages", "oversized cargo", "special transportation conditions"],
      },
    ],
    whatWeInsure: "What we insure",
    whatWeInsureList: [
      {
        title: "Commercial goods batches",
        description: "Various product categories, wholesale and retail batches, regular deliveries.",
      },
      {
        title: "Equipment and electronics",
        description: "Technical equipment, electronic devices, damage-sensitive goods.",
      },
      {
        title: "Fragile and valuable cargo",
        description: "Crystal, ceramics, precious metals, art and antiques.",
      },
      {
        title: "Small and oversized shipments",
        description: "Small packages, oversized cargo, special transportation conditions.",
      },
    ],
    whatCovers: "What insurance covers",
    coverage: [
      {
        title: "Cargo Damage",
        text: "During transportation, transshipment, storage or packaging.",
        icon: "/services/insurance.svg",
      },
      {
        title: "Loss or Shortage",
        text: "Compensation in case of partial or complete loss.",
        icon: "/why-choose-us/reliability.svg",
      },
      {
        title: "Theft or Fraud",
        text: "Protection in case of incidents at all stages of the route.",
        icon: "/why-choose-us/quality.svg",
      },
      {
        title: "Force Majeure Risks",
        text: "Fire, flood, transport accident, natural disasters.",
        icon: "/why-choose-us/support-24-7.svg",
      },
    ],
    advantages: "Advantages of our insurance",
    advantagesList: [
      "transparent cost, without hidden commissions",
      "minimization of financial risks for importer",
      "support when processing compensation",
      "quick policy processing",
      "reliable insurance partners",
    ],
    howItWorks: "How it works",
    steps: [
      {
        number: "1",
        title: "You provide cargo information",
        description: "",
      },
      {
        number: "2",
        title: "We select optimal insurance coverage",
        description: "",
      },
      {
        number: "3",
        title: "Process contract and policy",
        description: "",
      },
      {
        number: "4",
        title: "Monitor entire process until delivery",
        description: "",
      },
      {
        number: "5",
        title: "In case of insurance claim — help get compensation",
        description: "",
      },
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

      {/* What We Insure Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.whatWeInsure}
            </h2>
              </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Left - Image */}
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/koncepcia-transporta-i-logistiki (3) 1.jpg"
                alt="Insurance"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right - List */}
            <div className="flex flex-col space-y-4">
              {data.whatWeInsureList.map((item, index) => (
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

      {/* What Covers Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.whatCovers}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.coverage.map((item, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                      {item.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

      {/* How It Works Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {data.howItWorks}
            </h2>
          </div>

          {/* Process Timeline */}
          <div className="relative">
            {/* Horizontal Line Container */}
            <div className="relative hidden md:block mb-16">
              {/* Main Horizontal Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-300" />
              
              {/* Steps with Circles on Line */}
              <div className="relative grid grid-cols-5">
                {data.steps.map((step, index) => (
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
            
            {/* Steps Content */}
            <div className="grid gap-6 md:grid-cols-5">
                {data.steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Step Number Label */}
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {locale === "ua" ? "Крок" : locale === "ru" ? "Шаг" : "Step"} {step.number}
                    </span>
                  </div>
                  
                  {/* Step Content */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
                      {step.title}
                    </h3>
                  </div>
                </div>
                ))}
            </div>
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

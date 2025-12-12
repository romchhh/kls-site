import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Морські перевезення",
    subtitle: "Доставка морем — найвигідніший вибір для середнього та великого бізнесу",
    intro: "Працюєте з великими партіями товару? Тоді морська логістика — ваш шлях до суттєвої економії.",
    sections: [
      {
        title: "Економія на об'ємах",
        text: "Морські перевезення дозволяють суттєво знизити собівартість доставки при великих закупівлях. Чим стабільніші ваші обсяги — тим вигідніше кожна поставка.",
      },
      {
        title: "Планові закупівлі без зайвих витрат",
        text: "Навіть із довшим терміном доставки, бізнес може заздалегідь визначити, коли робити замовлення, щоб товар прибув у потрібний період — без переплат за авіа чи терміновість.",
      },
      {
        title: "Раціональне рішення для зростаючого бізнесу",
        text: "Морська логістика допомагає оптимізувати витрати та інвестувати зекономлене у масштабування.",
      },
    ],
    cta: "Готові перейти на більш вигідний формат доставки? Ми забезпечимо надійну та економічну доставку морем.",
    tariffs: "Наші тарифи",
    tariffFrom: "від 1.5$/кг",
    tariffFcl: "FCL - за запитом (Full container load - повний контейнер)",
    terms: "Терміни",
    termsValue: "55-75 днів",
  },
  ru: {
    title: "Морские перевозки",
    subtitle: "Доставка морем — самый выгодный выбор для среднего и крупного бизнеса",
    intro: "Работаете с большими партиями товара? Тогда морская логистика — ваш путь к существенной экономии.",
    sections: [
      {
        title: "Экономия на объемах",
        text: "Морские перевозки позволяют существенно снизить себестоимость доставки при крупных закупках. Чем стабильнее ваши объемы — тем выгоднее каждая поставка.",
      },
      {
        title: "Плановые закупки без лишних расходов",
        text: "Даже с более длительным сроком доставки, бизнес может заранее определить, когда делать заказ, чтобы товар прибыл в нужный период — без переплат за авиа или срочность.",
      },
      {
        title: "Рациональное решение для растущего бизнеса",
        text: "Морская логистика помогает оптимизировать расходы и инвестировать сэкономленное в масштабирование.",
      },
    ],
    cta: "Готовы перейти на более выгодный формат доставки? Мы обеспечим надежную и экономичную доставку морем.",
    tariffs: "Наши тарифы",
    tariffFrom: "от 1.5$/кг",
    tariffFcl: "FCL - по запросу (Full container load - полный контейнер)",
    terms: "Сроки",
    termsValue: "55-75 дней",
  },
  en: {
    title: "Sea Transportation",
    subtitle: "Sea delivery — the most profitable choice for medium and large businesses",
    intro: "Working with large batches of goods? Then sea logistics is your path to significant savings.",
    sections: [
      {
        title: "Volume savings",
        text: "Sea transportation allows you to significantly reduce delivery costs for large purchases. The more stable your volumes — the more profitable each shipment.",
      },
      {
        title: "Planned purchases without extra costs",
        text: "Even with a longer delivery time, businesses can determine in advance when to place an order so that goods arrive in the right period — without overpaying for air or urgency.",
      },
      {
        title: "Rational solution for growing business",
        text: "Sea logistics helps optimize costs and invest savings in scaling.",
      },
    ],
    cta: "Ready to switch to a more profitable delivery format? We will provide reliable and economical sea delivery.",
    tariffs: "Our tariffs",
    tariffFrom: "from $1.5/kg",
    tariffFcl: "FCL - on request (Full container load)",
    terms: "Terms",
    termsValue: "55-75 days",
  },
};

export default async function SeaDeliveryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const data = content[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{data.title}</h1>
          <p className="mb-8 text-xl text-gray-600">{data.subtitle}</p>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="space-y-8 mb-12">
            {data.sections.map((section, index) => (
              <div key={index} className="border-l-4 border-teal-500 pl-6">
                <h2 className="mb-3 text-2xl font-semibold text-gray-900">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mb-12 rounded-2xl bg-gray-50 p-8">
            <p className="mb-6 text-lg font-semibold text-gray-900">{data.cta}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.tariffs}</h3>
              <p className="mb-2 text-2xl font-bold text-teal-600">{data.tariffFrom}</p>
              <p className="text-sm text-gray-600">{data.tariffFcl}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{data.terms}</h3>
              <p className="text-2xl font-bold text-teal-600">{data.termsValue}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


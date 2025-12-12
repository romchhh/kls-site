import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Пакування та перепакування",
    intro: "Пакування відповідно до вимог транспортування і типу продукції.",
    services: "Послуги включають:",
    servicesList: [
      "індивідуальне та групове пакування",
      "палетування, стретчування, укріплення",
      "спеціальне пакування для крихких або чутливих вантажів",
      "підготовку до авіа-, морських, автоперевезень",
    ],
  },
  ru: {
    title: "Упаковка и переупаковка",
    intro: "Упаковка в соответствии с требованиями транспортировки и типом продукции.",
    services: "Услуги включают:",
    servicesList: [
      "индивидуальная и групповая упаковка",
      "палетирование, стретчирование, укрепление",
      "специальная упаковка для хрупких или чувствительных грузов",
      "подготовка к авиа-, морским, автоперевозкам",
    ],
  },
  en: {
    title: "Packaging and Repackaging",
    intro: "Packaging according to transportation requirements and product type.",
    services: "Services include:",
    servicesList: [
      "individual and group packaging",
      "palletization, stretch wrapping, reinforcement",
      "special packaging for fragile or sensitive cargo",
      "preparation for air, sea, road transportation",
    ],
  },
};

export default async function PackagingPage({
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
          <h1 className="mb-8 text-4xl font-bold text-gray-900">{data.title}</h1>
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.services}</h2>
            <ul className="space-y-3">
              {data.servicesList.map((service, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-orange-600">•</span>
                  <span className="text-gray-600">{service}</span>
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


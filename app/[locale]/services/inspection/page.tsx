import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Інспекція та перевірка",
    intro: "Проводимо контроль якості та відповідності товару перед відправкою або після отримання.",
    whatWeDo: "Ми здійснюємо:",
    services: [
      "кількісну перевірку",
      "фото- та відеофіксацію",
      "огляд упаковки та стану вантажу",
      "документальне підтвердження",
    ],
  },
  ru: {
    title: "Инспекция и проверка",
    intro: "Проводим контроль качества и соответствия товара перед отправкой или после получения.",
    whatWeDo: "Мы осуществляем:",
    services: [
      "количественную проверку",
      "фото- и видеофиксацию",
      "осмотр упаковки и состояния груза",
      "документальное подтверждение",
    ],
  },
  en: {
    title: "Inspection and Verification",
    intro: "We conduct quality control and product compliance before shipment or after receipt.",
    whatWeDo: "We perform:",
    services: [
      "quantity verification",
      "photo and video documentation",
      "packaging and cargo condition inspection",
      "documentary confirmation",
    ],
  },
};

export default async function InspectionPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.whatWeDo}</h2>
            <ul className="space-y-3">
              {data.services.map((service, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-purple-600">•</span>
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


import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Зберігання вантажів",
    intro: "Пропонуємо короткострокове та довгострокове зберігання з контрольованими умовами.",
    advantages: "Переваги:",
    advantagesList: [
      "безпечні складські зони",
      "температурні режими (за потреби)",
      "індивідуальний облік і звітність",
      "швидкий доступ до вантажу",
    ],
  },
  ru: {
    title: "Хранение грузов",
    intro: "Предлагаем краткосрочное и долгосрочное хранение с контролируемыми условиями.",
    advantages: "Преимущества:",
    advantagesList: [
      "безопасные складские зоны",
      "температурные режимы (при необходимости)",
      "индивидуальный учет и отчетность",
      "быстрый доступ к грузу",
    ],
  },
  en: {
    title: "Cargo Storage",
    intro: "We offer short-term and long-term storage with controlled conditions.",
    advantages: "Advantages:",
    advantagesList: [
      "secure warehouse zones",
      "temperature regimes (if needed)",
      "individual accounting and reporting",
      "quick access to cargo",
    ],
  },
};

export default async function StoragePage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <p className="text-lg text-gray-700">{data.intro}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{data.advantages}</h2>
            <ul className="space-y-3">
              {data.advantagesList.map((advantage, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">✔</span>
                  <span className="text-gray-700">{advantage}</span>
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


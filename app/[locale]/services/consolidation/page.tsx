import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale } from "../../../../lib/translations";

const content = {
  ua: {
    title: "Консолідація вантажів",
    intro: "Ми приймаємо відправлення від різних постачальників, об'єднуємо їх у єдину партію та готуємо до оптимізованої доставки.",
    advantages: "Переваги:",
    advantagesList: [
      "зниження витрат на транспортування",
      "можливість відправляти невеликі партії вигідно",
      "якісна перевірка та маркування перед відправкою",
    ],
  },
  ru: {
    title: "Консолидация грузов",
    intro: "Мы принимаем отправления от разных поставщиков, объединяем их в единую партию и готовим к оптимизированной доставке.",
    advantages: "Преимущества:",
    advantagesList: [
      "снижение расходов на транспортировку",
      "возможность отправлять небольшие партии выгодно",
      "качественная проверка и маркировка перед отправкой",
    ],
  },
  en: {
    title: "Cargo Consolidation",
    intro: "We accept shipments from different suppliers, combine them into a single batch and prepare for optimized delivery.",
    advantages: "Advantages:",
    advantagesList: [
      "reduction of transportation costs",
      "ability to send small batches profitably",
      "quality check and labeling before shipment",
    ],
  },
};

export default async function ConsolidationPage({
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
          
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-8">
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


import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";

export default async function WarehousingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const consolidation = (t.services as any).pages.consolidation;
  const storage = (t.services as any).pages.storage;
  const inspection = (t.services as any).pages.inspection;
  const packaging = (t.services as any).pages.packaging;

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Content */}
            <div className="lg:col-span-2">
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                {t.services.warehousing}
              </h1>
              <p className="mb-12 text-xl text-gray-600">
                {locale === "ua"
                  ? "Комплексні складські послуги для зберігання, обробки та підготовки ваших вантажів. Професійне управління складськими запасами та логістикою."
                  : locale === "ru"
                  ? "Комплексные складские услуги для хранения, обработки и подготовки ваших грузов. Профессиональное управление складскими запасами и логистикой."
                  : "Comprehensive warehousing services for storage, processing and preparation of your cargo. Professional warehouse inventory and logistics management."}
              </p>

              <div className="space-y-12">
            {/* Консолідація вантажів */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {consolidation.title}
              </h2>
              <p className="mb-6 text-lg text-gray-600">{consolidation.intro}</p>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {consolidation.advantages}
                </h3>
                <ul className="space-y-2">
                  {consolidation.advantagesList.map((advantage: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Зберігання вантажів */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {storage.title}
              </h2>
              <p className="mb-6 text-lg text-gray-600">{storage.intro}</p>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {storage.advantages}
                </h3>
                <ul className="space-y-2">
                  {storage.advantagesList.map((advantage: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Інспекція та перевірка */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {inspection.title}
              </h2>
              <p className="mb-6 text-lg text-gray-600">{inspection.intro}</p>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {inspection.whatWeDo}
                </h3>
                <ul className="space-y-2">
                  {inspection.services.map((service: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Пакування та перепакування */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {packaging.title}
              </h2>
              <p className="mb-6 text-lg text-gray-600">{packaging.intro}</p>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {packaging.services}
                </h3>
                <ul className="space-y-2">
                  {packaging.servicesList.map((service: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-blue-600">•</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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


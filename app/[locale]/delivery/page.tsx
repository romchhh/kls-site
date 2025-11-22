import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            {t.delivery.title}
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <a
              href={`/${locale}/delivery/air`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.air}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/sea`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.sea}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/rail`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.rail}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/multimodal`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.multimodal}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/express`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.express}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/ddp`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.ddp}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/fba`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.fba}
              </h2>
            </a>
            <a
              href={`/${locale}/delivery/lcl`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.delivery.lcl}
              </h2>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


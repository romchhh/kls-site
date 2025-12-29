import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { ContactFormFull } from "../../../components/ContactFormFull";
import { Locale, getTranslations } from "../../../lib/translations";

const contactsContent = {
  ua: {
    title: "Контакти",
    subtitle: "Зв'яжіться з нами",
    description: "Ми завжди готові допомогти вам з вашими логістичними потребами.",
    phone: "Телефон",
    email: "Email",
    address: "Адреса",
    china: "Китай",
    ukraine: "Україна",
    chinaAddress: "Room 1203, Tower A, Jin Mao Building, 88 Century Avenue, Pudong New Area, Shanghai, 200120, China",
    chinaPhone: "+86 21 5555 1234",
    chinaEmail: "info@klslogistics.cn",
    ukraineAddress: "Office 402, Business Center \"Optima Plaza\", 38 Naukova Street, Lviv, 79060, Ukraine",
    ukrainePhone: "+380 32 229 4567",
    ukraineEmail: "support@klslogistics.ua",
  },
  ru: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами",
    description: "Мы всегда готовы помочь вам с вашими логистическими потребностями.",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    china: "Китай",
    ukraine: "Украина",
    chinaAddress: "Room 1203, Tower A, Jin Mao Building, 88 Century Avenue, Pudong New Area, Shanghai, 200120, China",
    chinaPhone: "+86 21 5555 1234",
    chinaEmail: "info@klslogistics.cn",
    ukraineAddress: "Office 402, Business Center \"Optima Plaza\", 38 Naukova Street, Lviv, 79060, Ukraine",
    ukrainePhone: "+380 32 229 4567",
    ukraineEmail: "support@klslogistics.ua",
  },
  en: {
    title: "Contacts",
    subtitle: "Get in Touch",
    description: "We are always ready to help you with your logistics needs.",
    phone: "Phone",
    email: "Email",
    address: "Address",
    china: "China",
    ukraine: "Ukraine",
    chinaAddress: "Room 1203, Tower A, Jin Mao Building, 88 Century Avenue, Pudong New Area, Shanghai, 200120, China",
    chinaPhone: "+86 21 5555 1234",
    chinaEmail: "info@klslogistics.cn",
    ukraineAddress: "Office 402, Business Center \"Optima Plaza\", 38 Naukova Street, Lviv, 79060, Ukraine",
    ukrainePhone: "+380 32 229 4567",
    ukraineEmail: "support@klslogistics.ua",
  },
};

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const content = contactsContent[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
              {content.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="rounded-2xl border border-gray-200 p-8">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                {content.china}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.address}
                  </p>
                  <p className="text-gray-900">{content.chinaAddress}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.phone}
                  </p>
                  <a
                    href={`tel:${content.chinaPhone}`}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    {content.chinaPhone}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.email}
                  </p>
                  <a
                    href={`mailto:${content.chinaEmail}`}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    {content.chinaEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-8">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                {content.ukraine}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.address}
                  </p>
                  <p className="text-gray-900">{content.ukraineAddress}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.phone}
                  </p>
                  <a
                    href={`tel:${content.ukrainePhone}`}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    {content.ukrainePhone}
                  </a>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500">
                    {content.email}
                  </p>
                  <a
                    href={`mailto:${content.ukraineEmail}`}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    {content.ukraineEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactFormFull locale={locale} />
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


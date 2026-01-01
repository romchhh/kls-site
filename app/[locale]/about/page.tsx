import Image from "next/image";
import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";

const aboutContent = {
  ua: {
    title: "Про компанію",
    description:
      "KLS Logistics — це провідна логістична компанія, яка надає комплексні рішення для міжнародної доставки та логістики. Наша команда має багаторічний досвід роботи на міжнародному ринку та забезпечує надійні та ефективні логістичні рішення для бізнесу будь-якого розміру.",
  },
  ru: {
    title: "О компании",
    description:
      "KLS Logistics — это ведущая логистическая компания, предоставляющая комплексные решения для международной доставки и логистики. Наша команда имеет многолетний опыт работы на международном рынке и обеспечивает надежные и эффективные логистические решения для бизнеса любого размера.",
  },
  en: {
    title: "About Us",
    description:
      "KLS Logistics is a leading logistics company providing comprehensive solutions for international shipping and logistics. Our team has years of experience in the international market and provides reliable and efficient logistics solutions for businesses of any size.",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const content = aboutContent[locale];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            {content.title}
          </h1>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600">{content.description}</p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/hero-image-2.jpg"
                alt="About KLS"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}


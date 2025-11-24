import { HeroSection } from "../../components/HeroSection";
import { Navigation } from "../../components/Navigation";
import { DeliveryTypesSection } from "../../components/DeliveryTypesSection";
import { WhyChooseUsSection } from "../../components/WhyChooseUsSection";
import { ServicesSection } from "../../components/ServicesSection";
import { PartnersSection } from "../../components/PartnersSection";
import { CostCalculationSection } from "../../components/CostCalculationSection";
import { CTASection } from "../../components/CTASection";
import { SiteFooter } from "../../components/SiteFooter";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Locale } from "../../lib/translations";

// Дозволяємо динамічний рендеринг для правильної роботи відео
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <HeroSection locale={locale} />
      <DeliveryTypesSection locale={locale} />
      <WhyChooseUsSection locale={locale} />
      <ServicesSection locale={locale} />
      <PartnersSection locale={locale} />
      <CostCalculationSection locale={locale} />
      <CTASection locale={locale} />
      <SiteFooter locale={locale} />
      <ScrollToTop />
    </div>
  );
}

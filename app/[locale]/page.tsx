import { HeroSection } from "../../components/HeroSection";
import { Navigation } from "../../components/Navigation";
import { StatisticsSection } from "../../components/StatisticsSection";
import { WhyChooseUsSection } from "../../components/WhyChooseUsSection";
import { ServicesSection } from "../../components/ServicesSection";
import { TestimonialsSection } from "../../components/TestimonialsSection";
import { PartnersSection } from "../../components/PartnersSection";
import { CostCalculationSection } from "../../components/CostCalculationSection";
import { CTASection } from "../../components/CTASection";
import { SiteFooter } from "../../components/SiteFooter";
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
      <StatisticsSection locale={locale} />
      <WhyChooseUsSection locale={locale} />
      <ServicesSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <PartnersSection locale={locale} />
      <CostCalculationSection locale={locale} />
      <CTASection locale={locale} />
      <SiteFooter locale={locale} />
    </div>
  );
}

import { AppointmentSection } from "../components/AppointmentSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { BlogsSection } from "../components/BlogsSection";
import { HeroSection } from "../components/HeroSection";
import { Navigation } from "../components/Navigation";
import { PartnersSection } from "../components/PartnersSection";
import { ServicesSection } from "../components/ServicesSection";
import { SiteFooter } from "../components/SiteFooter";
import { TeamSection } from "../components/TeamSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import {
  benefits,
  blogs,
  navItems,
  services,
  team,
  testimonials,
} from "../lib/content";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation items={navItems} />
      <HeroSection />
      <ServicesSection services={services} />
      <BenefitsSection benefits={benefits} />
      <TeamSection team={team} />
      <PartnersSection />
      <BlogsSection blogs={blogs} />
      <TestimonialsSection testimonials={testimonials} />
      <AppointmentSection />
      <SiteFooter />
    </div>
  );
}


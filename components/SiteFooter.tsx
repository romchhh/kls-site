import Image from "next/image";
import { ArrowUpRight, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = ["Home", "About", "Services", "Blogs & News", "Events", "FAQ", "Contact"];

const offices = [
  {
    city: "Dubai",
    address: ["Dubai Silicon Oasis", "IFZA Properties, DSO-IFZA"],
  },
  {
    city: "London",
    address: ["Mayfair, City of Westminster", "Private Client Wing"],
  },
  {
    city: "Zurich",
    address: ["Paradeplatz 6", "Private Banking Centre"],
  },
];

const contactOptions = [
  {
    label: "info@thevaultpartners.com",
    href: "mailto:info@thevaultpartners.com",
    icon: Mail,
  },
  {
    label: "+971 4 555 0123",
    href: "tel:+97145550123",
    icon: Phone,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/vault-partners",
    icon: Linkedin,
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18)_0%,_rgba(2,6,23,0)_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.12)_0%,rgba(56,189,248,0)_55%),linear-gradient(320deg,rgba(129,140,248,0.2)_0%,rgba(129,140,248,0)_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1.5fr]">
          <div className="space-y-6">
            <a href="#home" className="flex items-center" aria-label="Vault Partners home">
              <Image
                src="/Vault-new-logo.png"
                alt="Vault Partners"
                width={180}
                height={56}
                className="h-12 w-auto"
                priority
              />
            </a>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Vault Partners engineers governance, finance, and advisory solutions for growth-driven
              firms and family offices across EMEA. Precision, discretion, and pace in every mandate.
            </p>
            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-500 hover:scale-105 hover:border-white/35">
              <span className="relative z-10">Arrange a briefing</span>
              <ArrowUpRight
                size={16}
                className="relative z-10 transition-transform duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-white/25 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
            </button>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">Navigation</h4>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/75">
              {quickLinks.map((item) => {
                const hash = item.toLowerCase().replace(/\s+/g, "-");
                return (
                  <a
                    key={item}
                    href={`#${hash}`}
                    className="transition-colors duration-300 hover:text-white"
                  >
                    {item}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">Offices</h4>
            <div className="space-y-6 text-sm text-white/75">
              {offices.map((office) => (
                <div key={office.city}>
                  <p className="mb-1 flex items-center gap-2 text-white">
                    <MapPin size={14} /> {office.city}
                  </p>
                  {office.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="space-y-3 text-sm text-white/80">
              {contactOptions.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-2 transition-colors duration-300 hover:text-white"
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <contact.icon size={16} />
                  {contact.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Vault Partners. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Developed by
            <a
              href="https://telebots.site/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white/80 transition-colors duration-300 hover:text-white"
            >
              TeleBots
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


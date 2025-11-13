import Image from "next/image";

const partners = [
  {
    name: "Andersen",
    logo: "https://dummyimage.com/200x80/f8fafc/0f172a&text=Andersen",
  },
  {
    name: "MG Law",
    logo: "https://dummyimage.com/200x80/f1f5f9/020617&text=MG+Law",
  },
  {
    name: "Centro Law",
    logo: "https://dummyimage.com/200x80/f7fee7/111827&text=Centro+Law",
  },
  {
    name: "Lexminster",
    logo: "https://dummyimage.com/200x80/fff7ed/0f172a&text=Lexminster",
  },
  {
    name: "Spectrum EHCS",
    logo: "https://dummyimage.com/200x80/f5f3ff/020617&text=Spectrum+EHCS",
  },
];

const marqueePartners = [...partners, ...partners];

export function PartnersSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">Our Partners</h2>
        </div>

        <div className="relative mx-auto max-w-6xl overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 via-gray-50/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 via-gray-50/95 to-transparent" />
          <div className="flex min-w-full animate-[partners-marquee_26s_linear_infinite] gap-12">
            {marqueePartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="group relative flex w-60 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-white/40 px-8 py-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.55)] backdrop-blur-md transition-transform duration-700 hover:scale-[1.04]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45)_0%,_rgba(255,255,255,0)_55%)]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20" />
                </div>
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={200}
                  height={80}
                  className="h-12 w-auto object-contain opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


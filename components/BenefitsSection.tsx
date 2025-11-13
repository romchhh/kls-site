import type { Benefit } from "../types/content";

type BenefitsSectionProps = {
  benefits: Benefit[];
};

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  return (
    <section className="bg-gray-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-4 text-center">
          <p className="mb-8 text-sm font-semibold text-gray-400">END BENEFITS</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <h3 className="mb-4 text-3xl font-bold">{benefit.title}.</h3>
              <p className="text-lg text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


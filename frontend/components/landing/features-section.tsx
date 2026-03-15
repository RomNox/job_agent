"use client";

import { useI18n } from "@/components/i18n/locale-provider";

export function FeaturesSection() {
  const { messages, t } = useI18n();

  return (
    <section id="features" className="border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("landing.features.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
            {t("landing.features.title")}
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {t("landing.features.description")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {messages.landing.features.items.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

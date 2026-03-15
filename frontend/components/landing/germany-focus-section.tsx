"use client";

import { useI18n } from "@/components/i18n/locale-provider";

export function GermanyFocusSection() {
  const { messages, t } = useI18n();

  return (
    <section id="germany" className="border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-18">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("landing.germany.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
            {t("landing.germany.title")}
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {t("landing.germany.description")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {messages.landing.germany.items.map((area) => (
            <div
              key={area.title}
              className="rounded-[1.6rem] border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                {area.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useI18n } from "@/components/i18n/locale-provider";

export function HowItWorksSection() {
  const { messages, t } = useI18n();

  return (
    <section id="how-it-works" className="border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:px-8 lg:py-18">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("landing.howItWorks.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {t("landing.howItWorks.description")}
          </p>
        </div>

        <div className="space-y-3">
          {messages.landing.howItWorks.steps.map((step, index) => (
            <div
              key={step.title}
              className="grid gap-4 rounded-[1.6rem] border border-slate-200 bg-white p-5 md:grid-cols-[44px_minmax(0,1fr)]"
            >
              <div className="text-sm font-semibold text-slate-400">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

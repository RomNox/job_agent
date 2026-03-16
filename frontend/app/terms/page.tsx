"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { useI18n } from "@/components/i18n/locale-provider";

export default function TermsPage() {
  const { messages, t } = useI18n();

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <LandingHeader />
      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t("legal.terms.eyebrow")}
              </p>
              <h1 className="text-[2.45rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[3rem]">
                {t("legal.terms.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-[1.02rem]">
                {t("legal.terms.description")}
              </p>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50/85 px-6 py-5 text-sm leading-7 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              {t("legal.terms.notice")}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="space-y-4">
            {messages.legal.terms.sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

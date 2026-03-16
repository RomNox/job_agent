"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { messages, t } = useI18n();
  const { status } = useAuth();
  const primaryCtaHref = status === "authenticated" ? "/workspace" : "/signup";
  const primaryCtaLabel =
    status === "authenticated"
      ? t("common.actions.openJobAgent")
      : t("common.actions.signUp");

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto grid min-h-[calc(100svh-4.75rem)] max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(300px,30rem)] lg:items-center lg:px-8 lg:py-20 xl:grid-cols-[minmax(0,1fr)_32rem] xl:gap-14">
        <div className="max-w-[44rem] space-y-6 sm:space-y-7">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs font-semibold uppercase leading-7 tracking-[0.22em] text-slate-500 sm:leading-8">
              {t("landing.hero.eyebrow")}
            </p>
            <div className="space-y-3">
              <h1 className="max-w-[12ch] text-[2.95rem] font-semibold leading-[1.06] tracking-tight text-slate-950 sm:text-[3.35rem] lg:text-[3.7rem] xl:text-[3.9rem]">
                {t("landing.hero.title")}
              </h1>
              <p className="max-w-2xl text-[15px] leading-[2.15rem] text-slate-600 sm:text-[1.02rem]">
                {t("landing.hero.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={primaryCtaHref} className={cn(buttonVariants({ size: "lg" }))}>
              {primaryCtaLabel}
            </Link>
            <Link
              href="/#pricing"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              {t("pricing.page.planCta")}
            </Link>
          </div>

          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            {t("landing.hero.termsPrefix")}{" "}
            <Link
              href="/terms"
              className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-950 hover:decoration-slate-950"
            >
              {t("legal.terms.linkLabel")}
            </Link>
            .
          </p>
        </div>

        <div className="max-w-[32rem] justify-self-start rounded-[2rem] border border-slate-200 bg-slate-50/80 p-3.5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:justify-self-end">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t("landing.hero.previewEyebrow")}
              </p>
              <h2 className="mt-2 max-w-[16rem] text-lg font-semibold tracking-tight text-slate-950 sm:text-[1.2rem]">
                {t("landing.hero.previewTitle")}
              </h2>
            </div>
            <div className="grid gap-2.5 p-3">
              {messages.landing.hero.previewPanels.map((panel) => (
                <div
                  key={panel.title}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.03)]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {panel.label}
                  </p>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-950 sm:text-[15px]">
                        {panel.title}
                      </p>
                      <p className="text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
                        {panel.detail}
                      </p>
                    </div>
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

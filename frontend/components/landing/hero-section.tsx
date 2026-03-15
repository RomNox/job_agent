"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { messages, t } = useI18n();

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(300px,28rem)] lg:items-center lg:px-8 lg:py-20 xl:grid-cols-[minmax(0,1fr)_31rem] xl:gap-14">
        <div className="max-w-[44rem] space-y-6 sm:space-y-7">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {t("landing.hero.eyebrow")}
            </p>
            <div className="space-y-3">
              <h1 className="max-w-[13ch] text-[2.95rem] font-semibold leading-[0.96] tracking-tight text-slate-950 sm:text-[3.35rem] lg:text-[3.7rem] xl:text-[3.9rem]">
                {t("landing.hero.title")}
              </h1>
              <p className="max-w-lg text-[15px] leading-7 text-slate-600 sm:text-[1.02rem]">
                {t("landing.hero.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
              {t("common.actions.signUp")}
            </Link>
            <Link
              href="/search"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              {t("common.actions.openJobSearch")}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 text-sm text-slate-500">
            <span>{t("landing.hero.supporting")}</span>
            <Link
              href="/workspace"
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900"
            >
              {t("landing.hero.openWorkspace")}
            </Link>
          </div>
        </div>

        <div className="max-w-[31rem] justify-self-start rounded-[2rem] border border-slate-200 bg-slate-50 p-3.5 lg:justify-self-end">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t("landing.hero.previewEyebrow")}
              </p>
              <h2 className="mt-2 max-w-[16rem] text-lg font-semibold tracking-tight text-slate-950 sm:text-[1.2rem]">
                {t("landing.hero.previewTitle")}
              </h2>
            </div>
            <div className="grid gap-2 p-3">
              {messages.landing.hero.previewPanels.map((panel) => (
                <div
                  key={panel.title}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3"
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

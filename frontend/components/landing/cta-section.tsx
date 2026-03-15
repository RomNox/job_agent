"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { t } = useI18n();

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {t("landing.cta.eyebrow")}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-[2.2rem]">
                {t("landing.cta.title")}
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                {t("landing.cta.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-slate-950 hover:bg-slate-200",
                )}
              >
                {t("common.actions.signUp")}
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "border-slate-700 bg-transparent text-white hover:bg-slate-900",
                )}
              >
                {t("common.actions.logIn")}
              </Link>
              <Link
                href="/search"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "text-white hover:bg-slate-900",
                )}
              >
                {t("common.actions.openSearch")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

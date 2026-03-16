"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { t } = useI18n();
  const { status } = useAuth();
  const primaryHref = status === "authenticated" ? "/workspace" : "/signup";
  const primaryLabel =
    status === "authenticated"
      ? t("common.actions.openJobAgent")
      : t("common.actions.signUp");

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
                href={primaryHref}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-slate-950 hover:bg-slate-200",
                )}
              >
                {primaryLabel}
              </Link>
              <Link
                href="/#pricing"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "border-slate-700 bg-transparent text-white hover:bg-slate-900",
                )}
              >
                {t("pricing.page.planCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

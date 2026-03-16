"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Messages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BillingPeriodKey = keyof Messages["pricing"]["page"]["plans"][number]["prices"];
type PricingPlan = Messages["pricing"]["page"]["plans"][number];

export function PricingSection() {
  const { messages, t } = useI18n();
  const { status } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriodKey>("sixMonths");
  const selectedPeriodLabel =
    messages.pricing.page.periods.find((period) => period.key === selectedPeriod)?.label ??
    "";
  const ctaHref = status === "authenticated" ? "/workspace" : "/signup";
  const ctaLabel =
    status === "authenticated"
      ? t("common.actions.openJobAgent")
      : t("pricing.page.planCta");

  return (
    <section id="pricing" className="border-b border-slate-200 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("pricing.page.eyebrow")}
          </p>
          <h2 className="text-[2.35rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[2.8rem]">
            {t("pricing.page.title")}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-[1.02rem]">
            {t("pricing.page.description")}
          </p>
        </div>

        <div className="mt-8 inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          {messages.pricing.page.periods.map((period) => {
            const isActive = period.key === selectedPeriod;

            return (
              <button
                key={period.key}
                type="button"
                onClick={() => setSelectedPeriod(period.key)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5",
                  isActive
                    ? "bg-white text-slate-950 shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                    : "text-slate-500 hover:text-slate-950",
                )}
              >
                {period.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {messages.pricing.page.plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              selectedPeriod={selectedPeriod}
              selectedPeriodLabel={selectedPeriodLabel}
              ctaHref={ctaHref}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 px-6 py-5 text-sm leading-7 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          {t("pricing.page.creditsNote")}
        </div>
      </div>
    </section>
  );
}

type PricingCardProps = {
  plan: PricingPlan;
  selectedPeriod: BillingPeriodKey;
  selectedPeriodLabel: string;
  ctaHref: string;
  ctaLabel: string;
};

function PricingCard({
  plan,
  selectedPeriod,
  selectedPeriodLabel,
  ctaHref,
  ctaLabel,
}: PricingCardProps) {
  const { t } = useI18n();
  const isRecommended = plan.recommended;

  return (
    <Card
      className={cn(
        "flex h-full flex-col rounded-[2rem] border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]",
        isRecommended && "border-slate-300 shadow-[0_22px_50px_rgba(15,23,42,0.08)]",
      )}
    >
      <CardHeader className="gap-3 pb-5">
        <div className="flex min-h-7 flex-wrap items-center gap-2">
          {isRecommended ? (
            <>
              <span className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                {t("pricing.page.recommended")}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("pricing.page.mostPopular")}
              </span>
            </>
          ) : null}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-3xl font-semibold tracking-tight text-slate-950">
            {plan.prices[selectedPeriod]}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {t("pricing.page.priceCaption", { period: selectedPeriodLabel })}
          </p>
          <p className="mt-4 text-sm font-medium text-slate-700">{plan.analysisLimit}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({
              variant: isRecommended ? "default" : "secondary",
              size: "lg",
            }),
            "mt-auto w-full",
          )}
        >
          {ctaLabel}
        </Link>
      </CardContent>
    </Card>
  );
}

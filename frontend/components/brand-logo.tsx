"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  className?: string;
};

export function BrandLogo({
  href = "/",
  className,
}: BrandLogoProps) {
  const { t } = useI18n();

  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-300 text-sm font-semibold text-slate-950">
        JA
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold tracking-tight text-slate-950">
          {t("common.brandName")}
        </p>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
          {t("common.marketLabel")}
        </p>
      </div>
    </Link>
  );
}

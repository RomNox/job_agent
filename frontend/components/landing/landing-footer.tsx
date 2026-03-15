"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/locale-provider";

export function LandingFooter() {
  const { t } = useI18n();
  const footerLinks = [
    { href: "/search", label: t("common.navigation.search") },
    { href: "/workspace", label: t("common.navigation.workspace") },
    { href: "/login", label: t("common.actions.logIn") },
    { href: "/signup", label: t("common.actions.signUp") },
    { href: "#features", label: t("common.navigation.product") },
    { href: "#how-it-works", label: t("common.navigation.workflow") },
    { href: "#germany", label: t("common.navigation.germany") },
  ];

  return (
    <footer className="bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-lg font-semibold tracking-tight text-slate-950">
            {t("common.brandName")}
          </p>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            {t("landing.footer.description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

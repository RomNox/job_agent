"use client";

import Link from "next/link";
import { useTransition } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const { authErrorMessage, logout, status, user } = useAuth();
  const { t } = useI18n();
  const [isLoggingOut, startTransition] = useTransition();
  const navigationItems = [
    { href: "#how-it-works", label: t("common.navigation.howItWorks") },
    { href: "#features", label: t("common.navigation.features") },
    { href: "#germany", label: t("common.navigation.germany") },
  ];

  function handleLogout() {
    startTransition(() => {
      void logout().catch(() => {
        // Keep the header stable even if logout fails remotely.
      });
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-300 text-sm font-semibold text-slate-950">
            JA
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold tracking-tight text-slate-950">
              {t("common.brandName")}
            </p>
            <p className="hidden text-xs uppercase tracking-[0.16em] text-slate-500 sm:block">
              {t("common.marketLabel")}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LanguageSwitcher />
          {status === "authenticated" && user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 md:inline-flex"
              >
                {t("common.navigation.profile")}
              </Link>
              <span className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 xl:inline-flex">
                {user.full_name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                {isLoggingOut ? t("common.states.loggingOut") : t("common.actions.logOut")}
              </button>
            </>
          ) : status === "loading" ? (
            <span className="hidden text-sm text-slate-500 sm:inline-flex">
              {t("common.states.checkingSession")}
            </span>
          ) : status === "error" ? (
            <>
              <span className="hidden text-sm text-slate-500 xl:inline-flex">
                {authErrorMessage ?? t("landing.header.authUnavailable")}
              </span>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                {t("common.actions.logIn")}
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {t("common.actions.signUp")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                {t("common.actions.logIn")}
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {t("common.actions.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

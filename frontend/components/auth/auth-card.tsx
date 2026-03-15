 "use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-[2rem] border-slate-200 bg-white shadow-panel">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {t("auth.backToHome")}
            </Link>
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">{children}</CardContent>
      </Card>
    </main>
  );
}

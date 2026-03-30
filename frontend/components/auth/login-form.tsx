"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-provider";
import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, getOnboardingState } from "@/lib/api";
import { getOptionalSafeNextPath } from "@/lib/auth";
import { getPostLoginDestination } from "@/lib/onboarding";
import { createLoginFormSchema } from "@/lib/schemas";
import type { LoginFormValues } from "@/types/api";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/workspace" }: LoginFormProps) {
  const router = useRouter();
  const { login, status } = useAuth();
  const { t } = useI18n();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const safeNextPath = getOptionalSafeNextPath(nextPath);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(
      createLoginFormSchema((key) => t(`validation.${key}`)),
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status !== "authenticated") {
      setIsRedirecting(false);
      return;
    }

    let isActive = true;
    setIsRedirecting(true);

    void (async () => {
      try {
        const onboardingState = await getOnboardingState();
        if (!isActive) {
          return;
        }

        router.replace(getPostLoginDestination(onboardingState, safeNextPath));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setIsRedirecting(false);
        setErrorMessage(
          getApiErrorMessage(error, {
            fallback: t("auth.errors.determineDestination"),
            network: t("auth.errors.backendUnavailable"),
          }),
        );
      }
    })();

    return () => {
      isActive = false;
    };
  }, [router, safeNextPath, status, t]);

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      await login(values);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("auth.errors.loginGeneric"),
          network: t("auth.errors.backendUnavailable"),
          unauthorized: t("auth.errors.invalidCredentials"),
        }),
      );
    }
  });

  const signupHref = safeNextPath
    ? `/signup?next=${encodeURIComponent(safeNextPath)}`
    : "/signup";

  return (
    <AuthCard
      title={t("auth.login.title")}
      description={t("auth.login.description")}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="login-email">{t("common.fields.email")}</Label>
          <Input
            id="login-email"
            type="email"
            placeholder={t("common.placeholders.email")}
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-700">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">{t("auth.login.passwordLabel")}</Label>
          <Input
            id="login-password"
            type="password"
            placeholder={t("common.placeholders.password")}
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-red-700">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || isRedirecting}
        >
          {form.formState.isSubmitting
            ? t("auth.login.submitting")
            : isRedirecting
              ? t("auth.login.continuing")
              : t("auth.login.submit")}
        </Button>

        <p className="text-xs leading-5 text-slate-500">
          {t("auth.login.helper")}
        </p>
      </form>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link href={signupHref} className="hover:text-slate-950">
          {t("auth.login.needAccount")}
        </Link>
        <Link href="/search" className="hover:text-slate-950">
          {t("auth.login.openSearch")}
        </Link>
      </div>
    </AuthCard>
  );
}

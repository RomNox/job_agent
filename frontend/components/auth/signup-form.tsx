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
import { createSignupFormSchema } from "@/lib/schemas";
import type { SignupFormValues } from "@/types/api";

type SignupFormProps = {
  nextPath?: string;
};

export function SignupForm({ nextPath = "/search" }: SignupFormProps) {
  const router = useRouter();
  const { register, status } = useAuth();
  const { t } = useI18n();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const safeNextPath = getOptionalSafeNextPath(nextPath);
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(
      createSignupFormSchema((key) => t(`validation.${key}`)),
    ),
    defaultValues: {
      full_name: "",
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
      await register(values);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("auth.errors.signupGeneric"),
          network: t("auth.errors.backendUnavailable"),
          conflict: t("auth.errors.duplicateEmail"),
        }),
      );
    }
  });

  const loginHref = safeNextPath
    ? `/login?next=${encodeURIComponent(safeNextPath)}`
    : "/login";

  return (
    <AuthCard
      title={t("auth.signup.title")}
      description={t("auth.signup.description")}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="signup-full-name">{t("common.fields.fullName")}</Label>
          <Input
            id="signup-full-name"
            type="text"
            placeholder={t("common.placeholders.fullName")}
            autoComplete="name"
            {...form.register("full_name")}
          />
          {form.formState.errors.full_name ? (
            <p className="text-sm text-red-700">
              {form.formState.errors.full_name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">{t("common.fields.email")}</Label>
          <Input
            id="signup-email"
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
          <Label htmlFor="signup-password">{t("auth.signup.passwordLabel")}</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder={t("common.placeholders.newPassword")}
            autoComplete="new-password"
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
            ? t("auth.signup.submitting")
            : isRedirecting
              ? t("auth.signup.continuing")
              : t("auth.signup.submit")}
        </Button>

        <p className="text-xs leading-5 text-slate-500">
          {t("auth.signup.helper")}
        </p>
      </form>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link href={loginHref} className="hover:text-slate-950">
          {t("auth.signup.haveAccount")}
        </Link>
        <Link href="/search" className="hover:text-slate-950">
          {t("auth.signup.openSearch")}
        </Link>
      </div>
    </AuthCard>
  );
}

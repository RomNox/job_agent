"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/i18n/locale-provider";
import { getOnboardingState } from "@/lib/api";
import {
  getAuthErrorMessage,
  getSafeNextPath,
  isUnauthorizedError,
} from "@/lib/auth";
import { buildSetupFlowPath } from "@/lib/onboarding";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

type AuthGuardProps = {
  children: ReactNode;
  requireCompletedOnboarding?: boolean;
  nextPath?: string;
};

type OnboardingCheckStatus = "idle" | "loading" | "ready" | "redirecting" | "error";

export function AuthGuard({
  children,
  requireCompletedOnboarding = false,
  nextPath,
}: AuthGuardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { authErrorMessage, refreshUser, status } = useAuth();
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingCheckStatus>("idle");
  const [onboardingErrorMessage, setOnboardingErrorMessage] = useState<string | null>(
    null,
  );
  const [onboardingRetryNonce, setOnboardingRetryNonce] = useState(0);
  const safeNextPath = getSafeNextPath(nextPath);

  useEffect(() => {
    if (status !== "unauthenticated") {
      return;
    }

    router.replace(`/login?next=${encodeURIComponent(safeNextPath)}`);
  }, [router, safeNextPath, status]);

  useEffect(() => {
    if (!requireCompletedOnboarding) {
      setOnboardingStatus("ready");
      setOnboardingErrorMessage(null);
      return;
    }

    if (status !== "authenticated") {
      setOnboardingStatus("idle");
      setOnboardingErrorMessage(null);
      return;
    }

    let isActive = true;
    setOnboardingStatus("loading");
    setOnboardingErrorMessage(null);

    void (async () => {
      try {
        const onboardingState = await getOnboardingState();
        if (!isActive) {
          return;
        }

        if (onboardingState.completed) {
          setOnboardingStatus("ready");
          return;
        }

        setOnboardingStatus("redirecting");
        router.replace(buildSetupFlowPath(safeNextPath));
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (isUnauthorizedError(error)) {
          await refreshUser();
          return;
        }

        setOnboardingStatus("error");
        setOnboardingErrorMessage(
          getAuthErrorMessage(error, t("guard.onboardingUnavailableDescription")),
        );
      }
    })();

    return () => {
      isActive = false;
    };
  }, [
    safeNextPath,
    onboardingRetryNonce,
    refreshUser,
    requireCompletedOnboarding,
    router,
    status,
    t,
  ]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-center shadow-panel">
          <p className="text-sm font-medium text-slate-700">{t("common.states.checkingSession")}</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-panel">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-slate-950">
              {t("guard.sessionUnavailableTitle")}
            </p>
            <p className="text-sm leading-6 text-slate-600">
              {authErrorMessage ?? t("guard.sessionUnavailableDescription")}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => void refreshUser()}>
              {t("common.actions.retry")}
            </Button>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              {t("guard.openLogin")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-center shadow-panel">
          <p className="text-sm font-medium text-slate-700">{t("common.states.redirectingToLogin")}</p>
        </div>
      </main>
    );
  }

  if (requireCompletedOnboarding) {
    if (
      onboardingStatus === "idle" ||
      onboardingStatus === "loading" ||
      onboardingStatus === "redirecting"
    ) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-center shadow-panel">
            <p className="text-sm font-medium text-slate-700">
              {t("common.states.checkingOnboarding")}
            </p>
          </div>
        </main>
      );
    }

    if (onboardingStatus === "error") {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-panel">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-slate-950">
                {t("guard.onboardingUnavailableTitle")}
              </p>
              <p className="text-sm leading-6 text-slate-600">
                {onboardingErrorMessage ??
                  t("guard.onboardingUnavailableDescription")}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => setOnboardingRetryNonce((value) => value + 1)}
              >
                {t("common.actions.retry")}
              </Button>
              <Link
                href={buildSetupFlowPath(safeNextPath)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                {t("guard.openSetupFlow")}
              </Link>
            </div>
          </div>
        </main>
      );
    }
  }

  return <>{children}</>;
}

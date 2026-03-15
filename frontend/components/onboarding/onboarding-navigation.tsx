"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";

type OnboardingNavigationProps = {
  canGoBack: boolean;
  isBusy: boolean;
  nextLabel: string;
  helperText: string;
  onBack: () => void;
  onNext: () => void;
};

export function OnboardingNavigation({
  canGoBack,
  isBusy,
  nextLabel,
  helperText,
  onBack,
  onNext,
}: OnboardingNavigationProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4 border-t border-slate-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={!canGoBack || isBusy}
        >
          {t("common.actions.back")}
        </Button>
        <Button type="button" onClick={onNext} disabled={isBusy}>
          {isBusy ? t("common.states.saving") : nextLabel}
        </Button>
      </div>
      <p className="text-sm leading-6 text-slate-500">{helperText}</p>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/i18n/locale-provider";

type IntroductionStageProps = {
  isActive: boolean;
  userName?: string | null;
};

export function IntroductionStage({
  isActive,
  userName,
}: IntroductionStageProps) {
  const { messages, t } = useI18n();
  const introText = useMemo(() => t("onboarding.intro.text"), [t]);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    setVisibleLength(0);
    const intervalId = window.setInterval(() => {
      setVisibleLength((currentLength) => {
        if (currentLength >= introText.length) {
          window.clearInterval(intervalId);
          return currentLength;
        }

        return currentLength + 2;
      });
    }, 18);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [introText, isActive]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
          {t("onboarding.intro.chip")}
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {t("onboarding.intro.greeting")}
            {userName ? `, ${userName.split(" ")[0]}` : ""}.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            {introText.slice(0, visibleLength)}
            {visibleLength < introText.length ? (
              <span className="ml-0.5 inline-block h-5 w-px animate-pulse bg-slate-900 align-middle" />
            ) : null}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {messages.onboarding.intro.cards.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5"
          >
            <p className="text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

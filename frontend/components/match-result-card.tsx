"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { SectionCard } from "@/components/section-card";
import type { ApplicationPackageResponse } from "@/types/api";

type MatchResultCardProps = {
  matchResult: ApplicationPackageResponse["match_result"];
};

function BulletList({ items }: { items: string[] }) {
  const { t } = useI18n();

  if (!items.length) {
    return <p className="text-sm text-slate-500">{t("common.states.noneHighlighted")}</p>;
  }

  return (
    <ul className="space-y-2 pl-5 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function MatchResultCard({ matchResult }: MatchResultCardProps) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("workspace.cards.matchResult.title")}
      description={t("workspace.cards.matchResult.description")}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {t("workspace.cards.matchResult.badge")}
          </div>
          <div className="text-3xl font-semibold text-slate-950">
            {Math.round(matchResult.match_score)}%
          </div>
        </div>
        <p className="text-sm leading-7 text-slate-700">{matchResult.summary}</p>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.matchResult.strengths")}
            </h4>
            <BulletList items={matchResult.strengths} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.matchResult.gaps")}
            </h4>
            <BulletList items={matchResult.gaps} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.matchResult.nextSteps")}
            </h4>
            <BulletList items={matchResult.recommended_next_steps} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

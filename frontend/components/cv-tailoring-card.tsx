"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { SectionCard } from "@/components/section-card";
import type { ApplicationPackageResponse } from "@/types/api";

type CVTailoringCardProps = {
  cvTailoring: ApplicationPackageResponse["cv_tailoring"];
};

function BulletList({ items }: { items: string[] }) {
  const { t } = useI18n();

  if (!items.length) {
    return <p className="text-sm text-slate-500">{t("common.states.none")}</p>;
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

export function CVTailoringCard({ cvTailoring }: CVTailoringCardProps) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("workspace.cards.cvTailoring.title")}
      description={t("workspace.cards.cvTailoring.description")}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-sm font-semibold text-slate-900">
            {t("workspace.cards.cvTailoring.summary")}
          </h4>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {cvTailoring.tailored_summary}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.cvTailoring.highlightedSkills")}
            </h4>
            <BulletList items={cvTailoring.highlighted_skills} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.cvTailoring.experiencePoints")}
            </h4>
            <BulletList items={cvTailoring.suggested_experience_points} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              {t("workspace.cards.cvTailoring.warnings")}
            </h4>
            <BulletList items={cvTailoring.warnings} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

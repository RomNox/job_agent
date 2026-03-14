import { SectionCard } from "@/components/section-card";
import type { ApplicationPackageResponse } from "@/types/api";

type CVTailoringCardProps = {
  cvTailoring: ApplicationPackageResponse["cv_tailoring"];
};

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">None.</p>;
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
  return (
    <SectionCard
      title="CV Tailoring"
      description="Role-specific summary and highlights to adapt the CV before submission."
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-sm font-semibold text-slate-900">Tailored summary</h4>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {cvTailoring.tailored_summary}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Highlighted skills</h4>
            <BulletList items={cvTailoring.highlighted_skills} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">
              Suggested experience points
            </h4>
            <BulletList items={cvTailoring.suggested_experience_points} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Warnings</h4>
            <BulletList items={cvTailoring.warnings} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

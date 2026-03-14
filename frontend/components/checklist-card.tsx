import { SectionCard } from "@/components/section-card";

type ChecklistCardProps = {
  checklist: string[];
  warnings: string[];
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

export function ChecklistCard({ checklist, warnings }: ChecklistCardProps) {
  return (
    <SectionCard
      title="Checklist / Warnings"
      description="Final action items and risks before the application is sent."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900">Checklist</h4>
          <BulletList items={checklist} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900">Warnings</h4>
          <BulletList items={warnings} />
        </div>
      </div>
    </SectionCard>
  );
}

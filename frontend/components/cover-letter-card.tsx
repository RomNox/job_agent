import { SectionCard } from "@/components/section-card";
import type { ApplicationPackageResponse } from "@/types/api";

type CoverLetterCardProps = {
  coverLetter: ApplicationPackageResponse["cover_letter"];
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

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  return (
    <SectionCard
      title="Cover Letter"
      description="Drafted Anschreiben content with the key signals used to build it."
    >
      <div className="space-y-5">
        <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 font-sans text-sm leading-7 text-slate-800 whitespace-pre-wrap">
          {coverLetter.cover_letter}
        </pre>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Key points used</h4>
            <BulletList items={coverLetter.key_points_used} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Warnings</h4>
            <BulletList items={coverLetter.warnings} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

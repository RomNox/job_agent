import { ResultCard } from "@/components/search/result-card";
import type { JobSearchResult } from "@/types/api";

type ResultListProps = {
  results: JobSearchResult[];
};

export function ResultList({ results }: ResultListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}

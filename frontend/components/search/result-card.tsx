"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getApiErrorMessage, resolveSearchJob } from "@/lib/api";
import { storeResolvedJobContent } from "@/lib/resolved-job-handoff";
import { cn } from "@/lib/utils";
import type { JobSearchResult, SearchSelectedJobPayload } from "@/types/api";

type ResultCardProps = {
  result: JobSearchResult;
};

export function ResultCard({ result }: ResultCardProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [isResolving, setIsResolving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const companyAndLocation = [result.company, result.location]
    .filter(Boolean)
    .join(" • ");

  async function handleAnalyze() {
    setIsResolving(true);
    setErrorMessage(null);

    try {
      const resolvedContent = await resolveSearchJob(toSelectedJobPayload(result));
      const handoffKey = storeResolvedJobContent(resolvedContent);
      router.push(`/workspace?resolved_job_key=${encodeURIComponent(handoffKey)}`);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("search.resultCard.resolveError"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <Card className="rounded-2xl border-slate-200 shadow-none">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                {t("search.resultCard.sourceBadge")}
              </span>
              {result.employment_type ? (
                <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600">
                  {result.employment_type}
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {result.title}
              </h2>
              <p className="text-sm text-slate-600">
                {companyAndLocation || t("search.resultCard.companyLocationFallback")}
              </p>
            </div>
          </div>

          {(result.salary || result.posted_at) ? (
            <div className="space-y-1 text-sm text-slate-500 sm:text-right">
              {result.salary ? <p>{result.salary}</p> : null}
              {result.posted_at ? <p>{result.posted_at}</p> : null}
            </div>
          ) : null}
        </div>

        {result.snippet ? (
          <p className="text-sm leading-7 text-slate-700">{result.snippet}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            size="sm"
            onClick={handleAnalyze}
            disabled={isResolving}
          >
            {isResolving
              ? t("search.resultCard.resolving")
              : t("search.resultCard.analyze")}
          </Button>
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            {t("search.resultCard.openOriginal")}
          </a>
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-700">{errorMessage}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function toSelectedJobPayload(result: JobSearchResult): SearchSelectedJobPayload {
  return {
    id: result.id,
    source: result.source,
    external_id: result.external_id,
    title: result.title,
    company: result.company,
    location: result.location,
    salary: result.salary,
    employment_type: result.employment_type,
    posted_at: result.posted_at,
    url: result.url,
    snippet: result.snippet,
  };
}

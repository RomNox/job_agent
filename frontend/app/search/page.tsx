"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/i18n/locale-provider";
import { ResultList } from "@/components/search/result-list";
import { SearchBar } from "@/components/search/search-bar";
import { getApiErrorMessage, searchJobs } from "@/lib/api";
import type { JobSearchResponse } from "@/types/api";

export default function SearchPage() {
  const { t } = useI18n();
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<JobSearchResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedKeywords = keywords.trim();
    const trimmedLocation = location.trim();
    if (!trimmedKeywords) {
      setErrorMessage(t("search.form.keywordsRequired"));
      setResults(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await searchJobs({
        keywords: trimmedKeywords,
        location: trimmedLocation || undefined,
      });
      setResults(response);
    } catch (error) {
      setResults(null);
      setErrorMessage(
        getApiErrorMessage(error, {
          fallback: t("search.form.searchError"),
          network: t("auth.errors.backendUnavailable"),
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const localizedSource =
    results?.source === "jooble"
      ? t("search.resultCard.sourceBadge")
      : results?.source;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-5 border-b border-slate-200 pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {t("search.page.eyebrow")}
              </p>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                  {t("search.page.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                  {t("search.page.description")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/workspace"
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
              >
                {t("search.page.openWorkspace")}
              </Link>
            </div>
          </div>

          <SearchBar
            keywords={keywords}
            location={location}
            isSubmitting={isSubmitting}
            onKeywordsChange={setKeywords}
            onLocationChange={setLocation}
            onSubmit={handleSubmit}
          />

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {t("search.page.resultsTitle")}
              </h2>
              <p className="text-sm text-slate-500">
                {results
                  ? t("search.page.activeSummary", {
                      count: String(results.count),
                      source: localizedSource ?? results.source,
                    })
                  : t("search.page.initialSummary")}
              </p>
            </div>
          </div>

          {results ? (
            results.results.length ? (
              <ResultList results={results.results} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-sm text-slate-500">
                {t("search.page.noMatches")}
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-sm text-slate-500">
              {t("search.page.emptyState")}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

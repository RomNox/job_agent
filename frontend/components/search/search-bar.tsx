"use client";

import type { FormEvent } from "react";

import { useI18n } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  keywords: string;
  location: string;
  isSubmitting: boolean;
  onKeywordsChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SearchBar({
  keywords,
  location,
  isSubmitting,
  onKeywordsChange,
  onLocationChange,
  onSubmit,
}: SearchBarProps) {
  const { t } = useI18n();

  return (
    <form
      className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,1fr)_auto]"
      onSubmit={onSubmit}
    >
      <Input
        value={keywords}
        onChange={(event) => onKeywordsChange(event.target.value)}
        placeholder={t("search.form.keywordsPlaceholder")}
        aria-label={t("search.form.keywordsLabel")}
      />
      <Input
        value={location}
        onChange={(event) => onLocationChange(event.target.value)}
        placeholder={t("search.form.locationPlaceholder")}
        aria-label={t("search.form.locationLabel")}
      />
      <Button type="submit" disabled={isSubmitting} className="md:min-w-[140px]">
        {isSubmitting ? t("search.form.submitting") : t("search.form.submit")}
      </Button>
    </form>
  );
}

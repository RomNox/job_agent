"use client";

import { useI18n } from "@/components/i18n/locale-provider";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, messages, setLocale } = useI18n();

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <label htmlFor="language-switcher" className="sr-only">
        {messages.common.languageSwitcher.label}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="h-9 min-w-[4.5rem] cursor-pointer appearance-none rounded-full border border-slate-300 bg-white px-3 pr-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,0.05)] outline-none transition-[border-color,box-shadow,background-color] hover:border-slate-400 hover:bg-slate-50 focus:border-slate-950 focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]"
        aria-label={messages.common.languageSwitcher.ariaLabel}
      >
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {messages.common.localeLabels[supportedLocale]}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-slate-400"
      >
        ▾
      </span>
    </div>
  );
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getMessages, translate, type Messages, type TranslationValues } from "@/lib/i18n";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "@/lib/locale";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (path: string, values?: TranslationValues) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const storedLocale = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
    document.documentElement.lang = storedLocale;
    setLocaleState((currentLocale) =>
      storedLocale !== currentLocale ? storedLocale : currentLocale,
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const messages = useMemo(() => getMessages(locale), [locale]);
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      messages,
      setLocale: setLocaleState,
      t: (path, values) => translate(messages, path, values),
    }),
    [locale, messages],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useI18n must be used inside LocaleProvider.");
  }

  return context;
}

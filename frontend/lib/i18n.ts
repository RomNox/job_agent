import { de } from "@/messages/de";
import { en } from "@/messages/en";
import { ru } from "@/messages/ru";
import { uk } from "@/messages/uk";

import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

export type Messages = typeof de;
export type TranslationValues = Record<string, string | number>;

type DeepMessageValue<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly DeepMessageValue<U>[]
        : T extends object
          ? DeepPartialMessages<T>
          : T;

export type DeepPartialMessages<T> = {
  [K in keyof T]?: DeepMessageValue<T[K]>;
};

const localeMessages: Record<Locale, DeepPartialMessages<Messages>> = {
  de,
  en,
  ru,
  uk,
};

export function getMessages(locale: Locale): Messages {
  return deepMerge(de, localeMessages[locale] ?? localeMessages[DEFAULT_LOCALE]);
}

export function translate(
  messages: Messages,
  path: string,
  values?: TranslationValues,
): string {
  const resolvedValue = getValueByPath(messages, path);
  if (typeof resolvedValue !== "string") {
    return path;
  }

  if (!values) {
    return resolvedValue;
  }

  return resolvedValue.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}

function getValueByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function deepMerge<T>(base: T, override: DeepPartialMessages<T> | undefined): T {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base)) {
    return ((override as unknown[]) ?? base) as T;
  }

  if (base && typeof base === "object") {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

    for (const [key, overrideValue] of Object.entries(
      override as Record<string, unknown>,
    )) {
      const baseValue = result[key];
      if (overrideValue === undefined) {
        continue;
      }

      if (
        Array.isArray(overrideValue) ||
        overrideValue === null ||
        typeof overrideValue !== "object" ||
        Array.isArray(baseValue) ||
        baseValue === null ||
        typeof baseValue !== "object"
      ) {
        result[key] = overrideValue;
        continue;
      }

      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as DeepPartialMessages<Record<string, unknown>>,
      );
    }

    return result as T;
  }

  return (override as T) ?? base;
}

"use client";

import { useI18n } from "@/components/i18n/locale-provider";

export function ProductPreviewSection() {
  const { messages, t } = useI18n();

  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("landing.productPreview.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
            {t("landing.productPreview.title")}
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            {t("landing.productPreview.description")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {messages.landing.productPreview.blocks.map((block) => (
            <div
              key={block.step}
              className="flex h-full flex-col rounded-[1.7rem] border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {block.step}
                </span>
              </div>
              <div className="mt-5 space-y-2.5">
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {block.title}
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  {block.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

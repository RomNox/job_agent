"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/section-card";
import type { WorkspaceFormValues } from "@/types/api";

type JobInputFormProps = {
  register: UseFormRegister<WorkspaceFormValues>;
  errors: FieldErrors<WorkspaceFormValues>;
  prefersRawText: boolean;
};

export function JobInputForm({
  register,
  errors,
  prefersRawText,
}: JobInputFormProps) {
  return (
    <SectionCard
      title="Job Input"
      description="Paste a job URL or raw job text. If both are provided, raw text is used for the backend request."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="job_url">Job URL</Label>
          <Input
            id="job_url"
            placeholder="https://example.com/job-posting"
            {...register("job_url")}
          />
          {errors.job_url ? (
            <p className="text-sm text-red-600">{errors.job_url.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="raw_job_text">Raw job text</Label>
          <Textarea
            id="raw_job_text"
            placeholder="Paste the visible text of the job posting here."
            {...register("raw_job_text")}
          />
          {errors.raw_job_text ? (
            <p className="text-sm text-red-600">{errors.raw_job_text.message}</p>
          ) : null}
        </div>

        {prefersRawText ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Raw job text will be used directly. The URL is kept only as optional source
            context.
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

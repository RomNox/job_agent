"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { SectionCard } from "@/components/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { WorkspaceFormValues } from "@/types/api";

type CandidateProfileFormProps = {
  register: UseFormRegister<WorkspaceFormValues>;
  errors: FieldErrors<WorkspaceFormValues>;
};

const fieldDescriptions: Record<string, string> = {
  skills: "Comma-separated. Example: Python, SQL, Excel",
  desired_roles: "Comma-separated. Example: Data Analyst, Ausbildung Fachinformatik",
  desired_locations: "Comma-separated. Example: Berlin, Hamburg, Remote",
  languages: "Comma-separated. Example: German C1, English B2",
};

export function CandidateProfileForm({
  register,
  errors,
}: CandidateProfileFormProps) {
  return (
    <SectionCard
      title="Candidate Profile"
      description="Provide the minimum profile details needed to assemble an application package."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" placeholder="Max Mustermann" {...register("full_name")} />
          {errors.full_name ? (
            <p className="text-sm text-red-600">{errors.full_name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            placeholder="Short background, motivation, and positioning for this application."
            className="min-h-[120px]"
            {...register("summary")}
          />
          {errors.summary ? (
            <p className="text-sm text-red-600">{errors.summary.message}</p>
          ) : null}
        </div>

        {(
          [
            ["skills", "Skills"],
            ["desired_roles", "Desired roles"],
            ["desired_locations", "Desired locations"],
            ["languages", "Languages"],
          ] as const
        ).map(([field, label]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              placeholder={fieldDescriptions[field]}
              {...register(field)}
            />
            <p className="text-xs text-slate-500">{fieldDescriptions[field]}</p>
            {errors[field] ? (
              <p className="text-sm text-red-600">{errors[field]?.message}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

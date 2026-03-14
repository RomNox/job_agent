import { cn } from "@/lib/utils";

type WorkflowStep = "idle" | "parsing" | "preparing" | "done";

type ProgressIndicatorProps = {
  currentStep: WorkflowStep;
  skipParsing?: boolean;
};

const stepOrder = ["parsing", "preparing"] as const;

const stepLabels: Record<(typeof stepOrder)[number], string> = {
  parsing: "Parsing",
  preparing: "Preparing package",
};

export function ProgressIndicator({
  currentStep,
  skipParsing = false,
}: ProgressIndicatorProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Workflow progress
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {stepOrder.map((step, index) => {
          const isSkipped = skipParsing && step === "parsing" && currentStep !== "parsing";
          const isCurrent = currentStep === step;
          const isComplete =
            currentStep === "done" ||
            (step === "parsing" && currentStep === "preparing");

          return (
            <div key={step} className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isSkipped && "border-slate-200 bg-slate-50 text-slate-500",
                  isCurrent &&
                    "border-slate-900 bg-slate-900 text-white shadow-soft",
                  isComplete &&
                    !isCurrent &&
                    !isSkipped &&
                    "border-slate-300 bg-slate-100 text-slate-900",
                  !isCurrent &&
                    !isComplete &&
                    !isSkipped &&
                    "border-slate-200 bg-white text-slate-400",
                )}
              >
                {isSkipped ? "—" : isComplete ? "✓" : index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{stepLabels[step]}</p>
                <p className="text-xs text-slate-500">
                  {isSkipped
                    ? "Skipped"
                    : isCurrent
                    ? "Running now"
                    : isComplete
                      ? "Completed"
                      : "Waiting"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { FieldProps } from "@/types/props.types";
import { AlertCircle } from "lucide-react";

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink/80">
        {label}
      </label>
      {children}
      {error ? (
        <p className="font-mono text-xs text-seal flex items-center gap-1">
          <AlertCircle className="h-3 w-3 inline" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

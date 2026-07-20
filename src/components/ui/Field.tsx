import type { FieldProps } from "@/types/props.types.ts";

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="font-mono text-xs text-seal">{error}</p> : null}
    </div>
  );
}

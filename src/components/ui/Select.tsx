import React, { forwardRef } from "react";
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ options, ...props }, ref) {
    return (
      <select
        ref={ref}
        {...props}
        className={`rounded-lg border border-hairline bg-paper-raised px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-seal/40 focus:border-seal ${props.className ?? ""}`}
      >
        {" "}
        {options.map(function renderOption(opt) {
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    );
  },
);

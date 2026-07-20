import React, { forwardRef } from "react";
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={`rounded-lg border border-hairline bg-paper-raised px-3 py-2.5 text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-seal/40 focus:border-seal ${props.className ?? ""}`}
      />
    );
  },
);

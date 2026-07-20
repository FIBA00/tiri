import { forwardRef } from "react";
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextArea(props, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`rounded-lg border border-hairline bg-paper-raised px-3 py-2.5 text-ink placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-seal/40 focus:border-seal ${props.className ?? ""}`}
      />
    );
  },
);

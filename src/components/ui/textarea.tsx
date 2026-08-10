import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-lg transition-colors outline-none placeholder:text-muted focus-visible:border-seal focus-visible:ring-3 focus-visible:ring-seal/50 disabled:cursor-not-allowed disabled:bg-hairline/50 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:bg-paper dark:disabled:bg-hairline/80 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-hairline bg-paper px-4 py-3 text-lg transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-muted focus-visible:border-seal focus-visible:ring-3 focus-visible:ring-seal/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-hairline/50 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:bg-paper dark:disabled:bg-hairline/80 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

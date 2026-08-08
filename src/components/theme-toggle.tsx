"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-hairline text-ink transition-all duration-200 hover:bg-seal/10 hover:border-seal/30 focus-visible:outline-none"
        aria-label="Toggle theme"
      >
        {!mounted ? (
          <span className="h-4 w-4" />
        ) : resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 transition-transform duration-300" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-300" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-hairline rounded-xl min-w-[150px] p-2">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`rounded-lg cursor-pointer flex items-center gap-2 p-2 ${
            theme === "light" ? "bg-seal/10 text-seal" : "text-muted hover:text-ink hover:bg-seal/5"
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`rounded-lg cursor-pointer flex items-center gap-2 p-2 ${
            theme === "dark" ? "bg-seal/10 text-seal" : "text-muted hover:text-ink hover:bg-seal/5"
          }`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`rounded-lg cursor-pointer flex items-center gap-2 p-2 ${
            theme === "system" ? "bg-seal/10 text-seal" : "text-muted hover:text-ink hover:bg-seal/5"
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

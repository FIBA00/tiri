"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-200 hover:border-ink hover:bg-paper-raised focus-visible:outline-none"
        aria-label="Toggle theme"
      >
        {!mounted ? (
          <span className="h-4 w-4" />
        ) : resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-200" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-paper-raised border-hairline text-ink rounded-xl shadow-md p-1 min-w-[120px]"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer rounded-lg text-sm text-ink hover:bg-paper focus:bg-paper focus:text-seal transition-colors"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer rounded-lg text-sm text-ink hover:bg-paper focus:bg-paper focus:text-seal transition-colors"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer rounded-lg text-sm text-ink hover:bg-paper focus:bg-paper focus:text-seal transition-colors"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// src/components/theme-toggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(function markMounted() {
    setMounted(true);
  }, []);

  if (!mounted) {
    // reserve the space, avoid a layout shift, render nothing theme-dependent
    return <span className="font-mono text-xs w-9 inline-block" />;
  }

  return (
    <button
      className="font-mono text-xs text-muted hover:text-ink"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
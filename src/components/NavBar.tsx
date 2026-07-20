// src/components/NavBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import Sidebar from "@/components/Sidebar";

export default function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-sm">
            T
          </span>
          <span className="font-display text-lg text-ink">Tiri</span>
        </Link>

        {/* inline links — desktop only, sidebar carries them on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="hidden md:inline text-sm text-ink hover:text-seal"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="hidden md:inline-flex btn-seal !px-4 !py-2 text-sm"
          >
            Get started
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}

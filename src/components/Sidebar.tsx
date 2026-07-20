"use client";

import type { SideBarProps } from "@/types/props.types.ts";
import { useEffect } from "react";
import { navLinks, sidebarExtraLinks } from "@/lib/nav-links.ts";
import Link from "next/link";


export default function SideBar({ open, onClose }: SideBarProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col
          bg-paper-raised border-l border-hairline
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        aria-label="Site menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <span className="font-display text-lg text-ink">Menu</span>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-5 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-lg px-3 py-2.5 text-ink hover:bg-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-hairline px-5 py-6">
          <div className="flex flex-col gap-1">
            {sidebarExtraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-sm text-muted hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/sign-up" onClick={onClose} className="btn-seal w-full">
              Get started
            </Link>
            <Link
              href="/sign-in"
              onClick={onClose}
              className="btn-ghost w-full"
            >
              Sign in
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

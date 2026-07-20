// src/components/Footer.tsx
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-xs">
            T
          </span>
          <span className="font-display text-ink">Tiri</span>
        </div>

        <div className="flex gap-6">
          {navLinks.map(function renderLink(link) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-ink"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Tiri
        </p>
      </div>
    </footer>
  );
}

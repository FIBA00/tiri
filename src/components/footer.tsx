import Link from "next/link";
import { navLinks } from "@/lib/nav-links";

export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-seal to-seal-hover text-white font-display text-xs font-bold shadow-sm">
            T
          </span>
          <span className="font-display font-bold text-ink">Tiri</span>
        </div>

        <div className="flex flex-wrap gap-6">
          {navLinks.map(function RenderLink(link) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Tiri Digital Invitations.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

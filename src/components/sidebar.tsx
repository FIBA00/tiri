"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SideBarProps } from "@/types/props.types";
import { navLinks, sidebarExtraLinks } from "@/lib/nav-links";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { X, LogOut } from "lucide-react";

export function Sidebar({ open, onClose, session }: SideBarProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  async function HandleSignout() {
    await authClient.signOut();
    onClose();
    redirect("/");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-80 bg-paper-raised/95 backdrop-blur-xl border-l border-hairline shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-seal to-seal-hover flex items-center justify-center text-white font-bold text-xs">
              T
            </div>
            <span className="font-display font-semibold text-lg text-ink">Tiri</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-muted hover:text-ink hover:bg-seal/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
          <nav className="flex flex-col gap-2">
            <p className="eyebrow px-4 mb-2">Navigation</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-ink hover:bg-seal/10 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h-px w-full bg-hairline" />

          <nav className="flex flex-col gap-2">
            <p className="eyebrow px-4 mb-2">More</p>
            {sidebarExtraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-ink hover:bg-seal/10 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-hairline bg-paper/50">
          {session ? (
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" onClick={onClose} className="w-full">
                <Button className="w-full btn-seal">Dashboard</Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted hover:text-seal hover:bg-seal/10"
                onClick={HandleSignout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/auth/sign-in" onClick={onClose} className="w-full">
                <Button variant="ghost" className="w-full btn-ghost border border-hairline">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/sign-up" onClick={onClose} className="w-full">
                <Button className="w-full btn-seal">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

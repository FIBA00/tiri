"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { ThemeSwitcher } from "@/components/theme-toggle";
import { Sidebar } from "@/components/sidebar";
import { authClient } from "@/lib/auth-client";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 glass ${
          hasScrolled ? "border-b border-hairline shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-seal to-seal-hover flex items-center justify-center text-white font-bold font-display shadow-md group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-ink">
              Tiri
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-ink relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-seal hover:after:w-full after:transition-all after:duration-300 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeSwitcher />
              {session ? (
                <Link href="/dashboard">
                  <Button variant="ghost" className="btn-ghost">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/sign-in">
                    <Button variant="ghost" className="btn-ghost">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button className="btn-seal">Get started</Button>
                  </Link>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 rounded-xl text-ink hover:bg-seal/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <Sidebar session={session} open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

export default NavBar;

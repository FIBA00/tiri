"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { ThemeSwitcher } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Menu, User, Settings, Globe, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function HandleSignout() {
    await authClient.signOut();
    setIsMobileMenuOpen(false);
    router.push("/");
  }

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

          {/* Desktop Nav */}
          {!session && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {!session ? (
                <div className="flex items-center gap-2">
                  <ThemeSwitcher />
                  <Link href="/auth/sign-in">
                    <Button variant="ghost" className="btn-ghost">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button className="btn-seal">Get started</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="btn-ghost text-sm h-9 px-4">
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-gradient-to-br from-seal to-seal-hover shadow-sm border border-hairline flex items-center justify-center text-white font-display font-bold hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seal ring-offset-2 ring-offset-paper">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 border-hairline rounded-2xl p-2 shadow-xl bg-paper-raised/95 backdrop-blur-xl">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal p-3">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold leading-none text-ink">{session.user?.name || "Organizer"}</p>
                            <p className="text-xs leading-none text-muted">{session.user?.email}</p>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-hairline mx-2" />
                      
                      <div className="flex flex-col gap-1 p-1">
                        <DropdownMenuItem className="cursor-pointer gap-3 text-ink rounded-xl px-3 py-2.5 hover:bg-seal/5 focus:bg-seal/5 transition-colors">
                          <Settings className="h-4 w-4 text-muted" />
                          <span className="font-medium text-sm">Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="gap-3 text-ink cursor-pointer rounded-xl px-3 py-2.5 hover:bg-seal/5 focus:bg-seal/5 transition-colors">
                            <Globe className="h-4 w-4 text-muted" />
                            <span className="font-medium text-sm">Language</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="border-hairline rounded-xl p-2 shadow-lg min-w-[140px]">
                            <DropdownMenuItem className="cursor-pointer text-ink font-medium bg-seal/10 rounded-lg text-sm px-3 py-2">
                              English
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="gap-3 text-ink cursor-pointer rounded-xl px-3 py-2.5 hover:bg-seal/5 focus:bg-seal/5 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            <span className="font-medium text-sm">Theme</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="border-hairline rounded-xl p-2 shadow-lg min-w-[140px] flex flex-col gap-1">
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer text-ink font-medium rounded-lg text-sm px-3 py-2 hover:bg-seal/5 focus:bg-seal/5">Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer text-ink font-medium rounded-lg text-sm px-3 py-2 hover:bg-seal/5 focus:bg-seal/5">Dark</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer text-ink font-medium rounded-lg text-sm px-3 py-2 hover:bg-seal/5 focus:bg-seal/5">System</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </div>

                      <DropdownMenuSeparator className="bg-hairline mx-2" />
                      <div className="p-1">
                        <DropdownMenuItem onClick={HandleSignout} className="cursor-pointer gap-3 text-red-500 rounded-xl px-3 py-2.5 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors">
                          <LogOut className="h-4 w-4" />
                          <span className="font-medium text-sm">Log out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -mr-2 rounded-xl text-ink hover:bg-seal/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-paper/95 backdrop-blur-xl md:hidden animate-fade-in border-t border-hairline overflow-y-auto">
          <div className="flex flex-col p-6 gap-8">
            {session && (
              <div className="flex items-center gap-4 bg-paper-raised p-4 rounded-2xl border border-hairline">
                <div className="w-10 h-10 rounded-full bg-seal/10 flex items-center justify-center text-seal">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-ink">{session.user?.name}</p>
                  <p className="text-xs text-muted">{session.user?.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-4">
              <p className="eyebrow">Menu</p>
              {!session ? (
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-ink hover:text-seal transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-ink hover:text-seal transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard" // Assuming settings is within dashboard or user has no standalone settings route yet
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-ink hover:text-seal transition-colors"
                  >
                    Settings
                  </Link>
                </>
              )}
            </nav>

            <div className="h-px bg-hairline" />

            <div className="flex flex-col gap-4">
              <p className="eyebrow">Preferences</p>
              <div className="flex items-center justify-between">
                <span className="text-ink font-medium">Theme</span>
                <ThemeSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink font-medium">Language</span>
                <span className="text-sm font-medium text-muted bg-paper-raised px-2 py-1 rounded-md border border-hairline">English</span>
              </div>
            </div>

            <div className="h-px bg-hairline" />

            {session ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={HandleSignout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full btn-ghost border border-hairline">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full btn-seal">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;

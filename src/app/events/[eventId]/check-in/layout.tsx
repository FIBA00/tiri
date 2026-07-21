import React from "react";

interface CheckInLayoutProps {
  children: React.ReactNode;
}

export default function CheckInLayout({ children }: CheckInLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">

      {/* Uses your matching glass-morphism style from NavBar.tsx */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-sm">
              T
            </span>
            <span className="font-display text-lg text-ink">Tiri</span>
            <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald border border-emerald/20">
              Terminal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald"></span>
              </span>
              <span className="font-mono text-xs text-muted">Secure Gatekeeper Link</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-6 px-4">
        {children}
      </main>

      {/* Secured Handshake Footer */}
      <footer className="border-t border-hairline bg-paper-raised py-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          © {new Date().getFullYear()} Tiri. Handshake Verified.
        </p>
      </footer>
    </div>
  );
}

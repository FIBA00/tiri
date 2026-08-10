import React from "react";

export default async function CheckInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <header className="bg-paper sticky top-0 z-10 border-b border-hairline px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-display text-xl font-bold tracking-tight text-ink">Tiri</div>
            <div className="rounded-full bg-seal/10 px-2.5 py-1 text-xs font-semibold text-seal uppercase tracking-wider">
              Terminal
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald"></span>
            </span>
            <span className="text-sm font-medium text-muted">Live</span>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}

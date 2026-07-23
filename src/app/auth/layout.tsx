// src/app/auth/layout.tsx
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-seal text-paper-raised font-display text-lg">
            T
          </span>
          <h1 className="mt-4 font-display text-2xl text-ink">Tiri</h1>
        </div>
        <div className="card-surface border border-hairline rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
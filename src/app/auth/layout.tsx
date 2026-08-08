import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-seal/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-seal to-seal-hover text-white font-display text-lg shadow-lg">
            T
          </span>
          <h1 className="mt-4 font-display text-2xl text-ink">Tiri</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

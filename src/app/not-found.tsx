import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-4 text-center font-sans">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-seal/10 text-seal mb-8 animate-fade-in">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h1 className="font-display text-8xl font-black text-ink animate-slide-up">404</h1>
      <h2 className="mt-4 font-display text-2xl font-semibold text-ink animate-slide-up stagger-1">Page not found</h2>
      <p className="mt-4 max-w-md text-muted animate-slide-up stagger-2 mb-8">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/" className="btn-seal animate-slide-up stagger-3">
        Return Home
      </Link>
    </div>
  );
}

// src/components/CtaBand.tsx
import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="px-6 py-20 bg-ink">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl text-paper md:text-4xl">
          Start your first event.
        </h2>
        <p className="mt-4 text-paper/70">
          Free while Tiri is in early access — no card required, ironically.
        </p>
        <Link href="/auth/sign-up" className="btn-seal mt-8 inline-flex">
          Create your event
        </Link>
      </div>
    </section>
  );
}

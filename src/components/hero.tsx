import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden px-6 py-20 md:py-28">
      <div className="absolute top-20 -left-32 w-96 h-96 bg-seal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-emerald/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-seal/5 rounded-full blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div className="stagger">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper-raised px-4 py-1.5 text-xs font-medium text-muted">
            <Sparkles className="h-3.5 w-3.5 text-seal" />
            Digital Invitations, Reimagined
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl">
            The calling card,{" "}
            <span className="bg-gradient-to-r from-seal to-emerald bg-clip-text text-transparent">
              reimagined.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted leading-relaxed">
            Build your guest list, design email invitations, convert card designs with Gemini AI, and track RSVPs live — no paper, no lost invitations, no guesswork.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/events/new">
              <Button className="btn-seal inline-flex items-center gap-2 px-8 py-6 text-base">
                Create your event
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="btn-ghost px-8 py-6 text-base">
                See how it works
              </Button>
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative">
            <div className="card-surface w-72 p-6 rotate-2 transition-all duration-500 hover:rotate-0 hover:scale-105">
              <p className="eyebrow">You are invited</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Bethlehem & Yonas</h3>
              <p className="mt-1 text-sm text-muted">Wedding Reception · Nov 14, 2026</p>
              <div className="mt-6 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
                </span>
                <span className="font-mono text-xs text-muted">RSVP tracked live</span>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-seal to-seal-hover text-white shadow-lg animate-pulse-glow">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border border-hairline bg-paper-raised/50 -rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

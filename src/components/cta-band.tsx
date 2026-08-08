import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden px-6 py-24 bg-gradient-to-br from-seal to-seal-hover text-white">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/20">
          <Sparkles className="h-3.5 w-3.5" />
          Get Started In Minutes
        </div>

        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Start planning your next event.
        </h2>

        <p className="text-lg text-white/80 max-w-xl">
          Build guest lists, design HTML email invitations with Gemini AI, and scan passcodes at the door.
        </p>

        <Link href="/events/new">
          <Button className="mt-4 bg-white text-seal hover:bg-paper font-semibold px-8 py-6 text-base rounded-xl shadow-xl transition-all hover:scale-105">
            Create Your Event
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default CtaBand;

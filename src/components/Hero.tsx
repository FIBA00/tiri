// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Left: copy */}
        <div>
          <p className="eyebrow mb-4">Tiri · Digital Invitations</p>
          <h1 className="text-4xl md:text-5xl font-display leading-tight text-ink">
            The calling card,
            <br />
            <span className="text-seal">reimagined.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted font-body">
            Build your guest list, send a card to every guest, and watch
            RSVPs come in — no paper, no lost invitations, no guesswork.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="/sign-up" className="btn-seal">
              Create your event
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See how it works
            </a>
          </div>
        </div>

        {/* Right: card mockup, signature element */}
        <div className="relative flex justify-center">
          <div className="card-surface w-72 rotate-3 p-6 transition-transform hover:rotate-0">
            <p className="eyebrow">You are invited</p>
            <h3 className="mt-2 font-display text-2xl text-ink">
              Bethlehem &amp; Yonas
            </h3>
            <p className="mt-1 text-sm text-muted">Wedding · Nov 14, 2026</p>
            <div className="mt-6 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-seal" />
              <span className="font-mono text-xs text-muted">
                RSVP tracked live
              </span>
            </div>
          </div>
          {/* wax seal accent, floating on card corner */}
          <div className="absolute -top-4 right-16 flex h-14 w-14 items-center justify-center rounded-full bg-seal text-paper-raised shadow-md">
            <span className="font-display text-lg">T</span>
          </div>
        </div>
      </div>
    </section>
  );
}
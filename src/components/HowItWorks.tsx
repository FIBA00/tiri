// src/components/HowItWorks.tsx
const steps = [
  {
    n: "01",
    title: "Create your event",
    body: "Name, date, venue, and the details guests need — done in a couple minutes.",
  },
  {
    n: "02",
    title: "Build your guest list",
    body: "Add guests manually, import an Excel sheet, or pull from Google Contacts.",
  },
  {
    n: "03",
    title: "Send digital cards",
    body: "Assign a unique card per guest, or one shared card for a group.",
  },
  {
    n: "04",
    title: "Track it live",
    body: "See who opened, accepted, declined, or checked in — as it happens.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">The problem</p>
        <p className="max-w-2xl text-lg text-muted">
          Paper cards get lost. Guest lists live in someone's notebook, and
          nobody finds out who's coming until the day of the event.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-4">
          {steps.map(function renderStep(step) {
            return (
              <div key={step.n}>
                <span className="font-mono text-sm text-gold">{step.n}</span>
                <h3 className="mt-3 font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

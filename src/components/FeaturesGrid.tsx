// src/components/FeatureGrid.tsx
const features = [
  {
    title: "Guests from anywhere",
    body: "Manually, from Excel, from Google Contacts — build one list, no re-typing.",
    tag: "Guest management",
  },
  {
    title: "Cards, assigned properly",
    body: "One card per guest, or a shared card for a group — with permission to pass it on.",
    tag: "Invitations",
  },
  {
    title: "Know who's coming",
    body: "Sent, delivered, opened, accepted, declined, checked in — one dashboard, real time.",
    tag: "Tracking",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="px-6 py-20 bg-paper-raised">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">What Tiri does</p>
        <h2 className="font-display text-3xl text-ink max-w-xl">
          Everything a paper card can't do.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(function renderFeature(feature) {
            return (
              <div key={feature.title} className="card-surface p-6">
                <p className="eyebrow mb-4">{feature.tag}</p>
                <h3 className="font-display text-xl text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

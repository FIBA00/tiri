// src/components/DashboardPreview.tsx
const stats = [
  { label: "Sent", value: "128" },
  { label: "Delivered", value: "126" },
  { label: "Opened", value: "94" },
  { label: "Accepted", value: "71" },
  { label: "Checked in", value: "0" },
];

export default function DashboardPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow mb-3">Live tracking</p>
        <h2 className="font-display text-3xl text-ink max-w-xl">
          One dashboard for every RSVP.
        </h2>

        <div className="card-surface mt-10 p-8">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <span className="font-display text-lg text-ink">
              Bethlehem &amp; Yonas — Wedding
            </span>
            <span className="font-mono text-xs text-emerald">● live</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {stats.map(function renderStat(stat) {
              return (
                <div key={stat.label}>
                  <p className="font-mono text-2xl text-ink">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

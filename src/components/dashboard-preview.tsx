const statsList = [
  { label: "Invites Sent", value: "128", accent: "text-ink" },
  { label: "Delivered", value: "126", accent: "text-ink" },
  { label: "Pending", value: "32", accent: "text-amber-500" },
  { label: "Checked In", value: "94", accent: "text-emerald" },
  { label: "Exited", value: "18", accent: "text-seal" },
];

export function DashboardPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3">Live Tracking</p>
        <h2 className="font-display text-3xl font-bold text-ink max-w-xl">
          One dashboard for every RSVP and door check-in.
        </h2>

        <div className="card-surface mt-10 p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <span className="font-display text-lg font-bold text-ink">
                Bethlehem & Yonas — Wedding Reception
              </span>
              <p className="text-xs text-muted">Saturday, Nov 14, 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
              </span>
              <span className="font-mono text-xs font-semibold text-emerald">● Live Gate Check-in</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {statsList.map(function RenderStat(stat) {
              return (
                <div key={stat.label} className="p-4 rounded-xl bg-paper border border-hairline">
                  <p className={`font-mono text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;

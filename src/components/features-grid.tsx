import { Users, Mail, BarChart3 } from "lucide-react";

const featuresList = [
  {
    title: "Guests from anywhere",
    body: "Manually, from Excel, or with download templates — build one list seamlessly.",
    tag: "Guest Management",
    icon: Users,
  },
  {
    title: "HTML Emails & AI Templates",
    body: "Use responsive default email templates or convert image designs into HTML with Gemini AI.",
    tag: "Invitations & AI",
    icon: Mail,
  },
  {
    title: "Know who's coming",
    body: "Passcode verification, door check-in terminal, real-time analytics — all in one dashboard.",
    tag: "Tracking",
    icon: BarChart3,
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-20 bg-paper-raised border-y border-hairline">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Capabilities</p>
        <h2 className="font-display text-3xl font-bold text-ink max-w-xl">
          Everything paper invitations can't do.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3 stagger">
          {featuresList.map(function RenderFeature(feature) {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="card-surface glass p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="eyebrow">{feature.tag}</span>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-seal to-seal-hover text-white shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{feature.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;

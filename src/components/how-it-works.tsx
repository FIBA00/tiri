import { CalendarPlus, Users, Sparkles, Activity } from "lucide-react";

const stepsList = [
  {
    stepNumber: "01",
    title: "Create your event",
    body: "Specify date, time, and geospatial map coordinates — done in a couple minutes.",
    icon: CalendarPlus,
  },
  {
    stepNumber: "02",
    title: "Build your guest list",
    body: "Add guests manually or import an Excel sheet with custom download templates.",
    icon: Users,
  },
  {
    stepNumber: "03",
    title: "Design email template",
    body: "Choose default responsive HTML template or convert image designs using Gemini AI.",
    icon: Sparkles,
  },
  {
    stepNumber: "04",
    title: "Track live check-ins",
    body: "Scan passcodes at the door with QR terminal and manage attendance status.",
    icon: Activity,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 relative">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Simple Process</p>
        <h2 className="font-display text-3xl font-bold text-ink max-w-xl">
          How Tiri streamlines your event invitations.
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-4 relative">
          {stepsList.map(function RenderStep(step) {
            const Icon = step.icon;

            return (
              <div key={step.stepNumber} className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-seal to-seal-hover text-white font-mono text-sm font-bold shadow-md">
                    {step.stepNumber}
                  </div>
                  <div className="p-2.5 rounded-xl bg-seal/10 text-seal">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

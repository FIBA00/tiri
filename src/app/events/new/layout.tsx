// DESIGN CHOICE
// Route structure for this to work as one continuous flow:
// /events/new, /events/new/guests, /events/new/cards, /events/new/preview
// all siblings under the same layout.tsx, so the context survives navigation between them.
// (Once a backend exists, new becomes a real [id],
// and the context gets deleted — the routes underneath don't need to change shape.)

import { WizardProvider } from "@/lib/wizard-context.tsx"

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return <WizardProvider>{children}</WizardProvider>
}
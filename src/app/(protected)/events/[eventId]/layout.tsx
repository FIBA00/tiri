import React from "react";
import NavBar from "@/components/NavBar";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: EventLayoutProps) {
  const { eventId } = await params; // camelCase variable

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* NavBar handles mobile sidebar and navigation mapping */}
      <NavBar />

      {/* Main Dashboard Space */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

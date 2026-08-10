"use client";

import dynamic from "next/dynamic";

export const DynamicLocationPicker = dynamic(
  () => import("./location-picker").then((mod) => mod.LocationPicker),
  { ssr: false, loading: () => <div className="w-full h-full bg-paper flex items-center justify-center border border-hairline rounded-xl text-sm text-muted">Loading map...</div> }
);

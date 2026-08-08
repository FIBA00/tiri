"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CardsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/events/new/templates");
  }, [router]);

  return null;
}

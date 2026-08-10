"use client";

import { useState } from "react";
import { CheckInTerminal } from "@/features/check-in/components/check-in-terminal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Lock, Loader2 } from "lucide-react";
import { verifyPinAction } from "@/features/check-in/actions/check-in.actions";

interface Props {
  eventId: string;
  requiresPin: boolean;
}

export function CheckInTerminalContainer({ eventId, requiresPin }: Props) {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!requiresPin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 6) {
      setError("PIN must be 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const result = await verifyPinAction({ eventId, pin });

    setLoading(false);
    if (result?.data?.success) {
      setIsAuthenticated(true);
    } else {
      setError(result?.data?.error || "Invalid PIN");
    }
  }

  if (!isAuthenticated) {
    return (
      <form onSubmit={handleVerifyPin} className="bg-paper-raised border border-hairline rounded-3xl p-8 shadow-xl flex flex-col items-center gap-8 text-center animate-slide-up">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-seal/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-seal" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink tracking-tight">Restricted Access</h2>
            <p className="text-sm text-muted mt-2 max-w-xs">
              Please enter the 6-digit Check-in PIN for this event to unlock the scanner terminal.
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-xs flex flex-col gap-3">
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <Input
              type="password"
              maxLength={6}
              placeholder="••••••"
              className="pl-12 h-14 text-center tracking-[0.5em] font-mono text-2xl font-bold rounded-2xl bg-paper border-2 border-hairline focus:border-seal transition-colors"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium animate-shake">{error}</p>}
        </div>

        <Button type="submit" className="btn-seal w-full max-w-xs h-14 text-lg rounded-2xl font-bold shadow-md hover:shadow-lg transition-all" disabled={loading || pin.length !== 6}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Unlock Terminal"}
        </Button>
      </form>
    );
  }

  // Pass the verified pin into the terminal so it can authenticate scan requests
  return <CheckInTerminal eventId={eventId} pin={requiresPin ? pin : undefined} />;
}

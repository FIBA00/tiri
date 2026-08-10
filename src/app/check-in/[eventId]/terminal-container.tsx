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
      <form onSubmit={handleVerifyPin} className="card-surface p-8 flex flex-col items-center gap-6 text-center">
        <div className="h-12 w-12 rounded-full bg-seal/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-seal" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Restricted Access</h2>
          <p className="text-sm text-muted mt-2">
            Please enter the 6-digit Check-in PIN for this event to access the scanner.
          </p>
        </div>
        
        <div className="w-full max-w-xs flex flex-col gap-2">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              type="password"
              maxLength={6}
              placeholder="Enter PIN"
              className="pl-10 text-center tracking-widest font-mono text-lg"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <Button type="submit" className="btn-seal w-full max-w-xs" disabled={loading || pin.length !== 6}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock Terminal"}
        </Button>
      </form>
    );
  }

  // Pass the verified pin into the terminal so it can authenticate scan requests
  return <CheckInTerminal eventId={eventId} pin={requiresPin ? pin : undefined} />;
}

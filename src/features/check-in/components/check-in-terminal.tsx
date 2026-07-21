"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Scanner } from "@yudiel/react-qr-scanner";
import { verifyCodeAction } from "../actions/check-in.actions";
import { updateInviteAction } from "@/features/invite/actions/invite.actions";

interface CheckInTerminalProps {
  eventId: string;
}

type ScannedInvite = {
  id: string;
  code: string;
  inviteeName: string;
  quantity: number;
  status: "PENDING" | "ENTERED" | "EXITED" | "CANCELED";
};

export function CheckInTerminal({ eventId }: CheckInTerminalProps) {
  // camelCase variables
  const [inputValue, setInputValue] = useState("");
  const [scannedInvite, setScannedInvite] = useState<ScannedInvite | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const verifyAction = useAction(verifyCodeAction);
  const updateAction = useAction(updateInviteAction);

  useEffect(() => {
    if (!scannedInvite && !isCameraActive) {
      inputRef.current?.focus();
    }
  }, [scannedInvite, isCameraActive]);

  async function HandleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await ProcessCode(inputValue);
  }

  async function HandleScan(detectedCodes: { rawValue: string }[]) {
    if (detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      setIsCameraActive(false);
      await ProcessCode(code);
    }
  }

  async function ProcessCode(rawCode: string) {
    setFeedbackMsg(null);
    setScannedInvite(null);

    const cleanCode = rawCode.trim().toUpperCase();

    if (cleanCode.length !== 8) {
      setFeedbackMsg({ type: "error", text: "Code must be 8 characters." });
      setInputValue("");
      return;
    }

    const result = await verifyAction.executeAsync({ code: cleanCode, eventId });

    if (result?.data?.success && result.data.data) {
      setScannedInvite(result.data.data as ScannedInvite);
      setInputValue("");
    } else {
      setFeedbackMsg({ type: "error", text: result?.data?.error || "Invalid code." });
      setInputValue("");
    }
  }

  async function HandleStatusChange(newStatus: ScannedInvite["status"]) {
    if (!scannedInvite) return;

    const result = await updateAction.executeAsync({
      invitationId: scannedInvite.id,
      status: newStatus,
    });

    if (result?.data?.success) {
      setScannedInvite({ ...scannedInvite, status: newStatus });
      setFeedbackMsg({ type: "success", text: `Status updated to ${newStatus}` });

      setTimeout(() => {
        setScannedInvite(null);
        setFeedbackMsg(null);
      }, 3000);
    } else {
      setFeedbackMsg({ type: "error", text: "Failed to update status." });
    }
  }

  function HandleClear() {
    setScannedInvite(null);
    setFeedbackMsg(null);
    setInputValue("");
    setIsCameraActive(false);
  }

  return (
    <div className="card-surface max-w-md mx-auto p-6">
      <h2 className="font-display text-2xl font-semibold text-center mb-6">Check-in Terminal</h2>

      {!scannedInvite ? (
        <div className="flex flex-col gap-4">

          {/* Camera Scanner Viewport */}
          {isCameraActive ? (
            <div className="rounded-2xl overflow-hidden border-2 border-seal bg-paper-raised aspect-square">
              <Scanner
                onScan={HandleScan}
                onError={(error) => setFeedbackMsg({ type: "error", text: "Camera error: " + error.message })}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className="w-full bg-paper-raised text-ink border-2 border-dashed border-hairline font-medium py-6 rounded-2xl hover:border-muted transition-colors flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📷</span>
              Open Camera Scanner
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={() => setIsCameraActive(false)}
              className="font-mono text-xs text-seal font-medium text-center hover:underline uppercase tracking-wide"
            >
              Close Camera
            </button>
          )}

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-hairline flex-1"></div>
            <span className="eyebrow">OR</span>
            <div className="h-px bg-hairline flex-1"></div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
            <label className="eyebrow text-center">
              Type 8-Character Entry Code
            </label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4"
              maxLength={8}
              disabled={verifyAction.isExecuting}
              className="w-full text-center text-3xl tracking-[0.25em] font-mono uppercase border-2 border-hairline rounded-2xl p-4 focus:border-seal focus:outline-none bg-paper-raised text-ink"
            />
            <button
              type="submit"
              disabled={verifyAction.isExecuting || inputValue.length !== 8}
              className="btn-seal w-full"
            >
              {verifyAction.isExecuting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center p-6 rounded-2xl bg-paper border border-hairline">
            <p className="eyebrow mb-1">Invitee</p>
            <h3 className="font-display text-2xl font-bold text-ink">{scannedInvite.inviteeName}</h3>

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="eyebrow">Admit</p>
                <p className="text-2xl font-bold text-emerald font-mono mt-1">{scannedInvite.quantity}</p>
              </div>
              <div className="w-px h-10 bg-hairline"></div>
              <div className="text-center">
                <p className="eyebrow">Status</p>
                <p className={`text-xs font-mono font-bold mt-2 px-2.5 py-1 rounded-full ${scannedInvite.status === "ENTERED" ? "bg-emerald/10 text-emerald border border-emerald/20" :
                    scannedInvite.status === "PENDING" ? "bg-gold/10 text-gold border border-gold/20" :
                      "bg-seal/10 text-seal border border-seal/20"
                  }`}>
                  {scannedInvite.status}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {scannedInvite.status === "PENDING" && (
              <button
                onClick={() => HandleStatusChange("ENTERED")}
                disabled={updateAction.isExecuting}
                className="w-full bg-emerald text-paper-raised font-semibold py-4 rounded-full hover:bg-emerald/90 transition-colors shadow-sm font-display text-lg"
              >
                {updateAction.isExecuting ? "Processing..." : "Complete Check-in"}
              </button>
            )}

            {scannedInvite.status === "ENTERED" && (
              <button
                onClick={() => HandleStatusChange("EXITED")}
                disabled={updateAction.isExecuting}
                className="w-full bg-gold text-paper-raised font-semibold py-4 rounded-full hover:bg-gold/90 transition-colors shadow-sm font-display text-lg"
              >
                {updateAction.isExecuting ? "Processing..." : "Mark Exit"}
              </button>
            )}

            {scannedInvite.status === "CANCELED" && (
              <div className="p-4 bg-seal/10 border border-seal/20 text-seal text-center font-semibold rounded-2xl font-display">
                This invite has been canceled.
              </div>
            )}

            <button
              onClick={HandleClear}
              className="btn-ghost w-full"
            >
              Scan Next
            </button>
          </div>
        </div>
      )}

      {/* Verification Feedback Block */}
      {feedbackMsg && (
        <div className={`mt-6 p-4 rounded-2xl text-center font-medium ${feedbackMsg.type === "error" ? "bg-seal/10 text-seal border border-seal/20" : "bg-emerald/10 text-emerald border border-emerald/20"
          }`}>
          {feedbackMsg.text}
        </div>
      )}
    </div>
  );
}

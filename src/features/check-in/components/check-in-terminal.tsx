"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Scanner } from "@yudiel/react-qr-scanner";
import { verifyCodeAction } from "../actions/check-in.actions";
import { updateInviteAction } from "@/features/invite/actions/invite.actions";
import { Camera, Keyboard, UserCheck, LogOut, XCircle, RotateCcw } from "lucide-react";

interface CheckInTerminalProps {
  eventId: string;
  pin?: string;
}

type ScannedInvite = {
  id: string;
  code: string;
  inviteeName: string;
  quantity: number;
  status: "PENDING" | "ENTERED" | "EXITED" | "CANCELED";
};

export function CheckInTerminal({ eventId, pin }: CheckInTerminalProps) {
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

    const result = await verifyAction.executeAsync({ code: cleanCode, eventId, pin });

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
    <div className="card-surface p-6 shadow-xl border-t-4 border-t-seal">
      <h2 className="font-display text-2xl font-semibold text-center mb-6 text-ink">Scan or Enter Code</h2>

      {!scannedInvite ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          {isCameraActive ? (
            <div className="rounded-2xl overflow-hidden border-2 border-seal bg-paper-raised aspect-square shadow-inner">
              <Scanner
                onScan={HandleScan}
                onError={(error) => setFeedbackMsg({ type: "error", text: "Camera error: " + error.message })}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-hairline bg-paper py-10 transition-all hover:border-seal hover:bg-paper-raised"
            >
              <div className="rounded-full bg-paper-raised p-4 text-seal shadow-sm transition-transform group-hover:scale-110">
                <Camera className="h-8 w-8" />
              </div>
              <span className="font-medium text-ink">Tap to use camera scanner</span>
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={() => setIsCameraActive(false)}
              className="font-mono text-sm font-semibold text-seal uppercase tracking-wide hover:underline"
            >
              Close Camera
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-hairline"></div>
            <span className="eyebrow flex items-center gap-1"><Keyboard className="h-4 w-4" /> OR</span>
            <div className="h-px flex-1 bg-hairline"></div>
          </div>

          <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
            <label className="eyebrow text-center">Enter Code Manually</label>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder="A1B2C3D4"
              maxLength={8}
              disabled={verifyAction.isExecuting}
              className="w-full rounded-xl border-2 border-hairline bg-paper-raised p-4 text-center font-mono text-3xl font-bold uppercase tracking-[0.25em] text-ink transition-colors focus:border-seal focus:outline-none"
            />
            <button
              type="submit"
              disabled={verifyAction.isExecuting || inputValue.length !== 8}
              className="btn-seal w-full py-4 text-lg"
            >
              {verifyAction.isExecuting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-slide-up">
          <div className="rounded-2xl border border-hairline bg-paper p-6 text-center shadow-sm">
            <p className="eyebrow mb-2">Guest</p>
            <h3 className="font-display text-3xl font-bold text-ink">{scannedInvite.inviteeName}</h3>

            <div className="mt-6 flex items-center justify-center gap-8 rounded-xl bg-paper-raised py-4">
              <div className="text-center">
                <p className="eyebrow">Admit</p>
                <p className="font-mono text-3xl font-bold text-ink">{scannedInvite.quantity}</p>
              </div>
              <div className="h-12 w-px bg-hairline"></div>
              <div className="text-center">
                <p className="eyebrow">Status</p>
                <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase ${
                  scannedInvite.status === "ENTERED" ? "border-emerald/20 bg-emerald/10 text-emerald" :
                  scannedInvite.status === "PENDING" ? "border-gold/20 bg-gold/10 text-gold" :
                  "border-seal/20 bg-seal/10 text-seal"
                }`}>
                  {scannedInvite.status}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {scannedInvite.status === "PENDING" && (
              <button
                onClick={() => HandleStatusChange("ENTERED")}
                disabled={updateAction.isExecuting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-4 font-display text-lg font-semibold text-paper shadow-md transition-transform hover:scale-[1.02] hover:bg-emerald/90 active:scale-100"
              >
                <UserCheck className="h-5 w-5" />
                {updateAction.isExecuting ? "Processing..." : "Complete Check-in"}
              </button>
            )}

            {scannedInvite.status === "ENTERED" && (
              <button
                onClick={() => HandleStatusChange("EXITED")}
                disabled={updateAction.isExecuting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 font-display text-lg font-semibold text-paper shadow-md transition-transform hover:scale-[1.02] hover:bg-gold/90 active:scale-100"
              >
                <LogOut className="h-5 w-5" />
                {updateAction.isExecuting ? "Processing..." : "Mark as Exited"}
              </button>
            )}

            {scannedInvite.status === "CANCELED" && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-seal/20 bg-seal/10 p-4 font-display font-semibold text-seal">
                <XCircle className="h-5 w-5" />
                Invite is Canceled
              </div>
            )}

            <button
              onClick={HandleClear}
              className="btn-ghost flex w-full items-center justify-center gap-2 py-4"
            >
              <RotateCcw className="h-4 w-4" />
              Scan Next
            </button>
          </div>
        </div>
      )}

      {feedbackMsg && (
        <div className={`mt-6 animate-fade-in rounded-xl border p-4 text-center font-medium ${
          feedbackMsg.type === "error" ? "border-seal/20 bg-seal/10 text-seal" : "border-emerald/20 bg-emerald/10 text-emerald"
        }`}>
          {feedbackMsg.text}
        </div>
      )}
    </div>
  );
}

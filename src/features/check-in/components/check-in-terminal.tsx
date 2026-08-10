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
    <div className="bg-paper-raised p-8 rounded-3xl shadow-xl border border-hairline animate-slide-up">
      <h2 className="font-display text-2xl font-bold text-center mb-8 text-ink tracking-tight">Access Terminal</h2>

      {!scannedInvite ? (
        <div className="flex flex-col gap-8 animate-fade-in">
          {isCameraActive ? (
            <div className="rounded-3xl overflow-hidden border-4 border-seal bg-paper-raised aspect-square shadow-2xl relative">
              <Scanner
                onScan={HandleScan}
                onError={(error) => setFeedbackMsg({ type: "error", text: "Camera error: " + error.message })}
              />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none rounded-3xl"></div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className="group flex w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-seal/30 bg-seal/5 py-12 transition-all hover:border-seal hover:bg-seal/10 active:scale-95"
            >
              <div className="rounded-full bg-paper p-5 text-seal shadow-md transition-transform group-hover:scale-110 group-hover:shadow-lg">
                <Camera className="h-10 w-10" />
              </div>
              <span className="font-display text-lg font-bold text-ink">Scan QR Code</span>
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={() => setIsCameraActive(false)}
              className="btn-ghost py-3 font-semibold uppercase tracking-widest text-seal rounded-xl"
            >
              Close Camera
            </button>
          )}

          <div className="flex items-center gap-4 px-4">
            <div className="h-px flex-1 bg-hairline"></div>
            <span className="eyebrow flex items-center gap-1 text-muted"><Keyboard className="h-4 w-4" /> OR</span>
            <div className="h-px flex-1 bg-hairline"></div>
          </div>

          <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              placeholder="ENTER 8-DIGIT CODE"
              maxLength={8}
              disabled={verifyAction.isExecuting}
              className="w-full rounded-2xl border-2 border-hairline bg-paper p-5 text-center font-mono text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-ink transition-colors focus:border-seal focus:outline-none placeholder:text-muted/40"
            />
            <button
              type="submit"
              disabled={verifyAction.isExecuting || inputValue.length !== 8}
              className="btn-seal w-full py-5 text-lg font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              {verifyAction.isExecuting ? "Verifying..." : "Verify Code Manually"}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-8 animate-slide-up">
          <div className="rounded-3xl border border-hairline bg-paper p-8 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-seal"></div>
            <p className="eyebrow mb-3 text-muted tracking-widest">Guest Ticket</p>
            <h3 className="font-display text-4xl font-black text-ink tracking-tight">{scannedInvite.inviteeName}</h3>

            <div className="mt-8 flex items-center justify-between rounded-2xl bg-paper-raised p-6 shadow-inner border border-hairline relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper border border-hairline shadow-inner"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper border border-hairline shadow-inner"></div>
              
              <div className="flex-1 text-center">
                <p className="eyebrow text-muted mb-1">Admit</p>
                <p className="font-mono text-4xl font-black text-ink">{scannedInvite.quantity}</p>
              </div>
              
              <div className="h-16 w-px border-l-2 border-dashed border-hairline"></div>
              
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="eyebrow text-muted mb-2">Status</p>
                <div className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-widest shadow-sm ${
                  scannedInvite.status === "ENTERED" ? "border-emerald/20 bg-emerald/10 text-emerald" :
                  scannedInvite.status === "PENDING" ? "border-gold/20 bg-gold/10 text-gold" :
                  "border-seal/20 bg-seal/10 text-seal"
                }`}>
                  {scannedInvite.status}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {scannedInvite.status === "PENDING" && (
              <button
                onClick={() => HandleStatusChange("ENTERED")}
                disabled={updateAction.isExecuting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald px-6 py-5 font-display text-xl font-bold text-paper shadow-lg shadow-emerald/20 transition-transform hover:-translate-y-1 hover:shadow-xl hover:bg-emerald/90 active:translate-y-0"
              >
                <UserCheck className="h-6 w-6" />
                {updateAction.isExecuting ? "Processing..." : "Complete Check-in"}
              </button>
            )}

            {scannedInvite.status === "ENTERED" && (
              <button
                onClick={() => HandleStatusChange("EXITED")}
                disabled={updateAction.isExecuting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gold px-6 py-5 font-display text-xl font-bold text-paper shadow-lg shadow-gold/20 transition-transform hover:-translate-y-1 hover:shadow-xl hover:bg-gold/90 active:translate-y-0"
              >
                <LogOut className="h-6 w-6" />
                {updateAction.isExecuting ? "Processing..." : "Mark as Exited"}
              </button>
            )}

            {scannedInvite.status === "CANCELED" && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-seal/20 bg-seal/5 p-5 font-display font-bold text-seal text-lg">
                <XCircle className="h-6 w-6" />
                Invite is Canceled
              </div>
            )}

            <button
              onClick={HandleClear}
              className="btn-ghost flex w-full items-center justify-center gap-2 py-5 text-lg font-bold mt-2"
            >
              <RotateCcw className="h-5 w-5" />
              Scan Next Guest
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

import { ScanLine } from "lucide-react";

export default function CheckInLoading() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center p-4 sm:p-8 animate-pulse relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-seal/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-8 mt-6 md:mt-12 relative z-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-2" />
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="h-4 w-32 bg-muted/20 rounded" />
            <div className="h-8 w-64 bg-muted/20 rounded" />
          </div>
        </div>

        <div className="w-full">
          <div className="bg-paper-raised border border-hairline rounded-3xl p-8 flex flex-col items-center justify-center h-[400px] shadow-xl">
            <div className="h-16 w-16 bg-muted/20 rounded-xl mb-6" />
            <div className="h-6 w-48 bg-muted/20 rounded mb-2" />
            <div className="h-4 w-64 bg-muted/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, CheckCircle2, Clock, LogOut, XCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { sendBulkEmailsAction } from "@/features/invite/actions/invite.actions";

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; badge: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  ENTERED: {
    label: "Checked In",
    icon: CheckCircle2,
    color: "text-emerald bg-emerald/10 border-emerald/20",
    badge: "bg-emerald/10 text-emerald border-emerald/20",
  },
  EXITED: {
    label: "Exited",
    icon: LogOut,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  CANCELED: {
    label: "Canceled",
    icon: XCircle,
    color: "text-seal bg-seal/10 border-seal/20",
    badge: "bg-seal/10 text-seal border-seal/20",
  },
};

interface EventGuestListProps {
  invitations: any[];
}

export function EventGuestList({ invitations }: EventGuestListProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === invitations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invitations.map((i) => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSend = async (ids: string[], singleId?: string) => {
    if (ids.length === 0) return;
    
    if (singleId) {
      setSendingId(singleId);
    } else {
      setIsSending(true);
    }
    
    try {
      const res = await sendBulkEmailsAction({ invitationIds: ids });
      if (res?.data?.success) {
        setSelectedIds([]);
        router.refresh();
      }
    } finally {
      setIsSending(false);
      setSendingId(null);
    }
  };

  return (
    <div className="lg:col-span-2 card-surface p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-seal" />
          <h3 className="font-display text-lg font-semibold text-ink">
            Invited Guests ({invitations.length})
          </h3>
        </div>
        {invitations.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSend(selectedIds)}
              disabled={selectedIds.length === 0 || isSending || !!sendingId}
              className="inline-flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              {isSending ? "Sending..." : `Bulk Send (${selectedIds.length})`}
            </Button>
          </div>
        )}
      </div>

      {invitations.length === 0 ? (
        <div className="p-8 text-center text-muted text-sm border border-dashed border-hairline rounded-xl">
          No guests invited yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted">
            <Checkbox
              checked={selectedIds.length === invitations.length && invitations.length > 0}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all"
            />
            <span>Select All</span>
          </div>
          <ul className="flex flex-col gap-3">
            {invitations.map(function RenderInviteItem(invite) {
              const config = STATUS_CONFIG[invite.status] || STATUS_CONFIG.PENDING;
              const Icon = config.icon;
              const isSelected = selectedIds.includes(invite.id);
              const isSingleSending = sendingId === invite.id;
              const canSend = !!invite.email;

              return (
                <li
                  key={invite.id}
                  className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border transition-all ${
                    isSelected ? "border-seal/50 bg-seal/5" : "border-hairline bg-paper hover:border-seal/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(invite.id)}
                      aria-label={`Select ${invite.inviteeName}`}
                    />
                    <div className="w-10 h-10 rounded-full bg-seal/10 text-seal flex items-center justify-center font-bold text-sm shrink-0">
                      {invite.inviteeName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{invite.inviteeName}</p>
                      <p className="font-mono text-xs text-muted">
                        {invite.email ?? invite.phoneNumber ?? "No contact details"} · Passcode: {invite.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center ml-14 sm:ml-0">
                    <Badge variant="outline" className={`text-xs flex items-center gap-1 ${config.badge}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSend([invite.id], invite.id)}
                      disabled={!canSend || isSending || !!sendingId}
                      className="h-8 text-xs inline-flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {isSingleSending ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

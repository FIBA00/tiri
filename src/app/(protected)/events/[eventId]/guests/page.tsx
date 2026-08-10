"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, UserCheck, MoreVertical, X, Check, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { listInvitesAction, updateInviteAction, sendBulkEmailsAction } from "@/features/invite/actions/invite.actions";

export default function GuestsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    params.then((p) => {
      setEventId(p.eventId);
    });
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const timer = setTimeout(() => {
      fetchGuests();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter, eventId]);

  async function fetchGuests() {
    if (!eventId) return;
    setLoading(true);
    const result = await listInvitesAction({
      eventId,
      search: search.length >= 2 ? search : undefined,
      status: statusFilter as any,
      limit: 50,
      page: 1,
    });
    
    if (result?.data?.success) {
      setGuests(result.data.data);
    }
    setLoading(false);
  }

  async function handleStatusChange(invitationId: string, newStatus: any) {
    startTransition(async () => {
      const res = await updateInviteAction({
        invitationId,
        status: newStatus,
      });
      if (res?.data?.success) {
        setGuests((prev) =>
          prev.map((g) => (g.id === invitationId ? { ...g, status: newStatus } : g))
        );
      }
    });
  }

  async function handleSendEmail(invitationId: string) {
    startTransition(async () => {
      await sendBulkEmailsAction({
        invitationIds: [invitationId],
      });
      alert("Email sent successfully!");
    });
  }

  if (!eventId) return null;

  return (
    <div className="flex flex-col gap-10 max-w-6xl">
      <div className="border-b border-hairline pb-8">
        <h2 className="font-display text-2xl font-bold text-ink">Guest Management</h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Search, filter, and manage your event attendees. You can manually override check-in statuses or send follow-up emails directly from this table.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper-raised p-4 rounded-2xl border border-hairline shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search by name, email, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 w-full bg-paper border-hairline"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 items-center">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider mr-2 hidden md:inline-block">Filter:</span>
            <Button
              variant={!statusFilter ? "default" : "outline"}
              onClick={() => setStatusFilter(undefined)}
              className={!statusFilter ? "btn-seal" : "border-hairline bg-paper text-ink"}
              size="sm"
            >
              All
            </Button>
            {["PENDING", "ENTERED", "EXITED", "CANCELED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "btn-seal" : "border-hairline bg-paper text-ink"}
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

      <div className="card-surface rounded-2xl overflow-hidden border border-hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper border-b border-hairline text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Guest Name</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Email / Phone</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-paper-raised">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-seal" />
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    No guests found.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-seal/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink">{guest.inviteeName}</td>
                    <td className="px-6 py-4 font-mono text-muted">{guest.code}</td>
                    <td className="px-6 py-4 text-muted">
                      {guest.email || guest.phoneNumber || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          guest.status === "ENTERED"
                            ? "border-emerald/30 bg-emerald/10 text-emerald"
                            : guest.status === "PENDING"
                            ? "border-gold/30 bg-gold/10 text-gold"
                            : guest.status === "CANCELED"
                            ? "border-red-500/30 bg-red-500/10 text-red-500"
                            : "border-muted/30 bg-muted/10 text-muted"
                        }`}
                      >
                        {guest.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-ink hover:bg-seal/10 transition-colors focus-visible:outline-none">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 border-hairline">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(guest.id, "ENTERED")}
                            disabled={isPending}
                            className="cursor-pointer gap-2"
                          >
                            <Check className="h-4 w-4 text-emerald" /> Check In
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(guest.id, "EXITED")}
                            disabled={isPending}
                            className="cursor-pointer gap-2"
                          >
                            <UserCheck className="h-4 w-4 text-muted" /> Check Out
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(guest.id, "CANCELED")}
                            disabled={isPending}
                            className="cursor-pointer gap-2 text-red-500 hover:text-red-600 focus:text-red-600"
                          >
                            <X className="h-4 w-4" /> Cancel Invite
                          </DropdownMenuItem>
                          <div className="h-px bg-hairline my-1" />
                          <DropdownMenuItem
                            onClick={() => handleSendEmail(guest.id)}
                            disabled={isPending || !guest.email}
                            className="cursor-pointer gap-2"
                          >
                            <Mail className="h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}

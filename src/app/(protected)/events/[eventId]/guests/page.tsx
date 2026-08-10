"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, UserCheck, MoreVertical, X, Check, Loader2, Users, Edit2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { listInvitesAction, updateInviteAction, sendBulkEmailsAction, createInviteAction } from "@/features/invite/actions/invite.actions";

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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");

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
      alert("Email queued successfully!");
    });
  }

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    setFormError("");
    startTransition(async () => {
      const res = await createInviteAction({
        eventId: eventId!,
        inviteeName: formData.name,
        email: formData.email || undefined,
        phoneNumber: formData.phone || undefined,
        quantity: 1,
      });
      
      if (res?.data?.success) {
        setIsAddOpen(false);
        setFormData({ name: "", email: "", phone: "" });
        fetchGuests();
      } else {
        setFormError("Failed to add guest. Check format (Phone needs +2519...)");
      }
    });
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    setFormError("");
    startTransition(async () => {
      const res = await updateInviteAction({
        invitationId: editGuest.id,
        inviteeName: formData.name,
        email: formData.email || "",
        phoneNumber: formData.phone || "",
      });
      
      if (res?.data?.success) {
        setEditGuest(null);
        setFormData({ name: "", email: "", phone: "" });
        fetchGuests();
      } else {
        setFormError("Failed to update guest. Check format (Phone needs +2519...)");
      }
    });
  }

  function openEditModal(guest: any) {
    setEditGuest(guest);
    setFormData({
      name: guest.inviteeName,
      email: guest.email || "",
      phone: guest.phoneNumber || "",
    });
    setFormError("");
  }

  if (!eventId) return null;

  return (
    <div className="flex flex-col gap-10 max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-hairline pb-8 gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Guest Management</h2>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            Search, filter, and manage your event attendees. Add new invites, update information, or send follow-up emails.
          </p>
        </div>
        <Button onClick={() => { setIsAddOpen(true); setFormData({name: "", email: "", phone: ""}); setFormError(""); }} className="btn-seal shadow-md gap-2">
          <UserCheck className="h-4 w-4" />
          Add Guest
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper p-4 rounded-2xl border border-hairline shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search by name, email, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 w-full bg-paper-raised border-hairline rounded-xl"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 items-center">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider mr-2 hidden md:inline-block">Filter:</span>
            <Button
              variant={!statusFilter ? "default" : "outline"}
              onClick={() => setStatusFilter(undefined)}
              className={!statusFilter ? "btn-seal rounded-xl" : "border-hairline bg-paper text-ink rounded-xl"}
              size="sm"
            >
              All
            </Button>
            {["PENDING", "ENTERED", "EXITED", "CANCELED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "btn-seal rounded-xl" : "border-hairline bg-paper text-ink rounded-xl"}
                size="sm"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-2xl overflow-hidden border border-hairline shadow-sm bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-paper border-b border-hairline text-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold">Guest Name</th>
                  <th className="px-6 py-4 font-semibold">Invite Code</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-seal mb-2" />
                      Loading guests...
                    </td>
                  </tr>
                ) : guests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-seal/10 text-seal flex items-center justify-center mb-3">
                        <Users className="h-5 w-5" />
                      </div>
                      No guests found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-seal/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-ink">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-seal/10 text-seal flex items-center justify-center font-bold text-xs shrink-0">
                            {guest.inviteeName.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{guest.inviteeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-muted bg-paper-raised/50 rounded-lg inline-block px-2 py-1 border border-hairline">
                          {guest.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted text-xs">
                        <div className="flex flex-col gap-0.5">
                          {guest.email ? <span>{guest.email}</span> : null}
                          {guest.phoneNumber ? <span>{guest.phoneNumber}</span> : null}
                          {!guest.email && !guest.phoneNumber ? <span className="opacity-50">—</span> : null}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2.5 py-0.5 font-semibold ${
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
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-seal/10 transition-colors focus-visible:outline-none focus:ring-2 focus:ring-seal">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-paper-raised border-hairline rounded-xl shadow-lg p-1">
                            <div className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">Update Status</div>
                            <DropdownMenuItem onClick={() => handleStatusChange(guest.id, "ENTERED")} disabled={isPending} className="cursor-pointer gap-2 rounded-lg">
                              <Check className="h-4 w-4 text-emerald" /> Check In
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(guest.id, "EXITED")} disabled={isPending} className="cursor-pointer gap-2 rounded-lg">
                              <UserCheck className="h-4 w-4 text-muted" /> Check Out
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(guest.id, "PENDING")} disabled={isPending} className="cursor-pointer gap-2 rounded-lg">
                              <Clock className="h-4 w-4 text-gold" /> Set to Pending
                            </DropdownMenuItem>
                            <div className="h-px bg-hairline my-1" />
                            <div className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">Manage</div>
                            <DropdownMenuItem onClick={() => openEditModal(guest)} disabled={isPending} className="cursor-pointer gap-2 rounded-lg">
                              <Edit2 className="h-4 w-4 text-seal" /> Edit Guest
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(guest.id)} disabled={isPending || !guest.email} className="cursor-pointer gap-2 rounded-lg">
                              <Mail className="h-4 w-4 text-seal" /> Send Email
                            </DropdownMenuItem>
                            <div className="h-px bg-hairline my-1" />
                            <DropdownMenuItem onClick={() => handleStatusChange(guest.id, "CANCELED")} disabled={isPending} className="cursor-pointer gap-2 text-red-500 focus:bg-red-500/10 rounded-lg">
                              <X className="h-4 w-4" /> Cancel Invite
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

      {/* Add / Edit Modals */}
      {(isAddOpen || editGuest) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="bg-paper card-surface w-full max-w-md rounded-2xl border border-hairline shadow-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-ink">
                {editGuest ? "Edit Guest Details" : "Add New Guest"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => { setIsAddOpen(false); setEditGuest(null); }} className="h-8 w-8 p-0 rounded-full text-muted hover:text-ink bg-paper-raised">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={editGuest ? handleEditSubmit : handleAddSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Full Name <span className="text-seal">*</span></label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" className="h-11 rounded-xl" autoFocus />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Email Address</label>
                <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="jane@example.com" className="h-11 rounded-xl" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Phone Number</label>
                <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+251912345678" className="h-11 rounded-xl font-mono text-sm" />
              </div>
              
              {formError && <p className="text-xs text-seal font-mono">{formError}</p>}
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-hairline">
                <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setEditGuest(null); }} className="rounded-xl border-hairline">Cancel</Button>
                <Button type="submit" disabled={isPending} className="btn-seal rounded-xl px-6">
                  {isPending ? "Saving..." : "Save Guest"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

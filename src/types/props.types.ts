import { authClient } from "@/lib/auth-client";

export interface SideBarProps {
  open: boolean;
  session: typeof authClient.$Infer.Session | null;
  onClose: () => void;
}

export interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}
export interface EventFormState {
  name: string;
  description: string;
  date: string;
  venueName: string;
  locationDescription: string;
  address: string;
  venueNotes: string;
}
export interface CardTemplateProps {
  eventName: string;
  date: string;
  venueName: string;
  inviterName?: string;
  guestName?: string;
}

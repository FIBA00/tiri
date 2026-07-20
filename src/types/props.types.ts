export interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

export interface WizardGuest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  source: "manual" | "excel";
}

export interface WizardEvent {
  name: string;
  description: string;
  date: string;
  venueName: string;
  locationDescription: string;
  address: string;
  venueNotes: string;
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

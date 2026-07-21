"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
export interface WizardEvent {
  name: string;
  description: string;
  date: string;
  venueName: string;
  locationDescription: string;
  address: string;
  venueNotes: string;
}
export interface WizardGuest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  source: "manual" | "excel";
}

interface WizardState {
  event: WizardEvent | null;
  guests: WizardGuest[];
  templateId: string | null;
  cardMode: "unique" | "shared";
}

interface WizardContextValue extends WizardState {
  setEvent: (event: WizardEvent) => void;
  addGuest: (guest: WizardGuest) => void;
  addGuests: (guests: WizardGuest[]) => void;
  removeGuest: (id: string) => void;
  setTemplate: (templateId: string, cardMode: "unique" | "shared") => void;
}

const STORAGE_KEY = "tiri-wizard-state";
const defaultState: WizardState = {
  event: null,
  guests: [],
  templateId: null,
  cardMode: "unique",
};
const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(function loadFromStorage() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(JSON.parse(raw));
      } catch (error) {
        // NOTE: corrupted state, fall back to defaults silently.
        // TODO: use logging system to send this error logs to central lgger.
      }
    }
    setHydrated(true);
  }, []);
  useEffect(
    function presistToStorage() {
      if (!hydrated) return;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    [state, hydrated],
  );

  // functions for controlling the events
  function setEvent(event: WizardEvent) {
    setState(function update(prev): WizardState {
      return { ...prev, event };
    });
  }
  function addGuest(guest: WizardGuest) {
    setState(function update(prev): WizardState {
      return { ...prev, guests: [...prev.guests, guest] };
    });
  }
  function addGuests(guests: WizardGuest[]) {
    setState(function update(prev): WizardState {
      return { ...prev, guests: [...prev.guests, ...guests] };
    });
  }
  function removeGuest(id: string) {
    setState(function update(prev): WizardState {
      return {
        ...prev,
        guests: prev.guests.filter(function keep(guest) {
          return guest.id !== id;
        }),
      };
    });
  }
  function setTemplate(templateId: string, cardMode: "unique" | "shared") {
    setState(function update(prev) {
      return { ...prev, templateId, cardMode };
    });
  }

  return (
    <WizardContext.Provider
      value={{
        ...state,
        setEvent,
        addGuest,
        addGuests,
        removeGuest,
        setTemplate,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}

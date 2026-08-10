"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface WizardEvent {
  name: string;
  description: string;
  date: string;
  time?: string;
  venueName: string;
  locationDescription: string;
  address: string;
  venueNotes: string;
  latitude?: number | null;
  longitude?: number | null;
  checkInPin?: string;
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
  templateHtml: string | null;
  cardMode: "unique" | "shared";
}

interface WizardContextValue extends WizardState {
  setEvent: (event: WizardEvent) => void;
  addGuest: (guest: WizardGuest) => void;
  addGuests: (guests: WizardGuest[]) => void;
  removeGuest: (id: string) => void;
  setTemplate: (templateId: string | null, templateHtml?: string | null) => void;
  updateGuest: (id: string, patch: Partial<WizardGuest>) => void;
  resetWizard: () => void;
}

const STORAGE_KEY = "tiri-wizard-state";

const defaultState: WizardState = {
  event: null,
  guests: [],
  templateId: null,
  templateHtml: null,
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
        setState(JSON.parse(raw));
      } catch (error) {
        console.error("Corrupted wizard state", error);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(
    function persistToStorage() {
      if (!hydrated) return;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    [state, hydrated],
  );

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

  function updateGuest(id: string, patch: Partial<WizardGuest>) {
    setState(function update(prev): WizardState {
      return {
        ...prev,
        guests: prev.guests.map(function apply(guest) {
          return guest.id === id ? { ...guest, ...patch } : guest;
        }),
      };
    });
  }

  function setTemplate(templateId: string | null, templateHtml?: string | null) {
    setState(function update(prev) {
      return { ...prev, templateId, templateHtml: templateHtml ?? null };
    });
  }

  function resetWizard() {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
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
        updateGuest,
        resetWizard,
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

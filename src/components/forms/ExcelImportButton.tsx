"use client";

import React, { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { WizardGuest } from "@/types/props.types.ts";
import { useWizard } from "@/lib/wizard-context.tsx";

interface RawRow {
  Name?: string;
  Email?: string;
  Phone?: string;
}

export default function ExcelImportButton() {
  const { addGuests } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    try {
      const buffer = await file.arrayBuffer();
      const workBook = read(buffer);
      const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
      const rows = utils.sheet_to_join<RawRow>(firstSheet);

      const guests: WizardGuest[] = rows
        .filter(function hasName(
          row: RawRow,
        ): row is RawRow & { Name: string } {
          return Boolean(row.Name && row.Name.trim());
        })
        .map(function toGuest(row: RawRow): WizardGuest {
          return {
            id: crypto.randomUUID(),
            name: row.Name!.trim(),
            email: row.Email?.trim() || undefined,
            phone: row.Phone?.trim() || undefined,
            source: "excel" as const,
          };
        });
      if (guests.length === 0) {
        setError("No valid rows found  - expected a 'Name' column ");
        return;
      }
      addGuests(guests);
    } catch {
      setError("couldnt read that file. make sure it's i)s a valid .xlsx file");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="hidden"
        id="excel-import"
      />
      <label htmlFor="excel-import" className="btn-ghost cursor-pointer">
        Import from Excel
      </label>
      {error ? (
        <p className="mt-2 font-mono text-xs text-seal">{error}</p>
      ) : null}
    </div>
  );
}

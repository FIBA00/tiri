"use client";

import React, { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { guestRowSchema } from "@/lib/schemas/guest.schema.ts";
import { useWizard, type WizardGuest } from "@/lib/wizard-context";
import { generateId } from "@/lib/id.ts";

interface RawRow {
  Name?: string;
  Email?: string;
  Phone?: string;
}
function toGuest(row: {
  Name: string;
  Email?: string;
  Phone?: string;
}): WizardGuest {
  return {
    id: generateId(),
    name: row.Name,
    email: row.Email || undefined,
    phone: row.Phone || undefined,
    source: "excel",
  };
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
      const rows = utils.sheet_to_json<RawRow>(firstSheet);

      const guests: WizardGuest[] = [];
      let skipped = 0;

      for (const row of rows) {
        const result = guestRowSchema.safeParse(row);
        if (!result.success) {
          skipped++;
          continue;
        }
        guests.push(toGuest(result.data));
      }
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

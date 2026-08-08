"use client";

import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import { guestRowSchema } from "@/lib/schemas/guest.schema";
import { useWizard, type WizardGuest } from "@/lib/wizard-context";
import { generateId } from "@/lib/id";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface RawRow {
  Name?: string;
  Email?: string;
  Phone?: string;
}

function ToGuest(row: { Name: string; Email?: string; Phone?: string }): WizardGuest {
  return {
    id: generateId(),
    name: row.Name,
    email: row.Email || undefined,
    phone: row.Phone || undefined,
    source: "excel",
  };
}

export function ExcelImportButton() {
  const { addGuests } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function HandleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");

    try {
      const buffer = await file.arrayBuffer();
      const workBook = read(buffer);
      const firstSheet = workBook.Sheets[workBook.SheetNames[0]];
      const rows = utils.sheet_to_json<RawRow>(firstSheet);

      const guestsList: WizardGuest[] = [];
      let skippedCount = 0;

      for (const row of rows) {
        const result = guestRowSchema.safeParse(row);
        if (!result.success) {
          skippedCount++;
          continue;
        }
        guestsList.push(ToGuest(result.data));
      }

      if (guestsList.length === 0) {
        setErrorMsg("No valid rows found. Sheet must contain a 'Name' column.");
        return;
      }

      addGuests(guestsList);
    } catch {
      setErrorMsg("Could not read file. Ensure it is a valid .xlsx file.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={HandleFile}
        className="hidden"
        id="excel-import-input"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-xl border-hairline text-xs font-medium text-ink hover:bg-seal/10"
      >
        <Upload className="h-3.5 w-3.5" />
        Import from Excel
      </Button>
      {errorMsg ? <p className="font-mono text-xs text-seal">{errorMsg}</p> : null}
    </div>
  );
}

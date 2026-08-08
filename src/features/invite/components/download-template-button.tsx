"use client";

import { utils, write } from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadTemplateButton() {
  function HandleDownload() {
    const sampleData = [
      { Name: "Abebe Bikila", Email: "abebe@example.com", Phone: "+251911223344" },
      { Name: "Tigist Assefa", Email: "tigist@example.com", Phone: "+251922334455" },
    ];

    const worksheet = utils.json_to_sheet(sampleData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Guests");

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tiri-guest-list-template.xlsx";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={HandleDownload}
      className="inline-flex items-center gap-1.5 rounded-xl border-hairline text-xs font-medium text-muted hover:text-ink"
    >
      <Download className="h-3.5 w-3.5" />
      Download Excel Template
    </Button>
  );
}

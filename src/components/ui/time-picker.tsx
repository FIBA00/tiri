"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour24, minute] = (value || "12:00").split(":");
  const h24 = parseInt(hour24, 10) || 0;
  
  const isPM = h24 >= 12;
  const ampm = isPM ? "PM" : "AM";

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.value is in HH:mm (24-hour format)
    onChange(e.target.value);
  };

  const handleAmPmChange = (newAmPm: string | null) => {
    if (!newAmPm) return;
    let h = parseInt(hour24, 10);
    if (newAmPm === "PM" && h < 12) h += 12;
    if (newAmPm === "AM" && h >= 12) h -= 12;
    
    onChange(`${h.toString().padStart(2, "0")}:${minute || "00"}`);
  };

  return (
    <div className={`flex items-center gap-3 w-full ${className || ""}`}>
      <div className="relative flex-1">
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-seal pointer-events-none" />
        <Input
          type="time"
          value={value || "12:00"}
          onChange={handleTimeChange}
          className="pl-12 h-12 bg-paper border-hairline rounded-xl text-lg w-full"
        />
      </div>
      <Select value={ampm} onValueChange={handleAmPmChange}>
        <SelectTrigger className="w-[100px] h-12 bg-paper border-hairline rounded-xl text-lg">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

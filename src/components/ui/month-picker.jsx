import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function MonthPicker({ value, onChange, placeholder = "Pilih bulan", disabled, className }) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value + "-01") : null;
  const [year, setYear] = useState(parsed ? parsed.getFullYear() : new Date().getFullYear());
  const [month, setMonth] = useState(parsed ? parsed.getMonth() : 0);

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 10; y <= currentYear + 2; y++) years.push(y);

  const handleSelect = () => {
    const result = `${year}-${String(month + 1).padStart(2, "0")}`;
    onChange(result);
    setOpen(false);
  };

  const displayText = parsed
    ? format(parsed, "MMMM yyyy", { locale: id })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setYear((y) => y + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, i) => (
              <Button
                key={i}
                variant={month === i ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setMonth(i)}
              >
                {m.slice(0, 3)}
              </Button>
            ))}
          </div>
          <Button size="sm" className="w-full" onClick={handleSelect}>
            Pilih
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

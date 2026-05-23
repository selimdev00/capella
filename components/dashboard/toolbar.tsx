"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ROLES, GENDERS } from "@/lib/types";
import { titleCase } from "@/lib/format";

const ALL = "all";

export interface ToolbarProps {
  q: string;
  role: string | null;
  gender: string | null;
  hasFilters: boolean;
  onChange: (patch: {
    q?: string;
    role?: string | null;
    gender?: string | null;
  }) => void;
  onClear: () => void;
}

export function Toolbar({
  q,
  role,
  gender,
  hasFilters,
  onChange,
  onClear,
}: ToolbarProps) {
  // Local mirror so typing stays responsive; the URL updates after a debounce.
  const [search, setSearch] = React.useState(q);
  const [prevQ, setPrevQ] = React.useState(q);

  // Sync when the URL changes externally (back button, Clear) - adjusting
  // state during render is the recommended pattern over an effect.
  if (q !== prevQ) {
    setPrevQ(q);
    setSearch(q);
  }

  React.useEffect(() => {
    if (search === q) return;
    const id = setTimeout(() => onChange({ q: search }), 300);
    return () => clearTimeout(id);
  }, [search, q, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any field - name, email, phone, company, city..."
          aria-label="Search users"
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={role ?? ALL}
          onValueChange={(v) => onChange({ role: v === ALL ? null : v })}
        >
          <SelectTrigger
            className="min-w-0 flex-1 sm:w-[150px] sm:flex-none"
            aria-label="Filter by role"
          >
            <span className="truncate">
              <span className="text-muted-foreground">Role:</span>{" "}
              {role ? titleCase(role) : "All"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {titleCase(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={gender ?? ALL}
          onValueChange={(v) => onChange({ gender: v === ALL ? null : v })}
        >
          <SelectTrigger
            className="min-w-0 flex-1 sm:w-[150px] sm:flex-none"
            aria-label="Filter by gender"
          >
            <span className="truncate">
              <span className="text-muted-foreground">Gender:</span>{" "}
              {gender ? titleCase(gender) : "All"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All genders</SelectItem>
            {GENDERS.map((g) => (
              <SelectItem key={g} value={g}>
                {titleCase(g)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

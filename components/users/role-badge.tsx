import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { titleCase } from "@/lib/format";
import type { Role } from "@/lib/types";

const ROLE_STYLES: Record<Role, string> = {
  admin:
    "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  moderator:
    "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  user: "border-transparent bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

const ROLE_DOT: Record<Role, string> = {
  admin: "bg-rose-500",
  moderator: "bg-amber-500",
  user: "bg-sky-500",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant="outline" className={ROLE_STYLES[role]}>
      {titleCase(role)}
    </Badge>
  );
}

/** Compact role indicator for dense table rows: colored dot + label. */
export function RoleDot({ role }: { role: Role }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-1.5 rounded-full", ROLE_DOT[role])} />
      {titleCase(role)}
    </span>
  );
}

"use client";

import { useQueryStates } from "nuqs";
import { usersParsers } from "@/lib/users-params";
import { Toolbar } from "./toolbar";
import type { Role, Gender } from "@/lib/types";

/** Search + role/gender filters, hosted in the sticky header. */
export function HeaderFilters() {
  const [params, setParams] = useQueryStates(usersParsers, { shallow: false });

  const hasFilters =
    params.q !== "" || params.role !== null || params.gender !== null;

  const onChange = (patch: {
    q?: string;
    role?: string | null;
    gender?: string | null;
  }) => {
    setParams({
      ...(patch.q !== undefined ? { q: patch.q } : {}),
      ...(patch.role !== undefined ? { role: patch.role as Role | null } : {}),
      ...(patch.gender !== undefined
        ? { gender: patch.gender as Gender | null }
        : {}),
      page: 1,
    });
  };

  const onClear = () => setParams({ q: "", role: null, gender: null, page: 1 });

  return (
    <Toolbar
      q={params.q}
      role={params.role}
      gender={params.gender}
      hasFilters={hasFilters}
      onChange={onChange}
      onClear={onClear}
    />
  );
}

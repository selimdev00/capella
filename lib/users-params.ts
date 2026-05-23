// Parsers come from "nuqs/server" so this module is safe on both the server
// loader and the client `useQueryStates`.
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import {
  SORT_KEYS,
  PAGE_SIZES,
  DEFAULT_SORT,
  DEFAULT_ORDER,
  DEFAULT_PAGE_SIZE,
  type PageSize,
  type UserQuery,
} from "@/lib/query";
import { ROLES, GENDERS } from "@/lib/types";

export const ORDERS = ["asc", "desc"] as const;

/**
 * Isomorphic URL-state parsers - the single source of truth shared by the
 * client controls (`useQueryStates`) and the server loader. The URL is the
 * canonical, shareable state for the dashboard.
 */
export const usersParsers = {
  q: parseAsString.withDefault(""),
  role: parseAsStringLiteral(ROLES), // null = no filter
  gender: parseAsStringLiteral(GENDERS),
  // null sort/order = the "initial" unsorted state (table still defaults to name asc).
  sort: parseAsStringLiteral(SORT_KEYS),
  order: parseAsStringLiteral(ORDERS),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export type ParsedUsersParams = {
  q: string;
  role: (typeof ROLES)[number] | null;
  gender: (typeof GENDERS)[number] | null;
  sort: (typeof SORT_KEYS)[number] | null;
  order: (typeof ORDERS)[number] | null;
  page: number;
  pageSize: number;
};

/** Normalise raw URL values into a validated `UserQuery` for the query layer. */
export function toUserQuery(parsed: ParsedUsersParams): UserQuery {
  const pageSize: PageSize = (PAGE_SIZES as readonly number[]).includes(
    parsed.pageSize,
  )
    ? (parsed.pageSize as PageSize)
    : DEFAULT_PAGE_SIZE;

  return {
    q: parsed.q,
    role: parsed.role,
    gender: parsed.gender,
    sort: parsed.sort ?? DEFAULT_SORT,
    order: parsed.order ?? DEFAULT_ORDER,
    page: Math.max(1, parsed.page),
    pageSize,
  };
}

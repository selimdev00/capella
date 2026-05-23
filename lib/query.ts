import type { User } from "./types";

/**
 * Client-agnostic query layer.
 *
 * dummyjson exposes search, filter and sort as *separate* single-axis
 * endpoints that can't be combined in one request. Since the dataset is small
 * and bounded (208 users), we fetch it once upstream and compose
 * search + filter + sort + pagination here, in one pure, testable place.
 * For a large/unbounded dataset this logic would move to the API or a DB.
 */

export const SORT_KEYS = [
  "name",
  "age",
  "email",
  "company",
  "city",
  "role",
  "gender",
] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export type SortOrder = "asc" | "desc";

export const PAGE_SIZES = [10, 25, 50] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 10;
export const DEFAULT_SORT: SortKey = "name";
export const DEFAULT_ORDER: SortOrder = "asc";

export interface UserQuery {
  q: string;
  role: string | null;
  gender: string | null;
  sort: SortKey;
  order: SortOrder;
  page: number;
  pageSize: PageSize;
}

export const DEFAULT_QUERY: UserQuery = {
  q: "",
  role: null,
  gender: null,
  sort: DEFAULT_SORT,
  order: DEFAULT_ORDER,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export interface QueryResult {
  rows: User[];
  total: number; // matches after search + filter, before pagination
  page: number;
  pageSize: number;
  pageCount: number;
}

const sortValue = (user: User, key: SortKey): string | number => {
  switch (key) {
    case "name":
      return `${user.firstName} ${user.lastName}`.toLowerCase();
    case "age":
      return user.age;
    case "email":
      return user.email.toLowerCase();
    case "company":
      return user.company.name.toLowerCase();
    case "city":
      return user.address.city.toLowerCase();
    case "role":
      return user.role;
    case "gender":
      return user.gender;
  }
};

const matchesSearch = (user: User, q: string): boolean => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    user.firstName,
    user.lastName,
    user.maidenName,
    user.email,
    user.username,
    user.phone,
    user.role,
    user.gender,
    String(user.age),
    user.bloodGroup,
    user.eyeColor,
    user.university,
    user.company.name,
    user.company.title,
    user.company.department,
    user.address.city,
    user.address.state,
    user.address.country,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
};

const compare = (a: string | number, b: string | number): number => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
};

/**
 * Apply search + role/gender filters (no sort/pagination). Shared by the table
 * and the overview, so stats + charts reflect the same filtered set as rows.
 */
export function filterUsers(users: User[], query: UserQuery): User[] {
  return users.filter(
    (u) =>
      matchesSearch(u, query.q) &&
      (query.role === null || u.role === query.role) &&
      (query.gender === null || u.gender === query.gender),
  );
}

/** Sort + paginate an already-filtered set. */
export function sortAndPaginate(
  users: User[],
  query: UserQuery,
): QueryResult {
  const dir = query.order === "asc" ? 1 : -1;
  const sorted = [...users].sort(
    (a, b) => dir * compare(sortValue(a, query.sort), sortValue(b, query.sort)),
  );

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const start = (page - 1) * query.pageSize;
  const rows = sorted.slice(start, start + query.pageSize);

  return { rows, total, page, pageSize: query.pageSize, pageCount };
}

/** Apply search + filters + sort + pagination over the full dataset. */
export function queryUsers(users: User[], query: UserQuery): QueryResult {
  return sortAndPaginate(filterUsers(users, query), query);
}

/** Aggregate stats for the dashboard overview, computed once per request. */
export interface UserStats {
  total: number;
  byRole: Record<string, number>;
  byGender: Record<string, number>;
  averageAge: number;
}

export function computeStats(users: User[]): UserStats {
  const byRole: Record<string, number> = {};
  const byGender: Record<string, number> = {};
  let ageSum = 0;

  for (const u of users) {
    byRole[u.role] = (byRole[u.role] ?? 0) + 1;
    byGender[u.gender] = (byGender[u.gender] ?? 0) + 1;
    ageSum += u.age;
  }

  return {
    total: users.length,
    byRole,
    byGender,
    averageAge: users.length ? Math.round(ageSum / users.length) : 0,
  };
}

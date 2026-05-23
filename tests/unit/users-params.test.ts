import { describe, it, expect } from "vitest";
import { toUserQuery } from "@/lib/users-params";

const base = {
  q: "",
  role: null,
  gender: null,
  sort: "name" as const,
  order: "asc" as const,
  page: 1,
  pageSize: 10,
};

describe("toUserQuery", () => {
  it("passes through valid values", () => {
    const q = toUserQuery({ ...base, q: "bob", role: "admin", pageSize: 25 });
    expect(q.q).toBe("bob");
    expect(q.role).toBe("admin");
    expect(q.pageSize).toBe(25);
  });

  it("falls back to the default page size for unsupported values", () => {
    expect(toUserQuery({ ...base, pageSize: 999 }).pageSize).toBe(10);
  });

  it("clamps page to at least 1", () => {
    expect(toUserQuery({ ...base, page: 0 }).page).toBe(1);
    expect(toUserQuery({ ...base, page: -5 }).page).toBe(1);
  });
});

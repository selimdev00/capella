import { describe, it, expect } from "vitest";
import { queryUsers, computeStats, DEFAULT_QUERY } from "@/lib/query";
import { makeUser } from "../fixtures";

const users = [
  makeUser({
    id: 1,
    firstName: "Alice",
    lastName: "Adams",
    age: 40,
    role: "admin",
    gender: "female",
    company: { name: "Zeta", department: "X", title: "CTO" },
  }),
  makeUser({
    id: 2,
    firstName: "Bob",
    lastName: "Brown",
    age: 25,
    role: "user",
    gender: "male",
    company: { name: "Alpha", department: "Y", title: "Dev" },
  }),
  makeUser({
    id: 3,
    firstName: "Carol",
    lastName: "Clark",
    age: 33,
    role: "moderator",
    gender: "female",
    email: "carol@work.com",
  }),
  makeUser({
    id: 4,
    firstName: "Dave",
    lastName: "Davis",
    age: 33,
    role: "user",
    gender: "male",
  }),
];

describe("queryUsers", () => {
  it("returns all rows with the default query", () => {
    const res = queryUsers(users, DEFAULT_QUERY);
    expect(res.total).toBe(4);
    expect(res.rows).toHaveLength(4);
  });

  it("searches across name, email and company", () => {
    expect(queryUsers(users, { ...DEFAULT_QUERY, q: "alice" }).total).toBe(1);
    expect(queryUsers(users, { ...DEFAULT_QUERY, q: "carol@work" }).total).toBe(
      1,
    );
    expect(queryUsers(users, { ...DEFAULT_QUERY, q: "alpha" }).total).toBe(1);
  });

  it("filters by role and gender, and composes them with search", () => {
    expect(queryUsers(users, { ...DEFAULT_QUERY, role: "user" }).total).toBe(2);
    expect(
      queryUsers(users, { ...DEFAULT_QUERY, gender: "female" }).total,
    ).toBe(2);
    expect(
      queryUsers(users, { ...DEFAULT_QUERY, gender: "male", role: "user" })
        .total,
    ).toBe(2);
    expect(
      queryUsers(users, { ...DEFAULT_QUERY, q: "bob", role: "user" }).total,
    ).toBe(1);
  });

  it("sorts by name descending", () => {
    const res = queryUsers(users, {
      ...DEFAULT_QUERY,
      sort: "name",
      order: "desc",
    });
    expect(res.rows.map((u) => u.firstName)).toEqual([
      "Dave",
      "Carol",
      "Bob",
      "Alice",
    ]);
  });

  it("sorts numerically by age", () => {
    const res = queryUsers(users, {
      ...DEFAULT_QUERY,
      sort: "age",
      order: "asc",
    });
    expect(res.rows.map((u) => u.age)).toEqual([25, 33, 33, 40]);
  });

  it("paginates and clamps an out-of-range page", () => {
    const page1 = queryUsers(users, {
      ...DEFAULT_QUERY,
      pageSize: 10,
      page: 1,
    });
    expect(page1.pageCount).toBe(1);

    const small = queryUsers(users, {
      ...DEFAULT_QUERY,
      pageSize: 10,
      page: 99,
    });
    // PAGE_SIZES only allows 10/25/50; with 4 users that is one page.
    expect(small.page).toBe(1);
    expect(small.rows).toHaveLength(4);
  });

  it("returns an empty result when nothing matches", () => {
    const res = queryUsers(users, { ...DEFAULT_QUERY, q: "zzz-nope" });
    expect(res.total).toBe(0);
    expect(res.rows).toHaveLength(0);
    expect(res.pageCount).toBe(1);
  });
});

describe("computeStats", () => {
  it("aggregates totals, role/gender counts and average age", () => {
    const stats = computeStats(users);
    expect(stats.total).toBe(4);
    expect(stats.byRole).toEqual({ admin: 1, user: 2, moderator: 1 });
    expect(stats.byGender).toEqual({ female: 2, male: 2 });
    expect(stats.averageAge).toBe(Math.round((40 + 25 + 33 + 33) / 4));
  });

  it("handles an empty dataset", () => {
    expect(computeStats([])).toEqual({
      total: 0,
      byRole: {},
      byGender: {},
      averageAge: 0,
    });
  });
});

import { describe, it, expect } from "vitest";
import { UserSchema, UsersResponseSchema } from "@/lib/types";
import { makeUser } from "../fixtures";

describe("UserSchema", () => {
  it("parses a valid user", () => {
    const user = makeUser({ id: 7, role: "admin" });
    expect(UserSchema.parse(user).role).toBe("admin");
  });

  it("falls back to 'user' for an unknown role instead of failing", () => {
    const raw = { ...makeUser({ id: 8 }), role: "superadmin" };
    expect(UserSchema.parse(raw).role).toBe("user");
  });

  it("rejects a payload missing required fields", () => {
    expect(() => UserSchema.parse({ id: 1, firstName: "x" })).toThrow();
  });
});

describe("UsersResponseSchema", () => {
  it("parses the list envelope", () => {
    const res = UsersResponseSchema.parse({
      users: [makeUser({ id: 1 }), makeUser({ id: 2 })],
      total: 2,
      skip: 0,
      limit: 30,
    });
    expect(res.users).toHaveLength(2);
    expect(res.total).toBe(2);
  });
});

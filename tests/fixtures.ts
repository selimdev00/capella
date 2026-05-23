import type { User } from "@/lib/types";

let nextId = 1;

/** Build a minimal valid User, overriding only the fields a test cares about. */
export function makeUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? nextId++;
  return {
    id,
    firstName: "Jane",
    lastName: "Doe",
    maidenName: "",
    age: 30,
    gender: "female",
    email: `user${id}@example.com`,
    phone: "+1 555-0100",
    username: `user${id}`,
    image: "https://dummyjson.com/icon/user/128",
    role: "user",
    address: {
      address: "1 Main St",
      city: "Denver",
      state: "Colorado",
      postalCode: "80014",
      country: "United States",
    },
    company: {
      department: "Engineering",
      name: "Acme Inc",
      title: "Engineer",
    },
    ...overrides,
  };
}

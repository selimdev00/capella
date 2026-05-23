import { z } from "zod";

/**
 * Zod schemas for the dummyjson `/users` API.
 *
 * We only declare the fields the dashboard actually consumes and let unknown
 * keys be stripped. Validating at the network boundary means the rest of the
 * app works against trusted, typed data instead of `any` from `res.json()`.
 */

export const ROLES = ["admin", "moderator", "user"] as const;
export type Role = (typeof ROLES)[number];

export const GENDERS = ["female", "male"] as const;
export type Gender = (typeof GENDERS)[number];

const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const AddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string().optional(),
  postalCode: z.string(),
  country: z.string(),
  coordinates: CoordinatesSchema.optional(),
});

const CompanySchema = z.object({
  department: z.string(),
  name: z.string(),
  title: z.string(),
});

const BankSchema = z.object({
  cardExpire: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  currency: z.string(),
  iban: z.string(),
});

const HairSchema = z.object({
  color: z.string(),
  type: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string().optional().default(""),
  age: z.number(),
  // Kept permissive: filtering derives the option list from the data itself.
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  image: z.string(),
  birthDate: z.string().optional(),
  bloodGroup: z.string().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  eyeColor: z.string().optional(),
  hair: HairSchema.optional(),
  university: z.string().optional(),
  // Unknown roles fall back to "user" rather than failing the whole parse.
  role: z.enum(ROLES).catch("user"),
  address: AddressSchema,
  company: CompanySchema,
  bank: BankSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()).default([]),
  reactions: z.object({ likes: z.number(), dislikes: z.number() }).optional(),
});
export type Post = z.infer<typeof PostSchema>;

export const PostsResponseSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),
});

export const TodoSchema = z.object({
  id: z.number(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.number(),
});
export type Todo = z.infer<typeof TodoSchema>;

export const TodosResponseSchema = z.object({
  todos: z.array(TodoSchema),
  total: z.number(),
});

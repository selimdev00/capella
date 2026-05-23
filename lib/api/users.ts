import {
  UsersResponseSchema,
  UserSchema,
  PostsResponseSchema,
  TodosResponseSchema,
  type User,
  type Post,
  type Todo,
} from "@/lib/types";

const BASE_URL = "https://dummyjson.com";

// The dataset is static, so cache the upstream responses and revalidate hourly.
const REVALIDATE_SECONDS = 60 * 60;

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson(path: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status);
  }
  return res.json();
}

/**
 * The full user list. dummyjson returns everything with `limit=0`; we pull it
 * once and let the query layer compose search/filter/sort/pagination locally.
 */
export async function getAllUsers(): Promise<User[]> {
  const data = await fetchJson("/users?limit=0");
  return UsersResponseSchema.parse(data).users;
}

/** A single user, or `null` for an unknown id (so the route can 404 cleanly). */
export async function getUserById(id: number): Promise<User | null> {
  try {
    const data = await fetchJson(`/users/${id}`);
    return UserSchema.parse(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getUserPosts(id: number): Promise<Post[]> {
  const data = await fetchJson(`/users/${id}/posts`);
  return PostsResponseSchema.parse(data).posts;
}

export async function getUserTodos(id: number): Promise<Todo[]> {
  const data = await fetchJson(`/users/${id}/todos`);
  return TodosResponseSchema.parse(data).todos;
}

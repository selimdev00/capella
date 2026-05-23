import { createLoader } from "nuqs/server";
import { usersParsers } from "@/lib/users-params";

export const loadUsersSearchParams = createLoader(usersParsers);

export { toUserQuery } from "@/lib/users-params";

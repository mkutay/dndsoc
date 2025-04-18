import { getUserByUsername } from "@/lib/users/query-username";
import { getDMByUuid } from "./query-uuid";

export const getDMByUsername = (username: string) => 
  getUserByUsername(username)
    .andThen((user) => getDMByUuid(user.auth_user_uuid))
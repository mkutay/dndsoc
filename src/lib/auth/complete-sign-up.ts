import { ResultAsync } from "neverthrow";

import { insertPlayer } from "@/lib/players";
import { insertUser } from "@/lib/users";
import { insertRole } from "@/lib/roles";
import { getUser } from "./user";

/**
 * Signed up and authenticated user, so insert role and player into database
 * by getting the userid from the username.
 */
export const completeSignUp = () => {
  const user = getUser();

  const insertedUser = user.andThen((user) => insertUser({
    username: user.user_metadata.username,
    knumber: user.user_metadata.knumber,
    auth_user_uuid: user.id,
  }));

  const insertedRole = user.andThen((user) => insertRole({
    role: "player",
    auth_user_uuid: user.id,
  }));

  const insertedPlayer = user.andThen((user) => insertPlayer({
    auth_user_uuid: user.id,
    level: 1,
  }));

  return ResultAsync.combine([insertedUser, insertedRole, insertedPlayer]);
};
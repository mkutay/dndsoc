"use server";

import { getUser } from "@/lib/auth";

export const isLoggedInAction = async () => {
  const user = await getUser();
  if (user.isOk()) {
    return true;
  } else {
    return false;
  }
};

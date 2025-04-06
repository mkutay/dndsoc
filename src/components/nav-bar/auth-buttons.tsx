import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/users/user";
import { signOut } from "./action";

export default async function AuthButtons() {
  const userResult = await getUser();
  if (userResult.isErr()) {
    console.error(userResult.error.message);
    return null;
  }

  const user = userResult.value;
  
  return user ? (
    <div className="flex items-center">
      <form action={signOut}>
        <Button variant={"outline"} type="submit">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/user";
import { signOut } from "@/lib/auth/sign-out";

export default async function AuthButtons() {
  const user = await getUser();
  
  return user.isOk() ? (
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

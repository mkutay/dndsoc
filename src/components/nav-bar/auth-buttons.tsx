"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
// import { signOutAction } from "@/server/auth/sign-out";

export function AuthButtons({
  user
}: {
  user: boolean;
}) {
  return user ? (
    <Button variant={"outline"} type="submit" size="sm">
      Sign out
    </Button>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}

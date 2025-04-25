"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import Server from "@/server/server";

export function AuthButtons({
  user
}: {
  user: boolean;
}) {
  const onSubmit = async () => {
    await Server.Auth.SignOut();
  };

  return user ? (
    <Button variant={"outline"} type="submit" size="sm" onClick={onSubmit}>
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

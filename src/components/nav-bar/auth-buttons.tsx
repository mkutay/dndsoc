"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/server/auth/sign-out";

export function AuthButtons({ loggedIn, setLoggedIn }: { loggedIn: boolean; setLoggedIn: (value: boolean) => void }) {
  return loggedIn ? (
    <Button
      variant="outline"
      type="submit"
      size="sm"
      onClick={async () => {
        setLoggedIn(false);
        await signOutAction();
      }}
    >
      Sign out
    </Button>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}

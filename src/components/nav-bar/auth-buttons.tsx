"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AuthButtons() {
  const { isLoggedIn, signOut } = useAuth();

  return isLoggedIn ? (
    <Button variant="outline" type="submit" size="sm" onClick={signOut} className="cursor-pointer">
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

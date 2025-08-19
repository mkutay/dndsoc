"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/styling";

export function AuthButtons() {
  const { isLoggedIn, signOut } = useAuth();

  return (
    <div className="flex gap-2" suppressHydrationWarning>
      <Button
        asChild
        size="sm"
        variant="outline"
        className={isLoggedIn ? "hidden" : "inline-flex"}
        id="sign-in-button"
        suppressHydrationWarning
      >
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={isLoggedIn ? "hidden" : "inline-flex"}
        id="sign-up-button"
        suppressHydrationWarning
      >
        <Link href="/sign-up">Sign Up</Link>
      </Button>
      <Button
        variant="outline"
        type="submit"
        size="sm"
        onClick={signOut}
        className={cn("cursor-pointer", isLoggedIn ? "inline-flex" : "hidden")}
        id="sign-out-button"
        suppressHydrationWarning
      >
        Sign Out
      </Button>
    </div>
  );
}

"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TypographyHr } from "@/components/typography/blockquote";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";

export function NavBarSheet() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, signOut } = useAuth();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    handleLinkClick();
    await signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="dropdown menu for linking the website">
          <HamburgerMenuIcon stroke="currentColor" strokeWidth="1px" />
        </Button>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Navigate</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <Button key={index} variant="outline" className="w-full text-left" asChild>
              <Link href={item.href} onClick={handleLinkClick}>
                {item.label}
              </Link>
            </Button>
          ))}
          <TypographyHr />
          {isLoggedIn ? (
            <Button variant="secondary" type="submit" className="w-full cursor-pointer" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/sign-in" onClick={handleLinkClick}>
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="default" className="w-full">
                <Link href="/sign-up" onClick={handleLinkClick}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

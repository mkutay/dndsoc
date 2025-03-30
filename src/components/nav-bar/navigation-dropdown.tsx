"use client";

import { useState } from "react";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";

export function NavigationDropdown() {
  const [triggered, setTriggered] = useState(false);
  return (
    <DropdownMenu onOpenChange={() => setTriggered(triggered ? false : true)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="dropdown menu for linking the website">
          {triggered === true ? (
            <Cross1Icon stroke="currentColor" strokeWidth="1px"/>
          ) : (
            <HamburgerMenuIcon stroke="currentColor" strokeWidth="1px"/>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {siteConfig.navItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="text-md font-medium">
            <Link
              href={`${item.href}`}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
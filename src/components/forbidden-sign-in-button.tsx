"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "./ui/button";
import { cn } from "@/utils/styling";

export function ForbiddenSignInButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  return (
    <Button asChild className={cn("w-fit", className)}>
      <Link href={`/sign-in?redirect=${pathname}`}>{children}</Link>
    </Button>
  );
}

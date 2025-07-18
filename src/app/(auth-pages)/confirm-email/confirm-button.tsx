"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ConfirmButton() {
  const searchParams = useSearchParams();
  const pathname = "/auth/confirm?" + new URLSearchParams(searchParams.toString());
  return (
    <Button className="w-fit mt-6" variant="default">
      <Link href={pathname} prefetch={false}>
        Confirm!
      </Link>
    </Button>
  );
}

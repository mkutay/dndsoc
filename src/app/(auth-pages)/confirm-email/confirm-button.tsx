"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ConfirmButton() {
  const searchParams = useSearchParams();
  const pathname = "/auth/confirm?" + new URLSearchParams(searchParams.toString());
  const router = useRouter();
  return (
    <Button
      className="w-fit mt-6"
      variant="default"
      onClick={() => {
        router.push(pathname);
      }}
    >
      Confirm!
    </Button>
  );
}

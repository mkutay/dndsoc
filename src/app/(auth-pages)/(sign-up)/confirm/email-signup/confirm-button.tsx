"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ConfirmButton({ pathname }: { pathname: string }) {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        router.push(pathname);
      }}
    >
      Continue!
    </Button>
  );
}

"use client";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { env } from "@/env";

export function ConfirmButton({ tokenHash, type }: { tokenHash: string; type: EmailOtpType }) {
  const router = useRouter();
  const url = new URL(env.NEXT_PUBLIC_SITE_URL + "/complete-invite");

  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", type);

  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        router.push(url.toString());
      }}
    >
      Continue!
    </Button>
  );
}

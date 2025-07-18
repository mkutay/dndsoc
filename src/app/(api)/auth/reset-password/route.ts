import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { verifyOtp } from "@/lib/auth";
import { env } from "@/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Verify OTP and redirect accordingly
  if (tokenHash && type === "recovery") {
    const verified = await verifyOtp({ type, tokenHash });
    if (verified.isErr()) {
      const errorMessage = "Error exchanging code for session: " + verified.error.message;
      console.error(errorMessage);
      return NextResponse.redirect(`${origin}/error?error=Could not verify. Maybe the link had expired?`);
    }

    return NextResponse.redirect(`${origin}/reset-password`);
  }

  return NextResponse.redirect(`${origin}/error?error=Invalid request`);
}

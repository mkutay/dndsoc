import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { completeSignUp, verifyOtp } from "@/lib/auth";
import { env } from "@/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? origin;

  // Verify OTP and log in
  if (tokenHash && type) {
    const verified = await verifyOtp({ type, tokenHash });
    if (verified.isErr()) {
      const errorMessage = "Error exchanging code for session: " + verified.error.message;
      console.error(errorMessage);
      return NextResponse.redirect(`${origin}/error?error=Could not verify. Maybe the link is expired?`);
    }
  }

  // Complete sign up process
  if (type === "email") {
    const completed = await completeSignUp();
    if (completed.isErr()) {
      const errorMessage = "Error completing sign up: " + completed.error.message;
      console.error(errorMessage);
      return NextResponse.redirect(`${origin}/error?error=Could not complete sign up. Maybe duplicate information?`);
    }
  }

  if (next) {
    // If next is a relative path, prepend the origin
    if (!next.startsWith("http")) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(next);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/my`);
}

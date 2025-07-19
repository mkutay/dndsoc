import type { EmailOtpType } from "@supabase/supabase-js";
import { errAsync, okAsync } from "neverthrow";
import { NextResponse } from "next/server";

import { completeSignUp, verifyOtp } from "@/lib/auth";
import { env } from "@/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const origin = env.NEXT_PUBLIC_SITE_URL;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  // Verify OTP and log in
  if (tokenHash && type === "email") {
    const completed = await complete(type, tokenHash);
    if (completed.isErr()) {
      const errorMessage = "Error completing sign up: " + completed.error.message;
      console.error(errorMessage);
      return NextResponse.redirect(`${origin}/error?error=${completed.error.message}`);
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

const complete = (type: EmailOtpType, tokenHash: string) =>
  verifyOtp({ type, tokenHash })
    .andThen((response) => {
      if (!response.user) {
        return errAsync({
          code: "OTP_VERIFICATION_FAILURE" as const,
          message: "Could not verify the given OTP. Maybe the link expired?",
        });
      }
      return okAsync(response.user);
    })
    .andThen(completeSignUp);

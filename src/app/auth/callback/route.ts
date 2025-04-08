import { NextResponse } from "next/server";

import { exchangeCodeForSession } from "@/lib/auth/exchange-code";
import { completeSignUp } from "@/lib/auth/complete-sign-up";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const type = requestUrl.searchParams.get("type")?.toString();

  // Exchange code
  if (code) {
    const exchanged = await exchangeCodeForSession(code);
    if (exchanged.isErr()) {
      console.error("Error exchanging code for session: " + exchanged.error.message);
      return NextResponse.redirect(`${origin}/sign-in`);
    }
  }

  // Complete sign up process
  if (type === "signup") {
    const completed = await completeSignUp();
    if (completed.isErr()) {
      console.error("Error completing sign up: " + completed.error.message);
      return NextResponse.redirect(`${origin}/sign-in`);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/players`);
}

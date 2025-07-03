import { NextResponse } from "next/server";

import { exchangeCodeForSession, completeSignUp } from "@/lib/auth";
import { env } from "@/env";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  // SITE_URL is only a FDQN (only a absolute domain name)
  const origin = env.SITE_URL;
  const code = requestUrl.searchParams.get("code");
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
    } else {
      return NextResponse.redirect(`${origin}/my`);
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/my`);
}

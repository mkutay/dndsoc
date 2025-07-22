import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const social = searchParams.get("social");

  if (social === "whatsapp" && env.WHATSAPP_LINK) {
    return NextResponse.redirect(env.WHATSAPP_LINK);
  } else if (social === "discord" && env.DISCORD_LINK) {
    return NextResponse.redirect(env.DISCORD_LINK);
  }

  return NextResponse.redirect(env.NEXT_PUBLIC_SITE_URL);
}

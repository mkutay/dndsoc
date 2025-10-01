import { NextRequest, NextResponse } from "next/server";

import { runServiceQuery } from "@/utils/supabase-run";

export async function GET(request: NextRequest, { params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const decoded = decodeURIComponent(shortened);
  const result = await runServiceQuery((supabase) =>
    supabase.from("links").select("*").eq("shortened", decoded).single(),
  );
  if (result.isOk()) {
    const link = result.value.link;
    return NextResponse.redirect(link);
  }
  return NextResponse.json({ error: "Link not found" }, { status: 404 });
}

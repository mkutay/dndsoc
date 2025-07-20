import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // This will refresh session if expired - required for Server Components.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /* Protected Routes */
  if (pathname.startsWith("/reset-password") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Edit page in any protected route
  if (pathname.includes("/edit") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Edit page in any protected route
  if (pathname.startsWith("/my") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
};

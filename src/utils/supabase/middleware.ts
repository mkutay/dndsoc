import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /* Protected Routes */
  if (pathname.startsWith("/protected") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.startsWith("/players/edit") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.includes("/characters") && pathname.includes("/edit") && user.error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/" && !user.error) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  return response;
};

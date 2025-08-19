import Link from "next/link";

import { NavBarSheet } from "./nav-bar-sheet";
import { Logo } from "@/components/logo";
import { AuthButtons } from "@/components/nav-bar/auth-buttons";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/config/site";

export function NavBar() {
  return (
    <nav className="bg-background/80 backdrop-blur-sm lg:sticky top-0 h-20 z-50">
      <div className="my-4 max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
        <div className="gap-10 flex flex-row items-center">
          <Logo />
          <div className="hidden lg:flex flex-row gap-4">
            {siteConfig.navItems.map((item) => (
              <Link key={item.href} href={`${item.href}`} className="text-center hover:text-primary transition-all">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-row place-items-center gap-4 lg:flex hidden">
          <ThemeSwitcher />
          <AuthButtons />
          <InlineScript />
        </div>
        <div className="flex-row place-items-center gap-4 flex lg:hidden">
          <ThemeSwitcher />
          <NavBarSheet />
        </div>
        <InlineThemeScript />
      </div>
    </nav>
  );
}

function InlineScript() {
  return (
    <script
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `(${(() => {
          function parseCookie(cookie: string) {
            return cookie.split(";").reduce((acc: Record<string, string>, cookie) => {
              const [key, value] = cookie.split("=");
              if (key && value !== undefined) {
                acc[key.trim()] = decodeURIComponent(value.trim());
              }
              return acc;
            }, {});
          }

          const cookies = parseCookie(document.cookie);
          // For local (127) and prod (supa):
          if (!cookies["sb-127-auth-token"] && !cookies["sb-supa-auth-token"]) {
            const signInButton = document.getElementById("sign-in-button");
            const signUpButton = document.getElementById("sign-up-button");
            const signOutButton = document.getElementById("sign-out-button");

            if (signInButton) {
              signInButton.classList.remove("hidden");
              signInButton.classList.add("inline-flex");
            }
            if (signUpButton) {
              signUpButton.classList.remove("hidden");
              signUpButton.classList.add("inline-flex");
            }
            if (signOutButton) {
              signOutButton.classList.remove("inline-flex");
              signOutButton.classList.add("hidden");
            }
          } else {
            const signOutButton = document.getElementById("sign-out-button");
            const signInButton = document.getElementById("sign-in-button");
            const signUpButton = document.getElementById("sign-up-button");

            if (signOutButton) {
              signOutButton.classList.remove("hidden");
              signOutButton.classList.add("inline-flex");
            }
            if (signInButton) {
              signInButton.classList.remove("inline-flex");
              signInButton.classList.add("hidden");
            }
            if (signUpButton) {
              signUpButton.classList.remove("inline-flex");
              signUpButton.classList.add("hidden");
            }
          }
        }).toString()})()`,
      }}
    />
  );
}

function InlineThemeScript() {
  return (
    <script
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `(${(() => {
          const theme = localStorage.getItem("theme");
          // For local (127) and prod (supa):
          if (theme === "light") {
            const lightButton = document.getElementById("theme-light-button");
            if (lightButton) {
              lightButton.classList.remove("hidden");
              lightButton.classList.add("flex");
            }
          } else if (theme === "dark") {
            const darkButton = document.getElementById("theme-dark-button");
            if (darkButton) {
              darkButton.classList.remove("hidden");
              darkButton.classList.add("flex");
            }
          } else {
            const systemButton = document.getElementById("theme-system-button");
            if (systemButton) {
              systemButton.classList.remove("hidden");
              systemButton.classList.add("flex");
            }
          }
        }).toString()})()`,
      }}
    />
  );
}

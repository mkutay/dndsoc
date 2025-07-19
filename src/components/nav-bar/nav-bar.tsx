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
        </div>
        <div className="flex-row place-items-center gap-4 flex lg:hidden">
          <ThemeSwitcher />
          <NavBarSheet />
        </div>
      </div>
    </nav>
  );
}

import Image from "next/image";
import Link from "next/link";

import { NavBarSheet } from "./nav-bar-sheet";
import lightLogo from "@/public/logo-light.png";
import darkLogo from "@/public/logo-dark.png";
import { AuthButtons } from "@/components/nav-bar/auth-buttons";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/config/site";

export function NavBar() {
  return (
    <nav className="bg-background/80 backdrop-blur-sm lg:sticky top-0 h-20 z-50">
      <div className="my-4 max-w-prose lg:max-w-6xl mx-auto flex flex-row items-center justify-between px-4">
        <div className="gap-10 flex flex-row items-center">
          <Link
            href="/"
            className="flex flex-row items-center gap-2 text-primary hover:text-primary/80 transition-all font-bold text-xl font-headings"
          >
            <Image
              src={lightLogo}
              alt="Logo: A dragon holding a d20 on its tongue"
              className="rounded-full h-12 w-12 dark:hidden flex"
            />
            <Image
              src={darkLogo}
              alt="Logo: A dragon holding a d20 on its tongue"
              className="rounded-full h-12 w-12 hidden dark:flex"
            />
            {siteConfig.name}
          </Link>
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

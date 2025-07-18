import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import lightLogo from "@/public/logo-light.png";
import darkLogo from "@/public/logo-dark.png";
import { cn } from "@/utils/styling";

export function Logo({ className, disableText }: { className?: string; disableText?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex flex-row items-center gap-2 text-primary hover:text-primary/80 transition-all font-bold text-xl font-headings",
        className,
      )}
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
      {disableText ? null : siteConfig.name}
    </Link>
  );
}

import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "@/utils/styling";

export function TypographyParagraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>;
}

export function TypographyLead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>;
}

export function TypographyLarge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-lg font-semibold tracking-wider", className)}>{children}</div>;
}

export function TypographySmall({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <small className={cn("text-md font-medium leading-none tracking-wide font-quotes", className)}>{children}</small>
  );
}

export function TypographyMuted({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

const linkClasses = {
  default: "text-foreground hover:text-foreground/80",
  primary: "text-primary hover:text-primary/80",
  muted: "text-muted-foreground hover:text-muted-foreground/80",
};

export function TypographyLink(props: ComponentProps<typeof Link> & { variant?: "primary" | "default" | "muted" }) {
  return (
    <Link
      {...props}
      className={cn(
        "underline font-medium underline-offset-2 transition-colors",
        linkClasses[props.variant || "primary"],
        props.className,
      )}
    >
      {props.children}
    </Link>
  );
}

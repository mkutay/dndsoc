import { cn } from "@/lib/utils";

export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-headings", className)}>
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-headings", className)}>
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight font-headings">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight font-headings">
      {children}
    </h4>
  );
}

export function TypographyH5({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="scroll-m-20 text-lg font-medium tracking-tight font-headings">
      {children}
    </h5>
  );
}
import { cn } from "@/lib/utils";

export function TypographyBlockquote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">
      {children}
    </blockquote>
  );
}

export function TypographyHr() {
  return <div className="inline-flex items-center justify-between w-full my-6">
    <hr className={cn("h-0.5 bg-secondary border-0 w-5/12")} />
    <span className="absolute px-3 font-medium -translate-x-1/2 left-1/2 font-sans text-lg text-secondary-foreground">§</span>
    <hr className={cn("h-0.5 bg-secondary border-0 w-5/12")} />
  </div>;
}
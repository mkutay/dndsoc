import { cn } from "@/lib/utils";

export function TypographyParagraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string,
}) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}
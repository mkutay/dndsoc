import { TypographyLarge, TypographyParagraph } from "./typography/paragraph";

export function ErrorComponent({ error, caller, returnNull, silent }: {
  error: string;
  caller?: string;
  returnNull?: boolean;
  silent?: boolean;
} | {
  error: {
    message: string;
    code: string;
  };
  caller?: string;
  returnNull?: boolean;
  silent?: boolean;
}) {
  const paragraph = typeof error === 'string' ? error : error.message;
  const heading = "Error displaying this component" + (typeof error !== 'string' ? ` (${error.code})` : "");
  if (silent) {
    console.log(`${heading}: ${paragraph}${caller ? ` (caller: ${caller})` : ""}`);
  } else {
    console.error(`${heading}: ${paragraph}${caller ? ` (caller: ${caller})` : ""}`);
  }

  if (returnNull) return null;

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLarge>{heading}</TypographyLarge>
      <TypographyParagraph>{paragraph}</TypographyParagraph>
    </div>
  );
}
import { TypographyLink } from "@/components/typography/paragraph";
import Balatro from "@/components/reactbits/balatro";
import { Logo } from "@/components/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-svh w-full items-center justify-center px-2 sm:px-4 md:px-10">
      <div className="absolute inset-0 z-0">
        <Balatro isRotate={false} mouseInteraction={false} pixelFilter={2000} />
      </div>
      <div className="absolute top-4 z-10 shadow-md rounded-full">
        <Logo className="backdrop-blur-sm p-3 rounded-full" />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">{children}</div>
      <div className="text-primary text-center text-sm font-quotes text-balance absolute bottom-4 z-10">
        By continuing, you agree to our{" "}
        <TypographyLink href="/terms-of-service" target="_blank">
          Terms of Service
        </TypographyLink>{" "}
        and{" "}
        <TypographyLink href="/privacy-policy" target="_blank">
          Privacy Policy
        </TypographyLink>
        .
      </div>
    </div>
  );
}

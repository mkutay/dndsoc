import { Logo } from "@/components/logo";
import Dither from "@/components/reactbits/dithering";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-10">
      <div className="absolute inset-0 z-0">
        <Dither enableMouseInteraction={false} />
      </div>
      <div className="absolute top-8 mx-auto z-10 shadow-md rounded-full items-center justify-center">
        <Logo className="backdrop-blur-sm p-4 rounded-full" disableText />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">{children}</div>
    </div>
  );
}

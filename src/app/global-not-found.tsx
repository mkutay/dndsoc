import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "next-themes";
import "katex/dist/katex.min.css";

import {
  BookInsanity,
  IBMPlexMono,
  LibreBaskerville,
  Lora,
  MrEaves,
  NodestoCapsCondensed,
  ScalySans,
  ScalySansCaps,
  SolberaImitation,
  ZatannaMisdirection,
} from "@/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/utils/styling";
import { Logo } from "@/components/logo";
import FaultyTerminal from "@/components/reactbits/faulty-terminal";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <html
      lang="en"
      className={cn(
        LibreBaskerville.variable,
        Lora.variable,
        IBMPlexMono.variable,
        BookInsanity.variable,
        MrEaves.variable,
        NodestoCapsCondensed.variable,
        ScalySans.variable,
        ScalySansCaps.variable,
        SolberaImitation.variable,
        ZatannaMisdirection.variable,
        "font-body",
      )}
      suppressHydrationWarning
    >
      <head>
        <PlausibleProvider
          domain="kcldnd.uk"
          customDomain="https://pl.mkutay.dev"
          selfHosted={true}
          trackOutboundLinks={true}
          trackFileDownloads={true}
          taggedEvents={true}
        />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen flex flex-col">
            <div className="relative flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-10">
              <div className="absolute inset-0 z-0">
                <FaultyTerminal
                  scale={1.5}
                  gridMul={[2, 1]}
                  digitSize={1.2}
                  timeScale={1}
                  pause={false}
                  scanlineIntensity={0.2}
                  glitchAmount={1}
                  flickerAmount={0.001}
                  noiseAmp={1}
                  chromaticAberration={0}
                  dither={0}
                  curvature={0.2}
                  tint="#A7EF9E"
                  mouseReact={true}
                  mouseStrength={0.5}
                  pageLoadAnimation={false}
                  brightness={0.8}
                />
              </div>
              <div className="absolute top-8 mx-auto z-10 shadow-md rounded-full">
                <Logo className="backdrop-blur-sm p-4 rounded-full" />
              </div>
              <div className="relative z-10 w-full max-w-md shadow-2xl">
                <Card>
                  <CardHeader>
                    <h1>
                      <CardTitle className="md:text-left text-center md:pt-0 pt-1 text-4xl">404 / Not Found</CardTitle>
                    </h1>
                  </CardHeader>
                  <CardContent className="text-lg">
                    <TypographyParagraph>
                      The page you are looking for does not exist, maybe for now.
                    </TypographyParagraph>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-center text-base font-quotes">
                      Go to <TypographyLink href="/">homepage</TypographyLink>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

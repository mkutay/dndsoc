import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { NavBar } from "@/components/nav-bar/nav-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { BookInsanity, MrEaves, NodestoCapsCondensed, ScalySans, ScalySansCaps, SolberaImitation, ZatannaMisdirection } from "@/fonts/fonts";

const defaultUrl = process.env.PRODUCTION_SITE_URL
  ? `https://${process.env.PRODUCTION_SITE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KCL Dungeons and Dragons App",
  description: "Everything you need to play Dungeons and Dragons with us!",
};

const sans = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: "400",
});

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: "400",
});

export { BookInsanity, MrEaves, NodestoCapsCondensed, ScalySans, ScalySansCaps, SolberaImitation, ZatannaMisdirection };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(sans.variable, serif.variable, mono.variable, BookInsanity.variable, MrEaves.variable, NodestoCapsCondensed.variable, ScalySans.variable, ScalySansCaps.variable, SolberaImitation.variable, ZatannaMisdirection.variable, "font-body")}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

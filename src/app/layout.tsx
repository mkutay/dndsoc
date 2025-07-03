import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "next-themes";
import { type Metadata } from "next";
import "katex/dist/katex.min.css";

import {
  BookInsanity,
  MrEaves,
  NodestoCapsCondensed,
  ScalySans,
  ScalySansCaps,
  SolberaImitation,
  ZatannaMisdirection,
} from "@/fonts/fonts";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import { cn } from "@/utils/styling";
import "@/app/globals.css";

const defaultUrl = process.env.PRODUCTION_SITE_URL
  ? `https://${process.env.PRODUCTION_SITE_URL}`
  : "http://localhost:3000";

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

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | KCL Dungeons and Dragons Society",
    default: "King's College London Dungeons and Dragons Society",
  },
  description:
    "Everything you need to play Dungeons and Dragons with us! Join our community, manage your characters, and embark on epic adventures.",
  generator: "Next.js",
  applicationName: "KCL DnD",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Kutay", url: "https://www.mkutay.dev" }, { name: "Kai" }],
  creator: "Kutay",
  publisher: "Kutay",
  keywords: ["dnd", "dungeons and dragons", "kcl", "kings college london", "society", "role playing", "ttrpg"],
  openGraph: {
    title: {
      template: "%s | KCL Dungeons and Dragons App",
      default: "KCL Dungeons and Dragons App",
    },
    description: "Everything you need to play Dungeons and Dragons with us!",
    url: new URL(defaultUrl),
    siteName: "KCL DnD",
    locale: "en_UK",
    type: "website",
    images: [`${defaultUrl}/logo-light.png`],
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        sans.variable,
        serif.variable,
        mono.variable,
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
            <NavBar />
            <div className="flex-1">{children}</div>
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

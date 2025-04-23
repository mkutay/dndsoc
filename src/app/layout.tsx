import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { NavBar } from "@/components/nav-bar/nav-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const defaultUrl = process.env.PRODUCTION_SITE_URL
  ? `https://${process.env.PRODUCTION_SITE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KCL Dungeons and Dragons App",
  description: "Everything you need to play Dungeons and Dragons with us!",
};

const sansSerif = Libre_Baskerville({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Lora({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = IBM_Plex_Mono({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sansSerif.variable, serif.variable, mono.variable, "font-sans")} suppressHydrationWarning>
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

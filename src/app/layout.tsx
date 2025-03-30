import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { NavBar } from "@/components/nav-bar/nav-bar";
import { Footer } from "@/components/footer";
import "@/app/globals.css";

const defaultUrl = process.env.PRODUCTION_SITE_URL
  ? `https://${process.env.PRODUCTION_SITE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KCL Dungeons and Dragons App",
  description: "Everything you need to play Dungeons and Dragons with us!",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

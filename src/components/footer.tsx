import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border/40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Mobile accordion view */}
        <div className="md:hidden">
          <div className="flex flex-col items-start gap-2 mb-4">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="text-lg font-medium">
                Made with <span className="text-primary font-bold">&lt;3</span>
              </p>
              <p className="text-sm text-muted-foreground font-quotes">Let&apos;s roll together!</p>
            </div>
            <Link
              href="https://www.mkutay.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-all text-md"
            >
              Kutay, the President
            </Link>
          </div>
          <Accordion type="multiple" className="w-full">
            {/* Quick Links section */}
            <AccordionItem value="links">
              <AccordionTrigger>Quick Links</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3">
                  {siteConfig.footerItems.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className="text-sm text-foreground hover:text-foreground/80 transition-all"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Community section */}
            <AccordionItem value="community">
              <AccordionTrigger>Community</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground font-quotes">
                    Join fellow adventurers in epic D&D stories!
                  </p>
                  <Link
                    href="/sign-up"
                    className="text-md text-primary hover:text-primary/80 transition-colors font-normal"
                  >
                    Sign up now
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop grid view */}
        <div className="hidden md:flex flex-row justify-between min-h-24">
          <div className="flex flex-row lg:gap-24 gap-20">
            <div className="flex flex-col justify-between">
              <p className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">
                Made with <span className="text-primary font-bold">&lt;3</span>
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground font-quotes">Let&apos;s roll together!</p>
                <Link
                  href="https://www.mkutay.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-all text-md"
                >
                  Kutay, the President
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">Community</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground font-quotes">
                  Join fellow adventurers in epic D&D stories!
                </p>
                <Link href="/sign-up" className="text-primary hover:text-primary/80 transition-colors font-normal">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="text-sm text-right font-semibold text-foreground/90 uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
              {siteConfig.footerItems.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="text-sm text-foreground hover:text-foreground/80 transition-all"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section - Copyright */}
        <div className="mt-8 md:pt-6 md:border-t md:border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-muted-foreground">
              {`© 2025-present ${siteConfig.author}. All Rights Reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

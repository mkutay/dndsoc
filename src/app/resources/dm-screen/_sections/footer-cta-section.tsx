import { TypographyH2 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

interface FooterCtaSectionProps {
  id: string;
}

const FooterCtaSection: React.FC<FooterCtaSectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-12 md:py-18 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <TypographyH2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primary-foreground border-none">
          Ready to Forge Your Own Adventures?
        </TypographyH2>
        <TypographyParagraph className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
          This screen is just a starting point! Dive deeper into the rules or
          create your own custom content. The possibilities are endless.
        </TypographyParagraph>
      </div>
    </section>
  );
};

export default FooterCtaSection;
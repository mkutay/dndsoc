import { TypographyH1 } from "@/components/typography/headings";
import { D20Dice } from "@/components/d20-3d";
import { AnimatedDice } from "@/components/animated-dice";
import { TypographyLead } from "@/components/typography/paragraph";

interface HeroSectionProps {
  id: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ id }) => {
  return (
    <section id={id} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow"></div>
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-6xl mx-auto">
          <div className="flex justify-center mb-6 animate-float">
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <AnimatedDice />
              <span className="text-sm md:text-base font-medium text-primary px-1 font-quotes">
                Essential Reference
              </span>
              <AnimatedDice />
            </div>
          </div>

          <TypographyH1 className="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up">
            Kutay&apos;s{" "}
            <span className="font-drop-caps font-normal tracking-tighter">DM</span>{" "}
            Screen
          </TypographyH1>

          <TypographyLead className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground animate-fade-in-up">
            Your quick and easy reference for Dungeons & Dragons 5th Edition
            rules, tables, and conditions.
          </TypographyLead>

          <div className="md:flex hidden justify-center">
            <D20Dice size="xl" />
          </div>
          <div className="flex md:hidden justify-center">
            <D20Dice size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
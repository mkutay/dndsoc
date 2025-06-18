import { Sword, Shield, Zap, Eye, Move, RotateCcw } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { GiJuggler } from "react-icons/gi";
import { IconType } from "react-icons";
import { Metadata } from "next";
import Link from "next/link";

import { dataAction, dataBonusAction, dataCondition, dataEnvironmentCover, dataEnvironmentLight, dataEnvironmentObscurance, dataEnvironmentVision, dataMovement, dataReaction, iconMap, ReferenceItem } from "@/config/quick-reference-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { D20Dice } from "@/components/d20-3d";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Quick Reference",
  description: "Full D&D 5e quick reference guide. Actions, bonus actions, reactions, conditions, movement, and environmental rules for KCL DnD Society.",
  openGraph: {
    title: "D&D 5e Quick Reference",
    description: "Essential D&D 5e rules reference with actions, conditions, movement, and environmental mechanics for players and DMs.",
  },
};

function ReferenceCard({ item }: { item: ReferenceItem }) {
  const IconComponent = iconMap[item.icon] || GiJuggler;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group dark:border-2 dark:border-border hover:dark:border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex sm:flex-row flex-col items-center gap-3 text-lg">
              <IconComponent className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="flex-1">
                <div className="text-2xl">{item.title}</div>
                {item.subtitle && (
                  <div className="text-base font-quotes text-muted-foreground tracking-tight">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TypographyParagraph className="lg:text-sm text-base text-muted-foreground line-clamp-2">
              {item.description}
            </TypographyParagraph>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IconComponent className="w-10 h-10 text-primary" />
            <div>
              <div>{item.title}</div>
              {item.subtitle && (
                <div className="text-base text-muted-foreground font-quotes">
                  {item.subtitle}
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {item.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {item.bullets.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Details
              </h4>
              <ul className="space-y-2">
                {item.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-base">
                    <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: bullet }} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-5 border-t border-border">
            <Badge variant="secondary">
              {item.reference}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReferenceSection({ 
  title, 
  icon: IconComponent, 
  data, 
  description 
}: { 
  title: string; 
  icon: IconType; 
  data: ReferenceItem[]; 
  description?: string;
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <TypographyH2 className="text-3xl md:text-4xl font-bold mb-4 font-headings flex items-center justify-center gap-3 border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
              {title}
            </TypographyH2>
            {description && (
              <TypographyParagraph className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </TypographyParagraph>
            )}
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <ReferenceCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function QuickReferencePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl p-8 md:p-12 border border-primary/30 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-center md:gap-0 gap-4">
                <div className="text-center lg:text-left w-fit">
                  <div className="inline-flex items-center gap-2 mb-4 p-2 rounded-full bg-primary/20 border border-primary/30">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary font-quotes">Complete 5e Reference</span>
                  </div>
                  <TypographyH1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Quick<br />Reference
                  </TypographyH1>
                  <TypographyParagraph className="text-lg md:text-xl text-muted-foreground mb-6">
                    Essential DnD 5e rules at your fingertips.
                  </TypographyParagraph>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Button asChild size="lg">
                      <Link href="/resources" className="flex items-center gap-2">
                        <Sword className="w-4 h-4" />
                        All Resources
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/resources/quick-reference#actions" className="flex items-center gap-2">
                        Jump to Actions
                        <Zap className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full mt-8 lg:mt-0">
                  <div className="md:flex hidden">
                    <D20Dice size="xl" />
                  </div>
                  <div className="md:hidden flex">
                    <D20Dice size="lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto w-full">
            <TypographyH3 className="text-center mb-6">Jump to Section</TypographyH3>
            <div className="md:flex md:flex-row grid grid-cols-2 gap-4 justify-center">
              <Button asChild variant="outline" className="h-auto w-full p-4 flex-col gap-2">
                <Link href="#actions">
                  <Sword className="w-8 h-8" />
                  <span className="text-base">Actions</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                <Link href="#bonus-actions">
                  <Zap className="w-8 h-8" />
                  <span className="text-base">Bonus Actions</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                <Link href="#reactions">
                  <RotateCcw className="w-8 h-8" />
                  <span className="text-base">Reactions</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                <Link href="#conditions">
                  <Shield className="w-8 h-8" />
                  <span className="text-base">Conditions</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                <Link href="#movement">
                  <Move className="w-8 h-8" />
                  <span className="text-base">Movement</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 w-full">
                <Link href="#environment">
                  <Eye className="w-8 h-8" />
                  <span className="text-base">Environment</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <div id="actions">
        <ReferenceSection 
          title="Actions" 
          icon={Sword} 
          data={dataAction}
          description="Actions you can take on your turn during combat."
        />
      </div>

      {/* Bonus Actions Section */}
      <div id="bonus-actions" className="bg-gradient-to-b from-muted/10 to-transparent">
        <ReferenceSection 
          title="Bonus Actions" 
          icon={Zap} 
          data={dataBonusAction}
          description="Special actions that can be taken in addition to your main action."
        />
      </div>

      {/* Reactions Section */}
      <div id="reactions">
        <ReferenceSection 
          title="Reactions" 
          icon={RotateCcw} 
          data={dataReaction}
          description="Immediate responses to specific triggers that occur on any turn."
        />
      </div>

      {/* Conditions Section */}
      <div id="conditions" className="bg-gradient-to-b from-muted/10 to-transparent">
        <ReferenceSection 
          title="Conditions" 
          icon={Shield} 
          data={dataCondition}
          description="Status effects that can be applied to creatures."
        />
      </div>

      {/* Movement Section */}
      <div id="movement">
        <ReferenceSection 
          title="Movement" 
          icon={Move} 
          data={dataMovement}
          description="Different types of movement and their costs."
        />
      </div>

      {/* Environment Section */}
      <div id="environment" className="bg-gradient-to-b from-muted/10 to-transparent">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <TypographyH2 className="text-3xl md:text-4xl font-bold mb-4 font-headings flex items-center justify-center gap-3 border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
                  <Eye className="w-8 h-8 md:w-10 md:h-10" />
                  Environment
                </TypographyH2>
                <TypographyParagraph className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Environmental conditions that affect visibility, movement, and combat
                </TypographyParagraph>
              </div>
              
              {/* Obscurance */}
              <div className="mb-12">
                <TypographyH3 className="text-2xl font-bold mb-6 text-center">Obscurance</TypographyH3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataEnvironmentObscurance.map((item, index) => (
                    <ReferenceCard key={index} item={item} />
                  ))}
                </div>
              </div>

              {/* Light */}
              <div className="mb-12">
                <TypographyH3 className="text-2xl font-bold mb-6 text-center">Light</TypographyH3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dataEnvironmentLight.map((item, index) => (
                    <ReferenceCard key={index} item={item} />
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div className="mb-12">
                <TypographyH3 className="text-2xl font-bold mb-6 text-center">Vision</TypographyH3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dataEnvironmentVision.map((item, index) => (
                    <ReferenceCard key={index} item={item} />
                  ))}
                </div>
              </div>

              {/* Cover */}
              <div>
                <TypographyH3 className="text-2xl font-bold mb-6 text-center">Cover</TypographyH3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dataEnvironmentCover.map((item, index) => (
                    <ReferenceCard key={index} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <TypographyH2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primary-foreground border-none">
            Ready to Use These Rules?
          </TypographyH2>
          <TypographyParagraph className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
            Join a party and put these mechanics to good use! We are always welcoming new players—seasoned or new—to our community.
          </TypographyParagraph>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
              <Link href="/parties">
                Browse Parties
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/resources">
                More Resources
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

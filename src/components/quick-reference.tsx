import { DialogDescription } from "@radix-ui/react-dialog";
import { GiJuggler } from "react-icons/gi";
import { IconType } from "react-icons";

import { iconMap, ReferenceItem } from "@/config/quick-reference-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TypographyH2 } from "@/components/typography/headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";

export function ReferenceCard({ item }: { item: ReferenceItem }) {
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

export function ReferenceSection({ 
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
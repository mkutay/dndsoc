"use client";

import { HeartCrack } from "lucide-react";
import { useState } from "react";

import { TypographyH2 } from "@/components/typography/headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dataCondition } from "@/config/quick-reference-data";
import { ReferenceCard } from "@/components/quick-reference";
import { Button } from "@/components/ui/button";

interface ConditionsSectionProps {
  id: string;
}

const ConditionsSection: React.FC<ConditionsSectionProps> = ({ id }) => {
  const itemsPerPage = 4;
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const hasMoreItems = visibleItems < dataCondition.length;

  const handleSeeMore = () => {
    setVisibleItems(prev => Math.min(prev + itemsPerPage, dataCondition.length));
  };

  return (
    <section
      id={id}
      className="py-12 md:py-18 bg-linear-to-b from-background via-muted/40 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <TypographyH2 className="text-4xl md:text-5xl font-bold font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Conditions
            </TypographyH2>
            <div className="mt-2 font-quotes md:text-base text-sm">
              (p.s. click on the cards below to see more details)
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dataCondition.slice(0, visibleItems).map((item, index) => (
              <ReferenceCard
                key={index}
                item={item}
              />
            ))}
          </div>

          {hasMoreItems && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSeeMore}
                variant="outline"
                className="px-8 py-3 text-lg font-medium"
              >
                See More ({Math.min(itemsPerPage, dataCondition.length - visibleItems)} more)
              </Button>
            </div>
          )}

          {/* Conditions Quick Reference */}
          <Card className="md:px-6 md:py-2 md:mt-16 mt-12 bg-linear-to-r from-red-50/50 via-pink-50/30 to-purple-50/50 dark:from-red-950/20 dark:via-pink-950/10 dark:to-purple-950/20 border-2 border-red-200/50 dark:border-red-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartCrack className="w-7 h-7 md:w-8 md:h-8" />
                Condition Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-base">
                <div className="space-y-2">
                  <p className="font-bold font-quotes text-lg">Advantage on Attacks</p>
                  <p>Blinded, Invisible, Paralyzed, Petrified, Prone (within 5ft), Restrained, Stunned, Unconscious</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold font-quotes text-lg">Can&apos;t Take Actions</p>
                  <p>Incapacitated, Paralyzed, Petrified, Stunned, Unconscious</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold font-quotes text-lg">Auto-Fail Saves</p>
                  <p>Paralyzed (STR/DEX), Petrified (STR/DEX), Stunned (STR/DEX), Unconscious (STR/DEX)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConditionsSection;
"use client";

import { Swords } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TypographyH2 } from "@/components/typography/headings";
import { ReferenceCard } from "@/components/quick-reference";
import { dataAction } from "@/config/quick-reference-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActionsInCombatSectionProps {
  id: string;
}

const ActionsInCombatSection: React.FC<ActionsInCombatSectionProps> = ({ id }) => {
  const itemsPerPage = 5;
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const hasMoreItems = visibleItems < dataAction.length;

  const handleSeeMore = () => {
    setVisibleItems((prev) => Math.min(prev + itemsPerPage, dataAction.length));
  };

  return (
    <section id={id} className="py-12 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <TypographyH2 className="text-4xl md:text-5xl font-bold font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Actions in Combat
            </TypographyH2>
            <div className="mt-2 font-quotes md:text-base text-sm">
              (p.s. click on the cards below to see more details)
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {dataAction.slice(0, visibleItems).map((item, index) => (
              <ReferenceCard key={index} item={item} />
            ))}
          </div>

          {hasMoreItems ? (
            <div className="flex justify-center mt-8">
              <Button onClick={handleSeeMore} variant="outline" className="px-8 py-3 text-lg font-medium">
                See More ({Math.min(itemsPerPage, dataAction.length - visibleItems)} more)
              </Button>
            </div>
          ) : null}

          {/* Quick Combat Tips */}
          <Card className="mt-12 md:mt-16 md:px-6 md:py-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="md:w-8 md:h-8 w-6 h-6" />
                Combat Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-base">
                <div className="space-y-2">
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Attack Rolls:</strong> d20 + ability modifier + proficiency
                    bonus.
                  </p>
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Damage Resistance/Vulnerability:</strong> Resistance halves
                    damage, Vulnerability doubles it. Is applied after all other modifiers.
                  </p>
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Dropping to 0 HP:</strong> If excess damage is greater than
                    your max HP, you die. Otherwise, you fall unconscious (death saving throws). With a DC 10 Medicine
                    check, one can stabilise you.{" "}
                    <Link
                      href="https://2014.5e.tools/quickreference.html#bookref-quick,3,damage%20and%20healing"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors italic"
                    >
                      See more info.
                    </Link>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Opportunity Attack:</strong> Leaving reach provokes
                    reaction.
                  </p>
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Movement:</strong> Can be split before/after actions.
                  </p>
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Mounted Combat:</strong> Mount/Dismount costs an amount of
                    movement equal to half of your speed. Can be controlled if trained, otherwise it acts on its own
                    initiative.{" "}
                    <Link
                      href="https://2014.5e.tools/quickreference.html#bookref-quick,3,mounted%20combat"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors italic"
                    >
                      See more.
                    </Link>
                  </p>
                  <p className="font-medium">
                    <strong className="font-quotes text-xl">Free Object Interaction:</strong> Draw/sheathe weapon, open
                    door, etc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ActionsInCombatSection;

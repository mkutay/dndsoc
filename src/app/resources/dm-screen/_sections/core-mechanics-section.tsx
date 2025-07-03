"use client";

import Link from "next/link";
import React, { useState } from "react";
import { GiDiceTwentyFacesOne } from "react-icons/gi";
import { Users, Sparkles, DicesIcon } from "lucide-react";

import { TypographyH2 } from "@/components/typography/headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Latex } from "@/components/latex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CoreMechanicsSectionProps {
  id: string;
}

function CharacterAdvancement() {
  const levels = [
    [0, 1, "+2"],
    [300, 2, "+2"],
    [900, 3, "+2"],
    [2700, 4, "+2"],
    [6500, 5, "+3"],
    [14000, 6, "+3"],
    [23000, 7, "+3"],
    [34000, 8, "+3"],
    [48000, 9, "+4"],
    [64000, 10, "+4"],
    [85000, 11, "+4"],
    [100000, 12, "+4"],
    [120000, 13, "+5"],
    [140000, 14, "+5"],
    [165000, 15, "+5"],
    [195000, 16, "+5"],
    [225000, 17, "+6"],
    [265000, 18, "+6"],
    [305000, 19, "+6"],
    [355000, 20, "+6"],
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 bg-linear-to-br from-card to-primary/5 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Users className="w-6 md:w-7 h-6 md:h-7 text-primary" />
          Character Advancement
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ScrollArea className="h-[180px] w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-card text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">Experience</th>
                <th className="px-4 py-2 text-left font-medium">Level</th>
                <th className="px-4 py-2 text-left font-medium">Proficiency Bonus</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-card" : "bg-muted/10"}>
                  <td className="px-4 py-2">{row[0]}</td>
                  <td className="px-4 py-2">{row[1]}</td>
                  <td className="px-4 py-2">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function AbilityScoresModifiers() {
  const [modifier, setModifier] = useState<string | null>(null);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 bg-linear-to-br from-card to-blue-50 dark:to-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <DicesIcon className="w-9 md:w-10 h-9 md:h-10 text-blue-600 dark:text-blue-400" />
          Ability Score & Modifier Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input
          type="number"
          placeholder="Enter Ability Score"
          className="w-full mb-4"
          onChange={(e) => {
            const score = parseInt(e.target.value, 10);
            if (!isNaN(score)) {
              if (score < 1 || score > 20) {
                setModifier("WTF?");
              } else {
                const modifier = Math.floor((score - 10) / 2);
                setModifier(modifier.toString());
              }
            } else {
              setModifier(null);
            }
          }}
        />
        <div className="text-xl font-quotes flex flex-row justify-between items-center">
          <p>Modifier: {modifier ?? "NaN"}</p>
          <Latex latexString="\left\lfloor \frac{\text{score} - 10}{2} \right\rfloor" />
        </div>
      </CardContent>
    </Card>
  );
}

function MagicSpecialRules() {
  return (
    <Card className="md:w-3/5 w-full h-fit justify-start hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 bg-linear-to-br from-card to-purple-50 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Magic & Special Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="magical-attack-bonus">
            <AccordionTrigger className="text-xl font-bold font-quotes">Magical Attack Bonus</AccordionTrigger>
            <AccordionContent>
              <TypographyParagraph>
                Ability Modifier + Proficiency Bonus (
                <Link
                  href="https://5e.tools/quickreference.html#bookref-quick,2,advantage%20and%20disadvantage"
                  target="_blank"
                  className="text-primary hover:text-primary/80 transition-colors italic"
                >
                  Disadvantage
                </Link>{" "}
                if casting within 5 ft. of an enemy)
              </TypographyParagraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="spell-save-dc">
            <AccordionTrigger className="text-xl font-bold font-quotes">Casting a Spell</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-2">
                <Button asChild size="badge" className="text-xs rounded-full py-0.5 px-2.5 font-quotes">
                  <Link href="https://5e.tools/book.html#PHB,11" target="_blank">
                    See Spells
                  </Link>
                </Button>
                <Badge variant="outline">PHB &apos;14. p. 202</Badge>
              </div>

              <div className="space-y-4 mt-4 tracking-wide">
                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Spell Save DC:</p>
                  <p className="text-sm">8 + Proficiency Bonus + Spellcasting Ability Modifier</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Spell Attack Bonus:</p>
                  <p className="text-sm">Ability Modifier + Proficiency Bonus</p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Components:</p>
                  <ul className="text-sm list-disc list-inside ml-2">
                    <li>
                      <strong className="tracking-widest">V</strong> (Verbal): Requires speech (not gagged/silenced).
                    </li>
                    <li>
                      <strong className="tracking-widest">S</strong> (Somatic): Requires free hand for gestures.
                    </li>
                    <li>
                      <strong className="tracking-widest">M</strong> (Material): Requires component pouch/focus or
                      specific items.
                    </li>
                  </ul>
                  <p className="text-sm font-quotes">
                    <u className="underline-offset-2">NOTE</u>: You need ALL components of the spell.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Casting Times:</p>
                  <p>
                    <strong className="tracking-widest">Action</strong>,{" "}
                    <strong className="tracking-widest">Bonus Action</strong>,{" "}
                    <strong className="tracking-widest">Reaction</strong>, or{" "}
                    <strong className="tracking-widest">Longer</strong>, which requires concentration; failure = no
                    spell slot lost.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Concentration:</p>
                  <ul className="text-sm list-disc list-inside ml-2">
                    <li>Only one concentration spell at a time.</li>
                    <li>CON save on damage: DC = 10 or ½ damage (whichever higher).</li>
                    <li>Broken by: casting another concentration spell, incapacitated, death.</li>
                    <li>
                      Or some other environmental phenomena, such as a wave crashing over you while you&apos;re on a
                      storm-tossed ship.
                    </li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Areas of Effect:</p>
                  <ul className="text-sm list-disc list-inside ml-2">
                    <li>
                      <strong className="tracking-widest">Cone:</strong> Originates from caster, width = distance from
                      origin. Size ÷10 targets.
                    </li>
                    <li>
                      <strong className="tracking-widest">Cube:</strong> Origin on any face of cube. Size ÷ 5 targets.
                    </li>
                    <li>
                      <strong className="tracking-widest">Cylinder:</strong> Origin at center of base circle. Radius ÷10
                      targets.
                    </li>
                    <li>
                      <strong className="tracking-widest">Line:</strong> Straight path from origin. Length ÷ 30 targets.
                    </li>
                    <li>
                      <strong className="tracking-widest">Sphere:</strong> Origin at center, extends in all directions.
                      Radius ÷ 5 targets.
                    </li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-base font-quotes">Targeting:</p>
                  <ul className="text-sm list-disc list-inside ml-2">
                    <li>Must have clear path (no total cover).</li>
                    <li>Can target self unless spell says otherwise.</li>
                    <li>Subtle spells may go unnoticed.</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded space-y-1">
                  <p className="font-semibold text-base font-quotes">School Quick Reference:</p>
                  <div className="grid grid-cols-2 gap-1 text-sm px-7">
                    <span>
                      <strong className="tracking-widest">Abjuration:</strong> Protection
                    </span>
                    <span>
                      <strong className="tracking-widest">Conjuration:</strong> Transport/Summon
                    </span>
                    <span>
                      <strong className="tracking-widest">Divination:</strong> Information
                    </span>
                    <span>
                      <strong className="tracking-widest">Enchantment:</strong> Mind Control
                    </span>
                    <span>
                      <strong className="tracking-widest">Evocation:</strong> Energy/Damage
                    </span>
                    <span>
                      <strong className="tracking-widest">Illusion:</strong> Deception
                    </span>
                    <span>
                      <strong className="tracking-widest">Necromancy:</strong> Life/Death
                    </span>
                    <span>
                      <strong className="tracking-widest">Transmutation:</strong> Change Properties
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scrolls">
            <AccordionTrigger className="text-xl font-bold font-quotes">Scrolls</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside ml-4">
                <li>Casting a Higher-Level Spell: DC = 10 + Spell Level</li>
                <li>Copying Scroll Spells into spell book: INT (Arcana) check DC = 10 + Spell Level.</li>
                <li>In either case, the scroll spell is destroyed on a failure.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contests">
            <AccordionTrigger className="text-xl font-bold font-quotes">Contests</AccordionTrigger>
            <AccordionContent>
              <Badge variant="outline">PHB &apos;14. p. 174</Badge>
              <TypographyParagraph>
                Both participants in a contest make ability checks appropriate to their efforts. They apply all
                appropriate bonuses and penalties, but instead of comparing the total to a DC, they compare the totals
                of their two checks. The participant with the higher check total wins the contest. That character or
                monster either succeeds at the action or prevents the other one from succeeding.
              </TypographyParagraph>
              <TypographyParagraph>
                If the contest results in a tie, the situation remains the same as it was before the contest. Thus, one
                contestant might win the contest by default. If two characters tie in a contest to snatch a ring off the
                floor, neither character grabs it. In a contest between a monster trying to open a door and an
                adventurer trying to keep the door closed, a tie means that the door remains shut.
              </TypographyParagraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="working-together">
            <AccordionTrigger className="text-xl font-bold font-quotes">Working Together</AccordionTrigger>
            <AccordionContent>
              <Badge variant="outline">PHB &apos;14. p. 175</Badge>
              <TypographyParagraph>
                Sometimes two or more characters team up to attempt a task. The character who&apos;s leading the effort
                — or the one with the highest ability modifier — can make an ability check with advantage, reflecting
                the help provided by the other characters. In combat, this requires the{" "}
                <Link
                  href="/resources/quick-reference"
                  target="_blank"
                  className="text-primary hover:text-primary/80 transition-colors italic"
                >
                  Help
                </Link>{" "}
                action.
              </TypographyParagraph>
              <TypographyParagraph>
                A character can only provide help if the task is one that they could attempt alone. For example, trying
                to open a lock requires proficiency with thieves&apos; tools, so a character who lacks that proficiency
                can&apos;t help another character in that task. Moreover, a character can help only when two or more
                individuals working together would actually be productive. Some tasks, such as threading a needle, are
                no easier with help.
              </TypographyParagraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="food-water">
            <AccordionTrigger className="text-xl font-bold font-quotes">Food & Water</AccordionTrigger>
            <AccordionContent>
              <Badge variant="outline">PHB &apos;14. p. 185</Badge>
              <TypographyParagraph>
                Characters who don&apos;t eat or drink suffer the effects of{" "}
                <Link
                  href="/resources/quick-reference#conditions"
                  target="_blank"
                  className="text-primary hover:text-primary/80 transition-colors italic"
                >
                  exhaustion
                </Link>
                . Exhaustion caused by lack of food or water can&apos;t be removed until the character eats and drinks
                the full required amount.
              </TypographyParagraph>
              <TypographyParagraph>
                A character needs one pound of food per day. A character can go without food for a number of days equal
                to 3 + their CON modifier (minimum 1). At the end of each day beyond that limit, a character
                automatically suffers one level of exhaustion.
              </TypographyParagraph>
              <TypographyParagraph>
                A character needs one gallon of water per day, or two gallons per day if the weather is hot. A character
                who drinks only half that much water must succeed on a DC 15 CON saving throw or suffer one level of
                exhaustion at the end of the day. A character with access to even less water automatically suffers one
                level of exhaustion at the end of the day. If the character already has one or more levels of
                exhaustion, the character takes two levels in either case.
              </TypographyParagraph>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="falling">
            <AccordionTrigger className="text-xl font-bold font-quotes">Falling</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-2">
                <Badge variant="outline">XGE p. 77</Badge>
                <Badge variant="outline">PHB &apos;14. p. 183</Badge>
              </div>

              <div className="mt-6 space-y-4">
                <TypographyParagraph>
                  <strong className="font-quotes text-base">Basic Rule:</strong> 1d6 bludgeoning damage per 10 feet
                  fallen (max 20d6). Land{" "}
                  <Link
                    href="/resources/quick-reference#conditions"
                    target="_blank"
                    className="text-primary hover:text-primary/80 transition-colors italic"
                  >
                    prone
                  </Link>{" "}
                  unless damage is avoided.
                </TypographyParagraph>

                <div className="space-y-2">
                  <strong className="font-quotes text-base">Rate of Falling (Optional)</strong>
                  <TypographyParagraph>
                    When falling from great height, descend up to 500 feet instantly, then 500 feet at the end of each
                    subsequent turn until the fall ends.
                  </TypographyParagraph>
                </div>

                <div className="space-y-2">
                  <strong className="font-quotes text-base">Flying Creatures (Optional)</strong>
                  <TypographyParagraph>
                    Flying creatures fall if knocked prone, speed reduced to 0, or lose ability to move (unless hovering
                    or magically held aloft).
                  </TypographyParagraph>
                  <TypographyParagraph>
                    <strong className="font-quotes">Damage Reduction:</strong> Subtract current flying speed from fall
                    distance before calculating damage.
                  </TypographyParagraph>
                  <TypographyParagraph>
                    <strong className="font-quotes">Recovery:</strong> Prone flying creatures can spend half their
                    flying speed to halt the fall and counter prone condition.
                  </TypographyParagraph>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

const CoreMechanicsSection: React.FC<CoreMechanicsSectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-12 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
            Core Mechanics
          </TypographyH2>

          <div className="flex md:flex-row flex-col gap-6 md:gap-8 mb-16">
            <div className="flex flex-col gap-6 md:gap-8 md:w-2/5 w-full md:h-full">
              <CharacterAdvancement />
              <AbilityScoresModifiers />
            </div>
            <MagicSpecialRules />
          </div>

          <Card className="md:px-6 md:py-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GiDiceTwentyFacesOne className="w-12 md:w-14 h-12 md:h-14 mb-1.5" />
                Short and Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-quotes text-lg underline underline-offset-2">Common DCs:</p>
                  <p>Easy: 10 — Medium: 15 — Hard: 20 — Very Hard: 25</p>
                  <p className="font-quotes text-lg underline underline-offset-2">Advantage/Disadvantage:</p>
                  <p>Roll twice, take higher/lower.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-quotes text-lg underline underline-offset-2">Inspiration:</p>
                  <p>
                    Award for great roleplay, clever solutions. Gain advantage on attack rolls, ability checks, and
                    saving throws.{" "}
                    <Link
                      href="https://5e.tools/variantrules.html#inspiration_dmg"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors italic"
                    >
                      Learn more.
                    </Link>
                  </p>
                  <p className="font-quotes text-lg underline underline-offset-2">Passive Checks:</p>
                  <p>10 + modifier + proficiency (if applicable).</p>
                </div>
                <div className="space-y-2">
                  <p className="font-quotes text-lg underline underline-offset-2">Critical Hits:</p>
                  <p>NAT 20 = Double the attack damage.</p>
                  <p className="font-quotes text-lg underline underline-offset-2">Death Saves:</p>
                  <p>3 failures = death, 3 successes = stable.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CoreMechanicsSection;

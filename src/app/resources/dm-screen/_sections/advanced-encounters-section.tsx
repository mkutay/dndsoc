import { Sparkles } from "lucide-react";
import {
  GiCastle,
  GiCrossedSwords,
  GiLightningStorm,
  GiLightBulb,
  GiDiceTwentyFacesTwenty,
  GiTheater,
  GiPotionOfMadness,
  GiCarousel,
  GiRunningNinja,
  GiTrapMask,
} from "react-icons/gi";

import { TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";

interface AdvancedEncountersSectionProps {
  id: string;
}

function Traps() {
  const trapDangerData = [
    { danger: "Setback", saveDC: "10 —11", attackBonus: "+3 to +5" },
    { danger: "Dangerous", saveDC: "12 —15", attackBonus: "+6 to +8" },
    { danger: "Deadly", saveDC: "16 —20", attackBonus: "+9 to +12" },
  ];

  const damageSeverityData = [
    { level: "1 — 4", setback: "1d10", dangerous: "2d10", deadly: "4d10" },
    { level: "5 — 10", setback: "2d10", dangerous: "4d10", deadly: "10d10" },
    { level: "11 — 16", setback: "4d10", dangerous: "10d10", deadly: "18d10" },
    { level: "17 — 20", setback: "10d10", dangerous: "18d10", deadly: "24d10" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiTrapMask className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Traps
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 120
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple">
          <AccordionItem value="trap-dc-bonus">
            <AccordionTrigger className="text-xl font-bold font-quotes">Trap Save DC and Attack Bonus</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Trap Danger</TableHead>
                    <TableHead className="font-medium">Save DC</TableHead>
                    <TableHead className="font-medium">Attack Bonus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trapDangerData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row.danger}</TableCell>
                      <TableCell>{row.saveDC}</TableCell>
                      <TableCell>{row.attackBonus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="damage-severity">
            <AccordionTrigger className="text-xl font-bold font-quotes">Damage Severity by Level</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Character Level</TableHead>
                    <TableHead className="font-medium">Setback</TableHead>
                    <TableHead className="font-medium">Dangerous</TableHead>
                    <TableHead className="font-medium">Deadly</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {damageSeverityData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row.level}</TableCell>
                      <TableCell>{row.setback}</TableCell>
                      <TableCell>{row.dangerous}</TableCell>
                      <TableCell>{row.deadly}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-4">
          <div>
            <TypographyH3 className="text-xl font-bold font-quotes mb-3">Trap Types</TypographyH3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Mechanical:</strong> Pits, arrow traps, falling blocks, water-filled
                rooms, whirling blades - depend on physical mechanisms.
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Magical Device:</strong> Initiate spell effects when activated.
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Spell Traps:</strong> Spells like glyph of warding and symbol that
                function as traps.
              </div>
            </div>
          </div>

          <div>
            <TypographyH3 className="text-xl font-bold font-quotes mb-3">Common Triggers</TypographyH3>
            <ul className="space-y-1 list-disc pl-4">
              <li className="text-sm">Stepping on a pressure plate or false floor section</li>
              <li className="text-sm">Pulling a trip wire</li>
              <li className="text-sm">Turning a doorknob</li>
              <li className="text-sm">Using the wrong key in a lock</li>
              <li className="text-sm">Entering an area (magic traps)</li>
              <li className="text-sm">Touching an object (magic traps)</li>
            </ul>
          </div>

          <div>
            <TypographyH3 className="text-xl font-bold font-quotes mb-3">Detection & Disabling</TypographyH3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Detection:</strong> Wisdom (Perception) check vs trap DC, or passive
                Perception to notice in passing.
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Disabling:</strong> Intelligence (Investigation) to deduce what to do,
                then Dexterity check with thieves&apos; tools.
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                <strong className="text-primary">Magic Traps:</strong> Intelligence (Arcana) check or dispel magic can
                disable most magic traps.
              </div>
            </div>
          </div>

          <div>
            <TypographyH3 className="text-xl font-bold font-quotes mb-3">Trap Effects</TypographyH3>
            <p className="text-sm leading-loose">
              Range from inconvenient to deadly: arrows, spikes, blades, poison, toxic gas, fire blasts, deep pits.
              Deadliest traps combine multiple elements. Intelligent monsters often create bypass mechanisms (hidden
              levers, secret passages) to safely navigate their own traps.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Chases() {
  const chaseRules = [
    "During the chase, participants can freely use the DASH action a number of times equal to 3 + its CON modifier.",
    "Each additional DASH requires the creature to succeed on a DC 10 CON check at the end of its turn or take one level of Exhaustion.",
    "Stopping to cast spells will allow the pursued to increase their lead, and may well mean they will get away, but it is certainly not forbidden.",
  ];

  const endingRules = [
    "Each quarry makes a DEX (Stealth) check at the end of each round, after everyone has had their turn. The result is compared to the Passive perception score of the pursuer(s).",
    "If the quarry is NEVER out of the pursuer's sight, the check fails automatically.",
    "Otherwise, if the Stealth check is higher than the PER score, the quarry escapes. If not, the chase continues.",
  ];

  const escapeFactors = [
    { factor: "Quarry has many things to hide behind", effect: "Advantage" },
    { factor: "Quarry is in a very crowded or noisy area", effect: "Advantage" },
    { factor: "Quarry has few things to hide behind", effect: "Disadvantage" },
    { factor: "Quarry is in an uncrowded or quiet area", effect: "Disadvantage" },
    { factor: "The lead pursuer is a ranger or has proficiency in Survival", effect: "Disadvantage" },
    { factor: "The lead pursuer is a rogue or has proficiency in Stealth", effect: "Advantage" },
    { factor: "The quarry is heavily encumbered", effect: "Disadvantage" },
    { factor: "The quarry is lightly encumbered", effect: "Advantage" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiRunningNinja className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Chases
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 252
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {chaseRules.map((rule, i) => (
            <ul key={i} className="flex items-start gap-2 list-disc pl-4">
              <li className="text-sm leading-relaxed">{rule}</li>
            </ul>
          ))}
        </div>

        <div>
          <TypographyH3 className="text-xl font-bold font-quotes mb-3">Ending the Chase</TypographyH3>
          <div className="space-y-3">
            {endingRules.map((rule, i) => (
              <ul key={i} className="flex items-start gap-2 list-disc pl-4">
                <li className="text-sm leading-relaxed">{rule}</li>
              </ul>
            ))}
          </div>
        </div>

        <div>
          <TypographyH3 className="text-xl font-bold font-quotes mb-1">Escape Factors</TypographyH3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Factor</TableHead>
                <TableHead className="font-medium">Stealth Check Has...</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escapeFactors.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{row.factor}</TableCell>
                  <TableCell className="font-semibold text-primary font-quotes text-base">{row.effect}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ChaseComplications() {
  const urbanComplications = [
    {
      roll: "1",
      complication:
        "A large obstacle such as a horse or cart blocks your way. Make a DC 15 Dexterity (Acrobatics) check to get past the obstacle. On a failed check, the obstacle counts as 10 feet of difficult terrain.",
    },
    {
      roll: "2",
      complication:
        "A crowd blocks your way. Make a DC 10 Strength (Athletics) or Dexterity (Acrobatics) check (your choice) to make your way through the crowd unimpeded. On a failed check, the crowd counts as 10 feet of difficult terrain.",
    },
    {
      roll: "3",
      complication:
        "A large stained-glass window or similar barrier blocks your path. Make a DC 10 Strength saving throw to smash through the barrier and keep going. On a failed save, you bounce off the barrier and fall prone.",
    },
    {
      roll: "4",
      complication:
        "A maze of barrels, crates, or similar obstacles stands in your way. Make a DC 10 Dexterity (Acrobatics) or Intelligence check (your choice) to navigate the maze. On a failed check, the maze counts as 10 feet of difficult terrain.",
    },
    {
      roll: "5",
      complication:
        "The ground beneath your feet is slippery with rain, spilled oil, or some other liquid. Make a DC 10 Dexterity saving throw. On a failed save, you fall prone.",
    },
    {
      roll: "6",
      complication:
        "You come upon a pack of dogs fighting over food. Make a DC 10 Dexterity (Acrobatics) check to get through the pack unimpeded. On a failed check, you are bitten and take 1d4 piercing damage, and the dogs count as 5 feet of difficult terrain.",
    },
    {
      roll: "7",
      complication:
        "You run into a brawl in progress. Make a DC 15 Strength (Athletics), Dexterity (Acrobatics), or Charisma (Intimidation) check (your choice) to get past the brawlers unimpeded. On a failed check, you take 2d4 bludgeoning damage, and the brawlers count as 10 feet of difficult terrain.",
    },
    {
      roll: "8",
      complication:
        "A beggar blocks your way. Make a DC 10 Strength (Athletics), Dexterity (Acrobatics), or Charisma (Intimidation) check (your choice) to slip past the beggar. You succeed automatically if you toss the beggar a coin. On a failed check, the beggar counts as 5 feet of difficult terrain.",
    },
    {
      roll: "9",
      complication:
        "An overzealous guard, (see the Monster Manual for game statistics), mistakes you for someone else. If you move 20 feet or more on your turn, the guard makes an opportunity attack against you with a spear (+3 to hit; 1d6 + 1 piercing damage on a hit)",
    },
    {
      roll: "10",
      complication:
        "You are forced to make a sharp turn to avoid colliding with something impassable. Make a DC 10 Dexterity saving throw to navigate the turn. On a failed save, you collide with something hard and take 1d4 bludgeoning damage.",
    },
    { roll: "11 — 20", complication: "No complication." },
  ];

  const wildernessComplications = [
    {
      roll: "1",
      complication:
        "Your path takes you through a rough patch of brush. Make a DC 10 Strength (Athletics) or Dexterity (Acrobatics) check (your choice) to get past the brush. On a failed check, the brush counts as 5 feet of difficult terrain.",
    },
    {
      roll: "2",
      complication:
        "Uneven ground threatens to slow your progress. Make a DC 10 Dexterity (Acrobatics) check to navigate the area. On a failed check, the ground counts as 10 feet of difficult terrain.",
    },
    {
      roll: "3",
      complication:
        "You run through a swarm of insects (see the Monster Manual for game statistics, with the DM choosing whichever kind of insects makes the most sense). The swarm makes an opportunity attack against you (+3 to hit; 4d4 piercing damage on a hit).",
    },
    {
      roll: "4",
      complication:
        "A stream, ravine, or rock bed blocks your path. Make a DC 10 Strength (Athletics) or Dexterity (Acrobatics) check (your choice) to cross the impediment. On a failed check, the impediment counts as 10 feet of difficult terrain.",
    },
    {
      roll: "5",
      complication:
        "Make a DC 10 Constitution saving throw. On a failed save, you are blinded by blowing sand, dirt, ash, snow, or pollen until the end of your turn. While blinded in this way, your speed is halved.",
    },
    {
      roll: "6",
      complication:
        "A sudden drop catches you by surprise. Make a DC 10 Dexterity saving throw to navigate the impediment. On a failed save, you fall 1d4 x 5 feet, taking 1d6 bludgeoning damage per 10 feet fallen as normal, and land prone.",
    },
    {
      roll: "7",
      complication:
        "You blunder into a hunter's snare. Make a DC 15 Dexterity saving throw to avoid it. On a failed save, you are caught in a net and restrained. See chapter 5, \"Equipment,\" of the Player's Handbook for rules on escaping a net.",
    },
    {
      roll: "8",
      complication:
        "You are caught in a stampede of spooked animals. Make a DC 10 Dexterity saving throw. On a failed save, you are knocked about and take 1d4 bludgeoning damage and 1d4 piercing damage.",
    },
    {
      roll: "9",
      complication:
        "Your path takes you near a patch of razorvine. Make a DC 15 Dexterity saving throw or use 10 feet of movement (your choice) to avoid the razorvine. On a failed save, you take 1d10 slashing damage.",
    },
    {
      roll: "10",
      complication:
        "A creature indigenous to the area chases after you. The DM chooses a creature appropriate for the terrain.",
    },
    { roll: "11 — 20", complication: "No complication." },
  ];

  return (
    <Card className="justify-start col-span-full hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary" />
          Chase Complications
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 254
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="urban" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="urban">Urban</TabsTrigger>
            <TabsTrigger value="wilderness">Wilderness</TabsTrigger>
          </TabsList>

          <TabsContent value="urban" className="mt-4">
            <TypographyH3 className="text-xl font-bold font-quotes mb-1">Urban Complications (D20)</TypographyH3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium w-18 text-center">d20</TableHead>
                  <TableHead className="font-medium">Complication</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urbanComplications.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.complication}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="wilderness" className="mt-4">
            <TypographyH3 className="text-xl font-bold font-quotes mb-1">Wilderness Complications (D20)</TypographyH3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium w-18 text-center">d20</TableHead>
                  <TableHead className="font-medium">Complication</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wildernessComplications.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.complication}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Carousing() {
  const carousingResults = [
    {
      roll: "1 — 10",
      result:
        "Jailed 1d4 days on charges of disorderly conduct, disturbing the peace. Pay a fine of 10gp to avoid jail time, or you can try to resist arrest.",
    },
    {
      roll: "11 — 20",
      result:
        "Regain consciousness in a strange place with no memory of how you got there. You have been robbed of 3d6 x 5 gp.",
    },
    {
      roll: "21 — 30",
      result:
        "You make an enemy. This person/organisation is now hostile to you. DM determines offended party, you decide how you offended them.",
    },
    {
      roll: "31 — 40",
      result:
        "Whirlwind romance. 25% the romance ends badly, 50% the romance is ongoing, 25% the romance ends amicably. You determine the identity of the love interest, subject to your DM's approval.",
    },
    {
      roll: "41 — 80",
      result: "Modest winnings from gambling. Recuperate your lifestyle expenses for the time spent carousing.",
    },
    {
      roll: "81 — 90",
      result:
        "Modest winnings from gambling. Recuperate your lifestyle expenses for the time spent carousing and gain 1d20 x 4 gp.",
    },
    {
      roll: "91+",
      result:
        "Make a small fortune gambling. Recuperate your lifestyle expenses for the time spent carousing and gain 4d6 x 10 gp.",
    },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiCarousel className="w-10 h-10 text-primary mb-1.5" />
          Carousing (Downtime)
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 128
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/20 rounded-lg border">
          <TypographyParagraph className="text-sm font-medium">
            Character spends money as per wealthy lifestyle (4gp/day base). At end of carousing period, the player rolls
            d100 + character level to see what happens, or DM chooses.
          </TypographyParagraph>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium w-28">D100 + Level</TableHead>
              <TableHead className="font-medium">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carousingResults.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold">{row.roll}</TableCell>
                <TableCell className="text-sm">{row.result}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Madness() {
  const shortTermMadness = [
    {
      roll: "01 — 20",
      effect: "Character retreats into their own mind and becomes paralysed. Effect ends if they take damage.",
    },
    { roll: "21 — 30", effect: "Incapacitated - spends duration screaming, weeping, laughing." },
    { roll: "31 — 40", effect: "Frightened - must use all actions to flee source of fear." },
    { roll: "41 — 50", effect: "Babbling, incapable of normal speech." },
    { roll: "51 — 60", effect: "Must attack nearest creature each round." },
    { roll: "61 — 70", effect: "Hallucinations and disadvantage on ability checks." },
    { roll: "71 — 75", effect: "Does whatever anyone tells them to as long as it's not obviously self-destructive" },
    { roll: "76 — 80", effect: "Overpowering urge to eat something strange (e.g. dirt, slime, offal)" },
    { roll: "81 — 90", effect: "Character is stunned" },
    { roll: "91 — 100", effect: "Character is unconscious" },
  ];

  const longTermMadness = [
    {
      roll: "01 — 10",
      effect: "Compelled to repeat a specific activity over and over, e.g. washing hands, counting coins, praying",
    },
    { roll: "11 — 20", effect: "Vivid hallucinations and disadvantage on ability checks" },
    { roll: "21 — 30", effect: "Extreme paranoia and disadvantage on WIS and CHA checks" },
    { roll: "31 — 40", effect: "Regards something (usually source of madness) with revulsion as per Antipathy spell" },
    { roll: "41 — 45", effect: "Powerful delusion - choose a (delusional) potion effect" },
    {
      roll: "46 — 55",
      effect: 'Attached to "lucky charm" (person or thing). Disadvantage on all rolls when more than 30\' from it.',
    },
    { roll: "56 — 65", effect: "Character is blinded (25%) or deafened (75%)" },
    { roll: "66 — 75", effect: "Uncontrollable tremors or tics. Disadvantage on all rolls that involve DEX or STR" },
    { roll: "76 — 85", effect: "Partial amnesia - knows themselves, but nobody else or any recent events" },
    { roll: "86 — 90", effect: "If any damage taken, make DC 15 WIS save or as if under Confusion spell for 1 minute" },
    { roll: "91 — 95", effect: "Character loses ability to speak" },
    { roll: "96 — 100", effect: "Falls unconscious, cannot be wakened." },
  ];

  const indefiniteFlaws = [
    { roll: "01 — 15", flaw: "Being drunk keeps me sane." },
    { roll: "16 — 25", flaw: "I keep whatever I find." },
    { roll: "26 — 30", flaw: "I try to become more like someone I know (adopts clothing, mannerisms, name etc.)" },
    { roll: "31 — 35", flaw: "I must bend the truth, exaggerate or lie to be interesting to other people" },
    {
      roll: "36 — 45",
      flaw: "Achieving my goal is the only thing of interest to me. I'll ignore all else to pursue it",
    },
    { roll: "46 — 50", flaw: "I find it hard to care about anything that goes on around me" },
    { roll: "51 — 55", flaw: "I don't like the way people are judging me all the time" },
    { roll: "56 — 70", flaw: "I am the smartest, wisest, strongest, fastest, most beautiful person I know" },
    { roll: "71 — 80", flaw: "Powerful enemies are hunting me. Their agents are everywhere, always watching." },
    { roll: "81 — 85", flaw: "There's only one person I can trust, and only I can see this special friend." },
    { roll: "86 — 95", flaw: "I can't take anything seriously. The more serious, the funnier I find it." },
    { roll: "96 — 100", flaw: "I've discovered that I really like killing people." },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiPotionOfMadness className="w-9 h-9 text-primary" />
          Madness
        </CardTitle>
        <CardDescription>Sometimes the stress of being an adventurer can be too much to bear.</CardDescription>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 258
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="short" className="w-full">
          <TabsList className="grid w-full xs:grid-cols-3 grid-cols-1">
            <TabsTrigger value="short">Short Term</TabsTrigger>
            <TabsTrigger value="long">Long Term</TabsTrigger>
            <TabsTrigger value="indefinite">Indefinite</TabsTrigger>
          </TabsList>

          <TabsContent value="short" className="mt-4">
            <TypographyH3 className="text-xl font-bold font-quotes mb-1">Short Term (lasts 1D10 minutes)</TypographyH3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium w-20">D100</TableHead>
                  <TableHead className="font-medium">Effect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shortTermMadness.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.effect}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="long" className="mt-4">
            <TypographyH3 className="text-xl font-bold font-quotes mb-1">
              Long Term (lasts 1D10 x 10 hours)
            </TypographyH3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium w-20">D100</TableHead>
                  <TableHead className="font-medium">Effect</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {longTermMadness.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.effect}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="indefinite" className="mt-4">
            <TypographyH3 className="text-xl font-bold font-quotes mb-1">
              Indefinite Flaw (lasts until cured)
            </TypographyH3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium w-20">D100</TableHead>
                  <TableHead className="font-medium">Flaw</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indefiniteFlaws.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.flaw}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        <div>
          <h4 className="text-lg font-bold font-quotes mt-4">Curing Madness</h4>
          <p className="mt-2 leading-loose text-sm">
            A <i>calm emotions spell</i> can suppress the effects of madness, while a <i>lesser restoration spell</i>{" "}
            can rid a character of a short-term or long-term madness. Depending on the source of the madness,{" "}
            <i>remove curse</i> or <i>dispel evil</i> might also prove effective. A <i>greater restoration spell</i> or
            more powerful magic is required to rid a character of indefinite madness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
const AdvancedEncountersSection: React.FC<AdvancedEncountersSectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-12 md:py-18 bg-linear-to-b from-background via-muted/40 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
            Advanced Encounters
          </TypographyH2>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-16">
            <Chases />
            <Traps />
            <ChaseComplications />
            <Carousing />
            <Madness />
          </div>

          {/* Advanced Encounters Tips */}
          <div className="py-6 md:py-8 px-8 md:px-12 bg-linear-to-r from-violet-50/50 via-indigo-50/30 to-purple-50/50 dark:from-violet-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-2xl border border-violet-200/50 dark:border-violet-800/50">
            <CardTitle className="mb-6 text-violet-700 dark:text-violet-300 flex items-center gap-3">
              <Sparkles className="w-7 h-7" />
              Advanced Encounter Design
            </CardTitle>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <GiTheater className="w-5 h-5" /> <span>Dynamic Elements</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>• Environmental hazards (lava, ice, poison gas)</li>
                  <li>• Moving terrain (collapsing bridges, shifting walls)</li>
                  <li>• Timed objectives (rescue missions, rituals)</li>
                  <li>• Interactive objects (levers, portals, altars)</li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <Sparkles className="w-5 h-5" /> <span>Encounter Balance</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>• CR is a guideline, not a rule</li>
                  <li>• Action economy matters most</li>
                  <li>• Consider party synergies and weaknesses</li>
                  <li>• Adjust mid-combat if needed</li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <GiTheater className="w-5 h-5" /> <span>Three-Act Structure</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>
                    • <strong>Setup:</strong> Initial positioning & threats
                  </li>
                  <li>
                    • <strong>Complication:</strong> New enemies or hazards
                  </li>
                  <li>
                    • <strong>Resolution:</strong> Final push or escape
                  </li>
                  <li>• Keep encounters evolving</li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <GiCastle className="w-5 h-5" /> <span>Terrain Features</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>• Elevation changes (high ground advantage)</li>
                  <li>• Cover and concealment options</li>
                  <li>• Difficult terrain placement</li>
                  <li>• Chokepoints and open areas</li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <GiCrossedSwords className="w-5 h-5" /> <span>Enemy Tactics</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>• Focus fire on vulnerable targets</li>
                  <li>• Use positioning and movement</li>
                  <li>• Exploit party weaknesses</li>
                  <li>• Retreat when appropriate</li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200/30 dark:border-violet-700/30">
                <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes">
                  <GiLightningStorm className="w-5 h-5" /> <span>Pacing Control</span>
                </p>
                <ul className="text-sm space-y-1 text-violet-700 dark:text-violet-300">
                  <li>• Vary encounter lengths</li>
                  <li>• Use initiative to build tension</li>
                  <li>• Know when to end early</li>
                  <li>• Balance resource management</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-violet-200/50 dark:border-violet-700/50 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes text-lg">
                    <GiLightBulb className="w-5 h-5" /> Quick Escalation Ideas:
                  </p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    Reinforcements arrive • Boss enters second phase • Environment becomes hostile • Objective changes
                    mid-fight • Ally needs rescue • Time limit imposed
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 font-quotes text-lg">
                    <GiDiceTwentyFacesTwenty className="w-5 h-5" /> On-the-Fly Adjustments:
                  </p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    Add/remove enemies • Adjust HP pools • Change terrain • Introduce complications • Modify enemy
                    behavior • Offer new options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedEncountersSection;

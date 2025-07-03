"use client";

import React, { useState } from "react";
import { HeartCrack, Flame, Info } from "lucide-react";

import { GiAnarchy, GiFootprint, GiGearHammer, GiGems, GiHeavyRain, GiTiredEye, GiTravelDress } from "react-icons/gi";
import { TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Badge } from "@/components/ui/badge";

interface AdvancedUtilitySectionProps {
  id: string;
}

function Objects() {
  const [selectedAC, setSelectedAC] = useState<{ object: string; ac: number } | null>(null);
  const [selectedHP, setSelectedHP] = useState<{ size: string; fragile: string; resilient: string } | null>(null);

  const objectAC = [
    { object: "Cloth, paper, rope", ac: 11 },
    { object: "Crystal, glass, ice", ac: 13 },
    { object: "Wood, bone", ac: 15 },
    { object: "Stone", ac: 17 },
    { object: "Iron, steel", ac: 19 },
    { object: "Mithril", ac: 21 },
    { object: "Adamantine", ac: 23 },
  ];

  const objectHP = [
    { size: "Tiny (bottle, lock)", fragile: "1d4", resilient: "2d4" },
    { size: "Small (chest, lute)", fragile: "1d6", resilient: "3d6" },
    { size: "Medium (barrel, chandelier)", fragile: "1d8", resilient: "4d8" },
    { size: "Large (cart, 10' sq. window)", fragile: "1d10", resilient: "5d10" },
  ];

  return (
    <Card className="hover:shadow-lg transition-all justify-start duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiAnarchy className="w-9 h-9 md:w-10 md:h-10 text-primary" />
          Objects
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 246
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <TypographyH3 className="text-xl font-bold font-quotes mb-3">Object Armour Class</TypographyH3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedAC ? `${selectedAC.object} (AC ${selectedAC.ac})` : "Select Material to View AC"}
                <GiGems className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel>Material AC Values</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {objectAC.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex justify-between cursor-pointer"
                  onClick={() => setSelectedAC(item)}
                >
                  <span>{item.object}</span>
                  <span className="font-bold">AC {item.ac}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedAC ? (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
              <div className="text-center">
                <span className="text-lg font-font-normal tracking-tight">{selectedAC.object}</span>
                <div className="text-2xl font-bold text-primary mt-1">AC {selectedAC.ac}</div>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <TypographyH3 className="text-xl font-bold font-quotes mb-3">Object Hit-Points (DMG p.247)</TypographyH3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedHP ? selectedHP.size : "Select Size to View HP"}
                <GiGearHammer className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel>Size HP Values</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {objectHP.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                  onClick={() => setSelectedHP(item)}
                >
                  <span className="font-medium">{item.size}</span>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Fragile: <strong>{item.fragile}</strong>
                    </span>
                    <span>
                      Resilient: <strong>{item.resilient}</strong>
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedHP ? (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
              <div className="text-center">
                <span className="text-lg font-normal tracking-tight">{selectedHP.size}</span>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Fragile</div>
                    <div className="text-xl font-bold text-primary">{selectedHP.fragile}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Resilient</div>
                    <div className="text-xl font-bold text-primary">{selectedHP.resilient}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Exhaustion() {
  const exhaustionLevels = [
    { level: 1, effect: "Disadvantage on Ability Checks" },
    { level: 2, effect: "Speed halved" },
    { level: 3, effect: "Disadvantage on attack rolls and saving throws" },
    { level: 4, effect: "Hit point maximum halved" },
    { level: 5, effect: "Speed reduced to 0" },
    { level: 6, effect: "Death" },
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiTiredEye className="md:w-11 md:h-11 w-9 h-9 text-primary" />
          Exhaustion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {exhaustionLevels.map((level) => (
            <div
              key={level.level}
              className="px-4 py-2 rounded-lg border transition-all hover:scale-[1.01] duration-500 bg-muted/20"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-muted text-muted-foreground">
                    {level.level}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium leading-relaxed font-quotes mt-0.5">{level.effect}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recovery Information */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-start gap-3">
            <Info className="w-8 h-8" />
            <div className="space-y-2 text-sm mt-[7px]">
              <p className="font-medium font-quotes">Recovery Rules:</p>
              <p>
                Finishing a Long Rest reduces exhaustion level by 1, provided the creature has ingested food and drink.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GroundSurfaceTracking() {
  const groundSurfaceData = [
    { surface: "Soft surface, e.g. snow, mud", dc: "10" },
    { surface: "Dirt or Grass", dc: "15" },
    { surface: "Bare Stone", dc: "20" },
    { surface: "Each day since creature passed", dc: "+5" },
    { surface: "Creature left a trail, e.g. blood", dc: "-5" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiFootprint className="w-9 h-9 text-primary" />
          Tracking
        </CardTitle>
        <CardDescription className="font-quotes">
          DC to track a creature based on ground surface and conditions.
        </CardDescription>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 244
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Ground Surface</TableHead>
              <TableHead className="font-medium text-center">DC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groundSurfaceData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.surface}</TableCell>
                <TableCell className="font-semibold text-center">{row.dc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OverlandTravelPace() {
  const travelPaceInfo = [
    "Fast Pace: increase distance by 1/3 (-5 to passive PER)",
    "Slow Pace: decrease distance by 1/3 (able to use Stealth)",
    "Difficult Terrain halves the distance travelled",
    "Forced March: Each hour of travel beyond 8 hours, each character must make a CON check at the end of the hour or take one level of Exhaustion. CON check DC = 10 + 1 per hour over 8.",
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiTravelDress className="w-10 h-10 text-primary" />
          Overland Travel Pace
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 242
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-2 bg-muted/20 rounded-lg border">
          <TypographyParagraph className="font-semibold text-center text-sm font-quotes">
            Base = Speed / 10 Miles per Hour
          </TypographyParagraph>
        </div>
        <ul className="space-y-2">
          {travelPaceInfo.map((info, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1 font-bold">•</span>
              <span className="text-sm leading-relaxed">{info}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function RandomWeather() {
  const temperatureData = [
    { roll: "1 —14", result: "Normal for the Season" },
    { roll: "15 —17", result: "4d6 °C colder than normal" },
    { roll: "18 —20", result: "4d6 °C warmer than normal" },
  ];

  const windData = [
    { roll: "1 —12", result: "None (or lessening)" },
    { roll: "13 —17", result: "Light (or stays the same)" },
    { roll: "18 —20", result: "Strong (or strengthening)" },
  ];

  const precipitationData = [
    { roll: "1 —12", result: "None" },
    { roll: "13 —17", result: "Light rain or snow" },
    { roll: "18 —20", result: "Heavy rain or snow" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiHeavyRain className="w-10 h-10 text-primary" />
          Random Weather
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 109
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="temperature">Temp</TabsTrigger>
            <TabsTrigger value="wind">Wind</TabsTrigger>
            <TabsTrigger value="precipitation">Rain</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-center">D20</TableHead>
                  <TableHead className="font-medium">Temperature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temperatureData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center tracking-wider">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="wind">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">D20</TableHead>
                  <TableHead className="font-medium">Wind</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {windData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="precipitation">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">D20</TableHead>
                  <TableHead className="font-medium">Precipitation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {precipitationData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-center">{row.roll}</TableCell>
                    <TableCell className="text-sm">{row.result}</TableCell>
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

function ImprovisingDamage() {
  const damageData = [
    { example: "Burned by coals, hit by falling book-case, pricked by poison needle", dice: "1d10" },
    { example: "Struck by lightning, stumbling into a fire-pit", dice: "2d10" },
    { example: "Hit by falling rubble, collapsing tunnel, stumble into vat of acid", dice: "4d10" },
    { example: "Crushed by compacting walls, hit by whirling steel blades, wading through lava stream", dice: "10d10" },
    { example: "Submerged in lava, hit by crashing flying fortress", dice: "18d10" },
    {
      example: "Tumble into vortex of Elemental Fire, crushed in jaws of god-like or moon-sized monster",
      dice: "24d10",
    },
    { example: "Rocks fall, everyone dies. Campaign ends.", dice: "∞d10" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Flame className="w-7 h-7 text-primary" />
          Improvising Damage
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 249
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Example</TableHead>
              <TableHead className="font-medium text-right">Dice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {damageData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.example}</TableCell>
                <TableCell className="text-right font-semibold text-primary tracking-wide">{row.dice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LingeringInjuries() {
  const injuryData = [
    { roll: "1", injury: "LOSE AN EYE. Disadvantage on Sight PER and Ranged attacks" },
    { roll: "2", injury: "LOSE AN ARM OR HAND." },
    {
      roll: "3",
      injury: "LOSE A FOOT OR LEG. 1/2 speed on foot, fall prone after Dash, Disadvantage on DEX/Balance checks",
    },
    { roll: "4", injury: "LIMP. Foot speed -5'. DC 10 DEX check after Dash or fall prone." },
    { roll: "5-7", injury: "INTERNAL INJURY. DC 15 CON check to act or react." },
    { roll: "8-10", injury: "BROKEN RIBS. As 5-7, but DC 10." },
    { roll: "11-13", injury: "HORRIBLE SCAR. Disadvantage on Persuasion, advantage on Intimidate." },
    { roll: "14-16", injury: "FESTERING WOUND. Hit-point maximum reduced by -1 per 24 hours." },
    { roll: "17-20", injury: "MINOR SCAR. No adverse effect." },
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-border bg-linear-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <HeartCrack className="w-7 h-7 text-primary" />
          Lingering Injuries
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          DMG &apos;14 p. 272
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium w-16 text-center">D20</TableHead>
              <TableHead className="font-medium">Injury</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {injuryData.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold text-center tracking-wide">{row.roll}</TableCell>
                <TableCell>{row.injury}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const AdvancedUtilitySection: React.FC<AdvancedUtilitySectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-12 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
            Advanced Utility
          </TypographyH2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <Objects />
            <Exhaustion />
          </div>

          {/* Tracking, Travel, and Weather Row */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <GroundSurfaceTracking />
            <OverlandTravelPace />
            <RandomWeather />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
            <ImprovisingDamage />
            <LingeringInjuries />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedUtilitySection;

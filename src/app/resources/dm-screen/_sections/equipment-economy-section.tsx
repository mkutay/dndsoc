"use client";

import React from "react";
import {
  Shield,
  Swords,
  SquareKanban,
  Coins,
  Users,
  DicesIcon,
  ScrollText,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TypographyH2,
  TypographyH3,
} from "@/components/typography/headings";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyHr } from "@/components/typography/blockquote";
import { GiCapeArmor, GiDroplets, GiJigsawBox, GiMagicLamp, GiPointySword, GiSlap, GiTavernSign, GiTwoCoins } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";

interface EquipmentEconomySectionProps {
  id: string;
}

function ArmourTable() {
  const light = [
    {
      type: "Padded",
      cost: "5 gp",
      ac: "11 + DEX",
      str: "—",
      stealth: "Disadvantage",
      weight: "8 lb",
    },
    {
      type: "Leather",
      cost: "10 gp",
      ac: "11 + DEX",
      str: "—",
      stealth: "—",
      weight: "10 lb",
    },
    {
      type: "Studded Leather",
      cost: "45 gp",
      ac: "12 + DEX",
      str: "—",
      stealth: "—",
      weight: "13 lb",
    }
  ];

  const medium = [
    {
      type: "Hide",
      cost: "10 gp",
      ac: "12 + DEX (max +2)",
      str: "—",
      stealth: "—",
      weight: "12 lb",
    },
    {
      type: "Chain Shirt",
      cost: "50 gp",
      ac: "13 + DEX (max +2)",
      str: "—",
      stealth: "—",
      weight: "20 lb",
    },
    {
      type: "Scale Mail",
      cost: "50 gp",
      ac: "14 + DEX (max +2)",
      str: "—",
      stealth: "Disadvantage",
      weight: "45 lb",
    },
    {
      type: "Breastplate",
      cost: "400 gp",
      ac: "14 + DEX (max +2)",
      str: "—",
      stealth: "—",
      weight: "20 lb",
    },
    {
      type: "Half Plate",
      cost: "750 gp",
      ac: "15 + DEX (max +2)",
      str: "—",
      stealth: "Disadvantage",
      weight: "40 lb",
    }
  ];

  const heavy = [
    {
      type: "Ring Mail",
      cost: "30 gp",
      ac: "14",
      str: "—",
      stealth: "Disadvantage",
      weight: "40 lb",
    },
    {
      type: "Chain Mail",
      cost: "75 gp",
      ac: "16",
      str: "STR 13",
      stealth: "Disadvantage",
      weight: "55 lb",
    },
    {
      type: "Splint",
      cost: "200 gp",
      ac: "17",
      str: "STR 15",
      stealth: "Disadvantage",
      weight: "60 lb",
    },
    {
      type: "Plate",
      cost: "1,500 gp",
      ac: "18",
      str: "STR 15",
      stealth: "Disadvantage",
      weight: "65 lb",
    }
  ];

  const shield = [
    {
      type: "Shield",
      cost: "10 gp",
      ac: "+2",
      str: "—",
      stealth: "—",
      weight: "6 lb",
    }
  ];
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiCapeArmor className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Armour
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB &apos;14, p. 144
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="light">
          <TabsList className="w-full justify-between">
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="heavy">Heavy</TabsTrigger>
            <TabsTrigger value="shield">Shield</TabsTrigger>
          </TabsList>

          <TypographyHr className="my-4" />

          <TabsContent value="light">
            <div className="font-quotes text-sm text-muted-foreground mb-2 text-center">
              Don: 1 min, Doff: 1 min.
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Armor</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>AC</TableHead>
                    <TableHead>STR Req</TableHead>
                    <TableHead>Stealth</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {light.map((armor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {armor.type}
                      </TableCell>
                      <TableCell>{armor.cost}</TableCell>
                      <TableCell>{armor.ac}</TableCell>
                      <TableCell>{armor.str}</TableCell>
                      <TableCell>{armor.stealth}</TableCell>
                      <TableCell>{armor.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" /> {/* Added */}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="medium">
            <div className="font-quotes text-sm text-muted-foreground mb-2 text-center">
              Don: 5 min, Doff: 1 min.
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Armor</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>AC</TableHead>
                    <TableHead>STR Req</TableHead>
                    <TableHead>Stealth</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medium.map((armor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {armor.type}
                      </TableCell>
                      <TableCell>{armor.cost}</TableCell>
                      <TableCell>{armor.ac}</TableCell>
                      <TableCell>{armor.str}</TableCell>
                      <TableCell>{armor.stealth}</TableCell>
                      <TableCell>{armor.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" /> {/* Added */}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="heavy">
            <div className="font-quotes text-sm text-muted-foreground mb-2 text-center">
              Don: 10 min, Doff: 5 min.
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Armor</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>AC</TableHead>
                    <TableHead>STR Req</TableHead>
                    <TableHead>Stealth</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heavy.map((armor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {armor.type}
                      </TableCell>
                      <TableCell>{armor.cost}</TableCell>
                      <TableCell>{armor.ac}</TableCell>
                      <TableCell>{armor.str}</TableCell>
                      <TableCell>{armor.stealth}</TableCell>
                      <TableCell>{armor.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" /> {/* Added */}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shield">
            <div className="font-quotes text-sm text-muted-foreground mb-2 text-center">
              Don: 1 action, Doff: 1 action.
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Armor</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>AC</TableHead>
                    <TableHead>STR Req</TableHead>
                    <TableHead>Stealth</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shield.map((armor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {armor.type}
                      </TableCell>
                      <TableCell>{armor.cost}</TableCell>
                      <TableCell>{armor.ac}</TableCell>
                      <TableCell>{armor.str}</TableCell>
                      <TableCell>{armor.stealth}</TableCell>
                      <TableCell>{armor.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" /> {/* Added */}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function WeaponsTable() {
  const simpleMelee = [
    {
      name: "Club",
      cost: "1 sp",
      damage: "1d4 B",
      weight: "2 lb",
      properties: "Light"
    },
    {
      name: "Dagger",
      cost: "2 gp",
      damage: "1d4 P",
      weight: "1 lb",
      properties: "Finesse, light, thrown (range 20/60)"
    },
    {
      name: "Greatclub",
      cost: "2 sp",
      damage: "1d8 B",
      weight: "10 lb",
      properties: "Two-handed"
    },
    {
      name: "Handaxe",
      cost: "5 gp",
      damage: "1d6 S",
      weight: "2 lb",
      properties: "Light, thrown (range 20/60)"
    },
    {
      name: "Javelin",
      cost: "5 sp",
      damage: "1d6 P",
      weight: "2 lb",
      properties: "Thrown (range 30/120)"
    },
    {
      name: "Light Hammer",
      cost: "2 gp",
      damage: "1d4 B",
      weight: "2 lb",
      properties: "Light, thrown (range 20/60)"
    },
    {
      name: "Mace",
      cost: "5 gp",
      damage: "1d6 B",
      weight: "4 lb",
      properties: "—"
    },
    {
      name: "Quarterstaff",
      cost: "2 sp",
      damage: "1d6 B",
      weight: "4 lb",
      properties: "Versatile (1d8)"
    },
    {
      name: "Sickle",
      cost: "1 gp",
      damage: "1d4 S",
      weight: "2 lb",
      properties: "Light"
    },
    {
      name: "Spear",
      cost: "1 gp",
      damage: "1d6 P",
      weight: "3 lb",
      properties: "Thrown (range 20/60), versatile (1d8)"
    },
    {
      name: "Unarmed Strike",
      cost: "—",
      damage: "1 B",
      weight: "—",
      properties: "—"
    }
  ];

  const simpleRanged = [
    {
      name: "Crossbow, light",
      cost: "25 gp",
      damage: "1d8 P",
      weight: "5 lb",
      properties: "Ammunition (range 80/320), loading, two-handed"
    },
    {
      name: "Dart",
      cost: "5 cp",
      damage: "1d4 P",
      weight: "1/4 lb",
      properties: "Finesse, thrown (range 20/60)"
    },
    {
      name: "Shortbow",
      cost: "25 gp",
      damage: "1d6 P",
      weight: "2 lb",
      properties: "Ammunition (range 80/320), two-handed"
    },
    {
      name: "Sling",
      cost: "1 sp",
      damage: "1d4 B",
      weight: "—",
      properties: "Ammunition (range 30/120)"
    }
  ];

  const martialMelee = [
    {
      name: "Battleaxe",
      cost: "10 gp",
      damage: "1d8 S",
      weight: "4 lb",
      properties: "Versatile (1d10)"
    },
    {
      name: "Flail",
      cost: "10 gp",
      damage: "1d8 B",
      weight: "2 lb",
      properties: "—"
    },
    {
      name: "Glaive",
      cost: "20 gp",
      damage: "1d10 S",
      weight: "6 lb",
      properties: "Heavy, reach, two-handed"
    },
    {
      name: "Greataxe",
      cost: "30 gp",
      damage: "1d12 S",
      weight: "7 lb",
      properties: "Heavy, two-handed"
    },
    {
      name: "Greatsword",
      cost: "50 gp",
      damage: "2d6 S",
      weight: "6 lb",
      properties: "Heavy, two-handed"
    },
    {
      name: "Halberd",
      cost: "20 gp",
      damage: "1d10 S",
      weight: "6 lb",
      properties: "Heavy, reach, two-handed"
    },
    {
      name: "Lance",
      cost: "10 gp",
      damage: "1d12 P",
      weight: "6 lb",
      properties: "Reach, special"
    },
    {
      name: "Longsword",
      cost: "15 gp",
      damage: "1d8 S",
      weight: "3 lb",
      properties: "Versatile (1d10)"
    },
    {
      name: "Maul",
      cost: "10 gp",
      damage: "2d6 B",
      weight: "10 lb",
      properties: "Heavy, two-handed"
    },
    {
      name: "Morningstar",
      cost: "15 gp",
      damage: "1d8 P",
      weight: "4 lb",
      properties: "—"
    },
    {
      name: "Pike",
      cost: "5 gp",
      damage: "1d10 P",
      weight: "18 lb",
      properties: "Heavy, reach, two-handed"
    },
    {
      name: "Rapier",
      cost: "25 gp",
      damage: "1d8 P",
      weight: "2 lb",
      properties: "Finesse"
    },
    {
      name: "Scimitar",
      cost: "25 gp",
      damage: "1d6 S",
      weight: "3 lb",
      properties: "Finesse, light"
    },
    {
      name: "Shortsword",
      cost: "10 gp",
      damage: "1d6 P",
      weight: "2 lb",
      properties: "Finesse, light"
    },
    {
      name: "Trident",
      cost: "5 gp",
      damage: "1d6 P",
      weight: "4 lb",
      properties: "Thrown (range 20/60), versatile (1d8)"
    },
    {
      name: "War Pick",
      cost: "5 gp",
      damage: "1d8 P",
      weight: "2 lb",
      properties: "—"
    },
    {
      name: "Warhammer",
      cost: "15 gp",
      damage: "1d8 B",
      weight: "2 lb",
      properties: "Versatile (1d10)"
    },
    {
      name: "Whip",
      cost: "2 gp",
      damage: "1d4 S",
      weight: "3 lb",
      properties: "Finesse, reach"
    }
  ];

  const martialRanged = [
    {
      name: "Blowgun",
      cost: "10 gp",
      damage: "1 P",
      weight: "1 lb",
      properties: "Ammunition (range 25/100), loading"
    },
    {
      name: "Crossbow, hand",
      cost: "75 gp",
      damage: "1d6 P",
      weight: "3 lb",
      properties: "Ammunition (range 30/120), light, loading"
    },
    {
      name: "Crossbow, heavy",
      cost: "50 gp",
      damage: "1d10 P",
      weight: "18 lb",
      properties: "Ammunition (range 100/400), heavy, loading, two-handed"
    },
    {
      name: "Longbow",
      cost: "50 gp",
      damage: "1d8 P",
      weight: "2 lb",
      properties: "Ammunition (range 150/600), heavy, two-handed"
    },
    {
      name: "Net",
      cost: "1 gp",
      damage: "—",
      weight: "3 lb",
      properties: "Special, thrown (range 5/15)"
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
          <GiPointySword className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Weapons
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB &apos;14, p. 149
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simple-melee">
          <TabsList className="w-full justify-between flex-none grid sm:grid-cols-4 xs:grid-cols-2 grid-cols-1 gap-2">
            <TabsTrigger value="simple-melee">Simple Melee</TabsTrigger>
            <TabsTrigger value="simple-ranged">Simple Ranged</TabsTrigger>
            <TabsTrigger value="martial-melee">Martial Melee</TabsTrigger>
            <TabsTrigger value="martial-ranged">Martial Ranged</TabsTrigger>
          </TabsList>

          <TypographyHr className="my-4" />

          <TabsContent value="simple-melee">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Damage</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simpleMelee.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{weapon.name}</TableCell>
                      <TableCell>{weapon.cost}</TableCell>
                      <TableCell>{weapon.damage}</TableCell>
                      <TableCell>{weapon.weight}</TableCell>
                      <TableCell>{weapon.properties}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="simple-ranged">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Damage</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simpleRanged.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{weapon.name}</TableCell>
                      <TableCell>{weapon.cost}</TableCell>
                      <TableCell>{weapon.damage}</TableCell>
                      <TableCell>{weapon.weight}</TableCell>
                      <TableCell>{weapon.properties}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="martial-melee">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Damage</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {martialMelee.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{weapon.name}</TableCell>
                      <TableCell>{weapon.cost}</TableCell>
                      <TableCell>{weapon.damage}</TableCell>
                      <TableCell>{weapon.weight}</TableCell>
                      <TableCell>{weapon.properties}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="martial-ranged">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Damage</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {martialRanged.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{weapon.name}</TableCell>
                      <TableCell>{weapon.cost}</TableCell>
                      <TableCell>{weapon.damage}</TableCell>
                      <TableCell>{weapon.weight}</TableCell>
                      <TableCell>{weapon.properties}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ContainerCapacity() {
  const containers = [
    { name: "Backpack", capacity: "1 ft³ / 30 lbs" },
    { name: "Barrel", capacity: "40 gall / 4 ft³" },
    { name: "Basket", capacity: "2 ft³ / 40 lbs" },
    { name: "Bottle", capacity: "1½ pints" },
    { name: "Bucket", capacity: "3 gall / ½ ft³" },
    { name: "Chest", capacity: "12 ft³ / 300 lbs" },
    { name: "Flask/Tankard", capacity: "1 pint" },
    { name: "Jug/Pitcher", capacity: "1 gallon" },
    { name: "Pot, iron", capacity: "1 gallon" },
    { name: "Pouch", capacity: "⅕ ft³ / 6 lbs" },
    { name: "Sack", capacity: "1 ft³ / 30 lbs" },
    { name: "Vial", capacity: "4 oz liquid" },
    { name: "Waterskin", capacity: "4 pints" }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/20 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiJigsawBox className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Container Capacity
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground font-quotes">
          (p.s. you can scroll vertically)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Container</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((container, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{container.name}</TableCell>
                  <TableCell>{container.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function Services() {
  const services = [
    { service: "Coach cab (Between towns)", pay: "3 cp/mile" },
    { service: "Coach cab (Within a city)", pay: "1 cp" },
    { service: "Hireling (Skilled)", pay: "2 gp/day" },
    { service: "Hireling (Unskilled)", pay: "2 sp/day" },
    { service: "Messenger", pay: "2 cp/mile" },
    { service: "Road or gate toll", pay: "1 cp" },
    { service: "Ship's passage", pay: "1 sp/mile" }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/20 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiSlap className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{service.service}</TableCell>
                <TableCell>{service.pay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LifestyleExpenses() {
  const lifestyles = [
    { lifestyle: "Wretched", cost: "—" },
    { lifestyle: "Squalid", cost: "1 sp" },
    { lifestyle: "Poor", cost: "2 sp" },
    { lifestyle: "Modest", cost: "1 gp" },
    { lifestyle: "Comfortable", cost: "2 gp" },
    { lifestyle: "Wealthy", cost: "4 gp" },
    { lifestyle: "Aristocratic", cost: "10 gp min." }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/20 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiTwoCoins className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Lifestyle Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lifestyle</TableHead>
              <TableHead>Cost/Day</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lifestyles.map((lifestyle, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{lifestyle.lifestyle}</TableCell>
                <TableCell>{lifestyle.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function FoodDrinkLodging() {
  const generalItems = [
    { item: "Ale (Gallon)", cost: "2 sp" },
    { item: "Ale (Mug)", cost: "4 cp" },
    { item: "Banquet (per person)", cost: "10 gp" },
    { item: "Bread, loaf", cost: "2 cp" },
    { item: "Cheese, hunk", cost: "1 sp" },
    { item: "Meat, chunk", cost: "3 sp" },
    { item: "Wine (Common Pitcher)", cost: "2 sp" },
    { item: "Wine (Fine Bottle)", cost: "10 gp" }
  ];

  const innStay = [
    { type: "Squalid", cost: "7 cp" },
    { type: "Poor", cost: "1 sp" },
    { type: "Modest", cost: "5 sp" },
    { type: "Comfortable", cost: "8 sp" },
    { type: "Wealthy", cost: "2 gp" },
    { type: "Aristocratic", cost: "4 gp" }
  ];

  const meals = [
    { type: "Squalid", cost: "3 cp" },
    { type: "Poor", cost: "6 cp" },
    { type: "Modest", cost: "3 sp" },
    { type: "Comfortable", cost: "5 sp" },
    { type: "Wealthy", cost: "8 sp" },
    { type: "Aristocratic", cost: "2 gp" }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/20 justify-start">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
          <GiTavernSign className="w-8 md:w-9 h-8 md:h-9 text-primary" />
          Food, Drink & Lodging
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB &apos;14, p. 158
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="w-full justify-between flex-none grid xs:grid-cols-3 grid-cols-1 gap-2">
            <TabsTrigger value="general">General Items</TabsTrigger>
            <TabsTrigger value="inn">Inn Stay</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
          </TabsList>

          <TypographyHr className="my-0 mt-8 mb-2" />

          <TabsContent value="general">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generalItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="inn">
            <div className="space-y-2 mb-4">
              <TypographyH3 className="text-lg font-semibold">Inn Stay (per day)</TypographyH3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {innStay.map((stay, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{stay.type}</TableCell>
                    <TableCell>{stay.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="meals">
            <div className="space-y-2 mb-4">
              <TypographyH3 className="text-lg font-semibold">Meals (per day)</TypographyH3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{meal.type}</TableCell>
                    <TableCell>{meal.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        <TypographyParagraph className="text-sm italic mt-4 pt-4 border-t border-border/50">
          <strong>Additional Resources:</strong> Mounts & Other Animals, Tack, Harness & Drawn Vehicles, Waterborne Vehicles — See PHB p.157
        </TypographyParagraph>
      </CardContent>
    </Card>
  );
}

function FoodWaterNeeds() {
  const dailyNeeds = [
    {
      size: "Tiny",
      requirements: "¼ lb food, ½ gal water"
    },
    {
      size: "Small/Medium",
      requirements: "1 lb food, 1 gal water"
    },
    {
      size: "Large",
      requirements: "4 lbs food, 4 gal water"
    },
    {
      size: "Huge",
      requirements: "16 lbs food, 16 gal water"
    },
    {
      size: "Gargantuan",
      requirements: "64 lbs food, 64 gal water"
    }
  ];

  const foragingDCs = [
    {
      availability: "Abundant",
      dc: "10"
    },
    {
      availability: "Limited",
      dc: "15"
    },
    {
      availability: "Very little",
      dc: "20"
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/20 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiDroplets className="md:w-10 md:h-10 w-8 h-8 text-primary" />
          Food & Water Needs
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB &apos;14, p. 185
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Daily Requirements Section */}
          <div>
            <div className="mb-2">
              <TypographyH3>Per Day Requirements</TypographyH3>
              <div className="text-sm text-muted-foreground font-quotes">
                *Water needs double in hot conditions
              </div>
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creature Size</TableHead>
                    <TableHead>Food & Water</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyNeeds.map((need, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{need.size}</TableCell>
                      <TableCell>{need.requirements}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Foraging Section */}
          <div>
            <div className="mb-2">
              <TypographyH3>Foraging Difficulty</TypographyH3>
              <div className="text-sm text-muted-foreground font-quotes">
                Wisdom (Survival) check to find food and water
              </div>
            </div>
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Availability</TableHead>
                    <TableHead>DC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foragingDCs.map((dc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dc.availability}</TableCell>
                      <TableCell>{dc.dc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MagicItemEconomy() {
  const saleableItemsData = [
    { rarity: "Common", basePrice: "100 gp", daysToFind: "1d4", rollModifier: "+10" },
    { rarity: "Uncommon", basePrice: "500 gp", daysToFind: "1d6", rollModifier: "+0" },
    { rarity: "Rare", basePrice: "5,000 gp", daysToFind: "1d8", rollModifier: "-10" },
    { rarity: "Very Rare", basePrice: "50,000 gp", daysToFind: "1d10", rollModifier: "-20" },
  ];

  const sellingResultsData = [
    { roll: "20 or lower", result: "offering 1 /10 of the base price" },
    { roll: "21-40", result: "offering 1 /4 of the base price" },
    { roll: "41-80", result: "offering 1 /2 of the base price" },
    { roll: "81-90", result: "offering the full base price" },
    { roll: "91 or higher", result: "A shady buyer offering 3 /2 × the base price, no questions asked" },
  ];

  const craftingData = [
    { rarity: "Common", cost: "100 gp", minLevel: "3" },
    { rarity: "Uncommon", cost: "500 gp", minLevel: "3" },
    { rarity: "Rare", cost: "5,000 gp", minLevel: "6" },
    { rarity: "Very Rare", cost: "50,000 gp", minLevel: "11" },
    { rarity: "Legendary", cost: "500,000 gp", minLevel: "17" },
  ];

  return (
    <Card className="justify-start hover:shadow-lg transition-all duration-300 border-2 border-border bg-gradient-to-br from-card to-card/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiMagicLamp className="w-9 h-9 text-primary" />
          Magic Item Economy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" className="space-y-2">
          <AccordionItem value="saleable-items">
            <AccordionTrigger className="text-xl font-bold font-quotes">
              Saleable Magic Items
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Rarity</TableHead>
                    <TableHead className="font-medium">Base Price</TableHead>
                    <TableHead className="font-medium">Days to Find Buyer</TableHead>
                    <TableHead className="font-medium">D100 Roll Modifier*</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleableItemsData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row.rarity}</TableCell>
                      <TableCell>{row.basePrice}</TableCell>
                      <TableCell>{row.daysToFind}</TableCell>
                      <TableCell className="text-center">{row.rollModifier}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="text-left text-sm text-muted-foreground italic mt-0">
                  *Apply to rolls on Selling a Magic Item table
                </TableCaption>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="selling-items">
            <AccordionTrigger className="text-xl font-bold font-quotes">
              Selling a Magic Item
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium w-28">D100 + Mod.</TableHead>
                    <TableHead className="font-medium">You Find a Buyer...</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellingResultsData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row.roll}</TableCell>
                      <TableCell className="text-sm">{row.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crafting-items">
            <AccordionTrigger className="text-xl font-bold font-quotes">
              Crafting Magic Items
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Rarity</TableHead>
                    <TableHead className="font-medium">Creation Cost</TableHead>
                    <TableHead className="font-medium">Minimum Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {craftingData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row.rarity}</TableCell>
                      <TableCell>{row.cost}</TableCell>
                      <TableCell className="text-center">{row.minLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

const EquipmentEconomySection: React.FC<EquipmentEconomySectionProps> = ({
  id,
}) => {
  return (
    <section id={id} className="py-12 md:py-18">
      <div className="max-w-6xl mx-auto px-4">
        <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
          Equipment & Economy
        </TypographyH2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-16">
          <div className="flex flex-col gap-6 md:gap-8 h-full">
            <ArmourTable />
            <MagicItemEconomy />
          </div>
          <WeaponsTable />

          {/* Other Economy Tables */}
          <div className="col-span-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <ContainerCapacity />
              <Services />
              <LifestyleExpenses />
            </div>
          </div>

          <div className="col-span-full grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-8">
            <FoodDrinkLodging />
            <FoodWaterNeeds />
          </div>
        </div>

        {/* Equipment & Economy Tips */}
        <Card className="mx-auto w-fit rounded-2xl border-2 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DicesIcon className="w-6 h-6" />
              Equipment & Economy Tips
            </CardTitle>
            <CardDescription className="max-w-prose">
              Managing equipment and economy in your campaign can enhance player engagement and immersion. Here are some tips:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Encourage players to think creatively about their equipment choices.</li>
              <li>Use economy as a narrative tool to drive player decisions.</li>
              <li>Incorporate unique items that have special significance in the story.</li>
              <li>Balance treasure distribution to maintain excitement without overwhelming players.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EquipmentEconomySection;
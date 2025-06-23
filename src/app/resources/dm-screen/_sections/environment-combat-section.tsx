import {
  Sun,
  Move,
  Skull,
  Scale,
  Sparkles,
  Crown,
  Droplets,
  TreeDeciduous,
} from "lucide-react";
import {
  GiAcid,
  GiWarhammer,
  GiIciclesAura,
  GiFlame,
  GiMagicSwirl,
  GiDeathSkull,
  GiSwordsPower,
  GiPoisonBottle,
  GiBrain,
  GiSunbeams,
  GiSlashedShield,
  GiThunderBlade,
  GiFocusedLightning,
  GiCampfire,
  GiJumpAcross,
  GiSpikedWall,
  GiConcentrationOrb,
  GiScales,
} from "react-icons/gi";

import {
  TypographyH2,
  TypographyH3,
} from "@/components/typography/headings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyHr } from "@/components/typography/blockquote";
import { Latex } from "@/components/latex";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconType } from "react-icons";
import { Badge } from "@/components/ui/badge";

interface EnvironmentCombatSectionProps {
  id: string;
}

function LightSources() {
  const mundaneSources = [
    { source: "Candle", bright: "5' radius", dim: "+5' radius", duration: "1 hour" },
    { source: "Lamp", bright: "15' radius", dim: "+30' radius", duration: "6 hours" },
    { source: "Lantern, bullseye", bright: "60' cone", dim: "+60' cone", duration: "6 hours" },
    { source: "Lantern, hooded", bright: "30' radius", dim: "+30' radius", duration: "6 hours" },
    { source: "Torch", bright: "20' radius", dim: "+20' radius", duration: "1 hour" }
  ];

  const magicSources = [
    { source: "Continual Flame", bright: "20' radius", dim: "+20' radius", duration: "Until dispelled" },
    { source: "Dancing Lights", bright: "—", dim: "10' radius", duration: "Up to 1 min" },
    { source: "Faerie Fire", bright: "—", dim: "10' radius", duration: "Up to 1 min" },
    { source: "Flame Blade", bright: "10' radius", dim: "+10' radius", duration: "Up to 10 mins" },
    { source: "Flaming Sphere", bright: "20' radius", dim: "+20' radius", duration: "Up to 1 min" },
    { source: "Holy Aura", bright: "—", dim: "5' radius", duration: "Up to 1 min" },
    { source: "Light", bright: "20' radius", dim: "+20' radius", duration: "1 hour" },
    { source: "Moonbeam", bright: "—", dim: "5' radius cylinder", duration: "Up to 1 min" },
    { source: "Prismatic Wall", bright: "100'", dim: "+100'", duration: "10 mins" },
    { source: "Wall of Fire", bright: "60'", dim: "+60'", duration: "Up to 1 min" }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiCampfire className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Light Sources
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB &apos;14, p. 183
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mundane">
          <TabsList className="w-full gap-2">
            <TabsTrigger value="mundane">Mundane</TabsTrigger>
            <TabsTrigger value="magic">Magic</TabsTrigger>
          </TabsList>

          <TypographyHr className="my-0 mt-7 mb-4" />

          <TabsContent value="mundane">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Bright Light</TableHead>
                  <TableHead>Dim Light</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mundaneSources.map((light, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{light.source}</TableCell>
                    <TableCell>{light.bright}</TableCell>
                    <TableCell>{light.dim}</TableCell>
                    <TableCell>{light.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="magic">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Bright Light</TableHead>
                  <TableHead>Dim Light</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {magicSources.map((light, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{light.source}</TableCell>
                    <TableCell>{light.bright}</TableCell>
                    <TableCell>{light.dim}</TableCell>
                    <TableCell>{light.duration}</TableCell>
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

function Jumping() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
          <GiJumpAcross className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Jumping
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-xl font-titles-of-tables tracking-tighter mb-2">
              Long Jump
            </div>
            <p>
              <strong className="font-quotes text-base">With 10&apos; run-up:</strong> 1 foot per point of Strength score
            </p>
            <p className="mt-1">
              <strong className="font-quotes text-base">From standing:</strong> Half that distance
            </p>
          </div>
          <div>
            <div className="text-xl font-titles-of-tables tracking-tighter mb-2">
              High Jump
            </div>
            <p>
              <strong className="font-quotes text-base">With 10&apos; run-up:</strong> 3 + Strength modifier (in feet)
            </p>
            <p className="mt-1">
              <strong className="font-quotes text-base">From standing:</strong> Half that distance
            </p>
            <div className="flex gap-1.5 mt-1">
              <strong className="font-quotes text-base">Maximum reach:</strong> <Latex latexString="\text{jump height} + \frac{1}{2} \times \text{character height}" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Suffocating() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiSpikedWall className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Suffocating
        </CardTitle>
        <Badge className="w-fit" variant="secondary">
          PHB '14, p. 183
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <TypographyParagraph>
          <strong className="font-quotes text-lg">Holding Breath:</strong> A creature can hold its breath for 1 + Constitution modifier minutes (minimum 30 seconds).
        </TypographyParagraph>
        <TypographyParagraph>
          <strong className="font-quotes text-lg">When breath runs out:</strong> The creature can survive for a number of rounds equal to its Constitution modifier.
        </TypographyParagraph>
        <TypographyParagraph>
          <strong className="font-quotes text-lg">After that:</strong> At the start of its next turn, it drops to 0 hit points and is dying.
        </TypographyParagraph>
      </CardContent>
    </Card>
  );
}

function SizeCategories() {
  const sizes = [
    { size: "Tiny", space: "2½ × 2½ ft", hitDie: "d4", examples: "Imp, sprite" },
    { size: "Small", space: "5 × 5 ft", hitDie: "d6", examples: "Giant rat, goblin" },
    { size: "Medium", space: "5 × 5 ft", hitDie: "d8", examples: "Orc, werewolf" },
    { size: "Large", space: "10 × 10 ft", hitDie: "d10", examples: "Hippogriff, ogre" },
    { size: "Huge", space: "15 × 15 ft", hitDie: "d12", examples: "Fire giant, treant" },
    { size: "Gargantuan", space: "20 × 20 ft or larger", hitDie: "d20", examples: "Kraken, purple worm" }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GiScales className="w-9 md:w-10 h-9 md:h-10 text-primary" />
          Size Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Space</TableHead>
              <TableHead>Hit Die</TableHead>
              <TableHead>Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((size, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{size.size}</TableCell>
                <TableCell>{size.space}</TableCell>
                <TableCell>{size.hitDie}</TableCell>
                <TableCell>{size.examples}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Concentration() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 border-primary/40 bg-gradient-to-br from-card to-card/80 justify-start">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
          <GiConcentrationOrb className="w-8 md:w-10 h-8 md:h-10 text-primary" />
          Concentration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TypographyParagraph className="text-base">
          Normal activities such as moving or attacking do not interfere with concentration.
        </TypographyParagraph>
        
        <div className="space-y-3">
          <TypographyH3 className="text-xl font-semibold">Concentration can be broken by:</TypographyH3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Casting another spell that requires concentration
            </li>
            <li>
              <strong className="font-quotes text-lg">Taking damage:</strong> CON save (DC = 10 or half damage taken, whichever is higher)
            </li>
            <li>
              Being incapacitated or killed
            </li>
            <li>
              <strong className="font-quotes text-lg">Environmental phenomena:</strong> Wave, loud noise, blinding flash (DC 10 CON save)
            </li>
            <li>
              <strong className="font-quotes text-lg">Vigorous movement:</strong> Combat, running, climbing (DC 10 CON save)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function RatingXP() {
  const ratings = [
    { rating: "0", proficiency: "+2", xp: "0 or 10" },
    { rating: "1/8", proficiency: "+2", xp: "25" },
    { rating: "1/4", proficiency: "+2", xp: "50" },
    { rating: "1/2", proficiency: "+2", xp: "100" },
    { rating: "1", proficiency: "+2", xp: "200" },
    { rating: "2", proficiency: "+2", xp: "450" },
    { rating: "3", proficiency: "+2", xp: "700" },
    { rating: "4", proficiency: "+2", xp: "1,100" },
    { rating: "5", proficiency: "+3", xp: "1,800" },
    { rating: "6", proficiency: "+3", xp: "2,300" },
    { rating: "7", proficiency: "+3", xp: "2,900" },
    { rating: "8", proficiency: "+3", xp: "3,900" },
    { rating: "9", proficiency: "+4", xp: "5,000" },
    { rating: "10", proficiency: "+4", xp: "5,900" },
    { rating: "11", proficiency: "+4", xp: "7,200" },
    { rating: "12", proficiency: "+4", xp: "8,400" },
    { rating: "13", proficiency: "+5", xp: "10,000" },
    { rating: "14", proficiency: "+5", xp: "11,500" },
    { rating: "15", proficiency: "+5", xp: "13,000" },
    { rating: "16", proficiency: "+5", xp: "15,000" },
    { rating: "17", proficiency: "+6", xp: "18,000" },
    { rating: "18", proficiency: "+6", xp: "20,000" },
    { rating: "19", proficiency: "+6", xp: "22,000" },
    { rating: "20", proficiency: "+6", xp: "25,000" },
    { rating: "21", proficiency: "+7", xp: "33,000" },
    { rating: "22", proficiency: "+7", xp: "41,000" },
    { rating: "23", proficiency: "+7", xp: "50,000" },
    { rating: "24", proficiency: "+7", xp: "62,000" },
    { rating: "25", proficiency: "+8", xp: "75,000" },
    { rating: "26", proficiency: "+8", xp: "90,000" },
    { rating: "27", proficiency: "+8", xp: "105,000" },
    { rating: "28", proficiency: "+8", xp: "120,000" },
    { rating: "29", proficiency: "+9", xp: "135,000" },
    { rating: "30", proficiency: "+9", xp: "155,000" }
  ];

  return (
    <Card
      className="
        lg:w-1/3
        w-full
        hover:shadow-lg transition-all duration-300
        border-2 border-primary/40
        bg-gradient-to-br from-card to-card/80
        justify-start h-fit
      "
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-primary" />
          Challenge Rating & XP
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ScrollArea className="h-[320px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Rating</TableHead>
                <TableHead>Proficiency Bonus</TableHead>
                <TableHead>XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.rating}</TableCell>
                  <TableCell>{r.proficiency}</TableCell>
                  <TableCell>{r.xp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DamageTypeCard({ type, description, icon: IconComponent, details, examples }: {
  type: string;
  description: string;
  icon: IconType;
  details?: string[];
  examples?: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="
            w-full
            cursor-pointer hover:shadow-lg
            transition-all duration-300
            group
            border-2 border-border
            hover:border-primary/50
            bg-gradient-to-br from-card to-card/80
          "
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3">
              <IconComponent className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl tracking-wide">{type}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TypographyParagraph className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </TypographyParagraph>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IconComponent className="w-10 h-10 text-primary" />
            <span className="text-2xl font-headings">{type} Damage</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {details && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Additional Details
              </h4>
              <ul className="space-y-2">
                {details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-base">
                    <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {examples && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Common Sources
              </h4>
              <ul className="space-y-2">
                {examples.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-base">
                    <span className="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Reference: &apos;14 PHB, Chapter 9 (Combat)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DamageTypes() {
  const damageTypes = [
    {
      type: "Acid",
      icon: GiAcid,
      description: "The corrosive spray of a black dragon's breath and the dissolving enzymes secreted by a black pudding deal acid damage.",
      details: [
        "Corrodes and dissolves materials over time",
        "Often bypasses normal armor defenses",
        "Can damage equipment and weapons"
      ],
      examples: [
        "Black dragon breath weapon",
        "Black pudding attacks",
        "Acid splash cantrip",
        "Vitriolic sphere spell"
      ]
    },
    {
      type: "Bludgeoning",
      icon: GiWarhammer,
      description: "Blunt force attacks—hammers, falling, constriction, and the like—deal bludgeoning damage.",
      details: [
        "Physical damage from blunt impacts",
        "Effective against skeletal creatures",
        "Can cause knockback effects"
      ],
      examples: [
        "Club, mace, warhammer attacks",
        "Falling damage",
        "Crushing walls or boulders",
        "Constrictor snake grapples"
      ]
    },
    {
      type: "Cold",
      icon: GiIciclesAura,
      description: "The infernal chill radiating from an ice devil's spear and the frigid blast of a white dragon's breath deal cold damage.",
      details: [
        "Freezing temperatures that harm living tissue",
        "Can slow movement or cause paralysis",
        "Often resisted by creatures from cold environments"
      ],
      examples: [
        "White dragon breath weapon",
        "Ice devil weapons",
        "Cone of cold spell",
        "Frost giant attacks"
      ]
    },
    {
      type: "Fire",
      icon: GiFlame,
      description: "Red dragons breathe fire, and many spells conjure flames to deal fire damage.",
      details: [
        "Burning heat that ignites flammable materials",
        "Can cause ongoing burn effects",
        "One of the most common damage types"
      ],
      examples: [
        "Red dragon breath weapon",
        "Fireball spell",
        "Fire elemental attacks",
        "Burning oil or torches"
      ]
    },
    {
      type: "Force",
      icon: GiMagicSwirl,
      description: "Force is pure magical energy focused into a damaging form. Most effects that deal force damage are spells, including magic missile and spiritual weapon.",
      details: [
        "Pure magical energy with no physical form",
        "Rarely resisted by creatures",
        "Bypasses most forms of damage reduction"
      ],
      examples: [
        "Magic missile spell",
        "Spiritual weapon spell",
        "Eldritch blast cantrip",
        "Disintegrate spell"
      ]
    },
    {
      type: "Lightning",
      icon: GiFocusedLightning,
      description: "A lightning bolt spell and a blue dragon's breath deal lightning damage.",
      details: [
        "Electrical energy that can chain between targets",
        "Effective in water or against metal armor",
        "Can cause temporary paralysis"
      ],
      examples: [
        "Blue dragon breath weapon",
        "Lightning bolt spell",
        "Storm giant attacks",
        "Call lightning spell"
      ]
    },
    {
      type: "Necrotic",
      icon: GiDeathSkull,
      description: "Necrotic damage, dealt by certain undead and a spell such as chill touch, withers matter and even the soul.",
      details: [
        "Withering energy that decays living tissue",
        "Often reduces maximum hit points",
        "Cannot heal undead creatures"
      ],
      examples: [
        "Vampire bite attacks",
        "Chill touch cantrip",
        "Wight life drain",
        "Blight spell"
      ]
    },
    {
      type: "Piercing",
      icon: GiSwordsPower,
      description: "Puncturing and impaling attacks, including spears and monsters' bites, deal piercing damage.",
      details: [
        "Sharp points that penetrate armor and flesh",
        "Can cause bleeding effects",
        "Effective against lightly armored targets"
      ],
      examples: [
        "Arrows, crossbow bolts",
        "Spear, rapier, dagger attacks",
        "Monster bite attacks",
        "Spike growth spell"
      ]
    },
    {
      type: "Poison",
      icon: GiPoisonBottle,
      description: "Venomous stings and the toxic gas of a green dragon's breath deal poison damage.",
      details: [
        "Toxic substances that harm biological functions",
        "Can cause ongoing poison effects",
        "Many creatures are immune or resistant"
      ],
      examples: [
        "Green dragon breath weapon",
        "Snake venomous bites",
        "Poison spray cantrip",
        "Cloudkill spell"
      ]
    },
    {
      type: "Psychic",
      icon: GiBrain,
      description: "Mental abilities such as a mind flayer's psionic blast deal psychic damage.",
      details: [
        "Mental attacks that assault the mind directly",
        "Bypasses physical defenses entirely",
        "Can cause confusion or charm effects"
      ],
      examples: [
        "Mind flayer psionic blast",
        "Psychic lance spell",
        "Intellect devourer attacks",
        "Synaptic static spell"
      ]
    },
    {
      type: "Radiant",
      icon: GiSunbeams,
      description: "Radiant damage, dealt by a cleric's flame strike spell or an angel's smiting weapon, sears the flesh like fire and overloads the spirit with power.",
      details: [
        "Divine light that burns evil creatures",
        "Especially effective against undead and fiends",
        "Often associated with healing magic"
      ],
      examples: [
        "Paladin divine smite",
        "Sacred flame cantrip",
        "Angel weapon attacks",
        "Guiding bolt spell"
      ]
    },
    {
      type: "Slashing",
      icon: GiSlashedShield,
      description: "Swords, axes, and monsters' claws deal slashing damage.",
      details: [
        "Sharp edges that cut and slice",
        "Can cause bleeding wounds",
        "Effective against unarmored targets"
      ],
      examples: [
        "Sword, axe, scimitar attacks",
        "Monster claw attacks",
        "Whirlwind barbarian ability",
        "Steel wind strike spell"
      ]
    },
    {
      type: "Thunder",
      icon: GiThunderBlade,
      description: "A concussive burst of sound, such as the effect of the thunderwave spell, deals thunder damage.",
      details: [
        "Sonic vibrations that can shatter objects",
        "Often causes knockback effects",
        "Can deafen targets temporarily"
      ],
      examples: [
        "Thunderwave spell",
        "Shatter spell",
        "Storm giant thunderous strikes",
        "Thunderous smite spell"
      ]
    }
  ];

  return (
    <div className="lg:w-2/3 w-full">
      <CardTitle className="text-5xl">Damage Types</CardTitle>
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {damageTypes.map((dt, i) => (
          <DamageTypeCard
            key={i}
            type={dt.type}
            description={dt.description}
            icon={dt.icon}
            details={dt.details}
            examples={dt.examples}
          />
        ))}
      </div>
    </div>
  );
}

const EnvironmentCombatSection: React.FC<EnvironmentCombatSectionProps> = ({
  id,
}) => {
  return (
    <section
      id={id}
      className="py-12 md:py-18 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
            Environmental & Combat Rules
          </TypographyH2>

          <div className="grid gap-6 md:gap-8 mb-16">
            {/* First Row - Light Sources (spans full width on large screens) */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              <LightSources />
              <div className="grid gap-6 md:gap-8">
                <Jumping />
                <Suffocating />
              </div>
            </div>

            {/* Second Row - Size Categories and Concentration */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              <SizeCategories />
              <Concentration />
            </div>

            <div className="flex lg:flex-row flex-col gap-6 md:gap-8">
              <RatingXP />
              <DamageTypes />
            </div>
          </div>

          {/* Environmental Rules Tips */}
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-cyan-50/50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/20 rounded-2xl py-6 md:py-8 px-8 md:px-12 border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg">
            <h3 className="text-3xl md:text-4xl font-bold font-headings mb-6 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
              <TreeDeciduous className="md:w-8 md:h-8 w-7 h-7" />
              Environmental Tactics & Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200/30 dark:border-emerald-700/30">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-quotes text-lg">
                  <Sun className="w-5 h-5" />
                  Light & Vision
                </p>
                <p className="text-foreground">
                  Remember different races have varying darkvision ranges. Use lighting strategically to create tactical advantages and atmospheric tension.
                </p>
              </div>
              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200/30 dark:border-emerald-700/30">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-quotes text-lg">
                  <Move className="w-5 h-5" />
                  Position & Movement
                </p>
                <p className="text-foreground">
                  Encourage tactical positioning with terrain features, environmental cover, and movement-based challenges.
                </p>
              </div>
              <div className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200/30 dark:border-emerald-700/30">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-quotes text-lg">
                  <Droplets className="w-5 h-5" />
                  Environmental Hazards
                </p>
                <p className="text-foreground">
                  Fire, water, cliffs, weather, and terrain can transform simple encounters into memorable, dynamic challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentCombatSection;
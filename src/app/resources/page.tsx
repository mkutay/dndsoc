import { BookOpen, Download, ExternalLink, Users, Crown, Sparkles, FileText, Globe, ArrowRight, Info, Heart, MessageSquare, Github, Library } from "lucide-react";
import { GiCurlyMask, GiDiceSixFacesThree, GiRollingDiceCup } from "react-icons/gi";
import { DiscordLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH1, TypographyH2 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { D20Dice } from "@/components/d20-3d";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Resources",
  description: "Essential DnD resources for players and DMs at King's College London DnD Society. Find character sheets, rulebooks, tools, and guides to enhance your adventures.",
  openGraph: {
    title: "DnD Resources",
    description: "Everything you need to start your DnD journey. Character sheets, rulebooks, digital tools, and helpful guides for new and experienced players.",
  },
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl p-8 md:p-12 border border-primary/30 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-center md:gap-8 gap-4">
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-4 p-2 rounded-full bg-primary/20 border border-primary/30">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary font-quotes">Adventure Toolkit</span>
                  </div>
                  <TypographyH1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Resource<br />Library
                  </TypographyH1>
                  {/* <TypographyParagraph className="text-lg md:text-xl text-muted-foreground mb-6">
                    Your destination for D&D essentials.
                  </TypographyParagraph> */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 px-3 py-2 bg-background/80 rounded-full border-border">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">Character Sheets</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-background/80 rounded-full border-border">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-sm">Digital Tools</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-background/80 rounded-full border-border">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm">Rule References</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl"></div>
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
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="md:flex flex-row flex-none gap-2 w-fit mx-auto items-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 mb-12">
                <Info className="w-8 h-8 text-blue-600 dark:text-blue-400 float-start md:float-none" />
                <p className="text-xl font-quotes text-blue-800 dark:text-blue-200">
                  Information on this page will be updated regularly!
                </p>
              </div>
              <h2 className="tracking-wide text-3xl md:text-4xl font-bold mb-4 font-headings flex flex-row gap-2 justify-center items-center border-border border-b-4 w-fit mx-auto px-10 pb-3">
                First Time? Start Here
              </h2>
              <TypographyParagraph className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Don&apos;t worry about memorising everything — we&apos;ll teach you as we play!
              </TypographyParagraph>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="relative lg:min-h-96">
                <div className="absolute -top-[10px] -left-[10px] w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl z-10 font-quotes">
                  a
                </div>
                <Card className="lg:min-h-64 dark:hover:border-primary/60 dark:border-border dark:border-2 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-7 h-7 text-primary" />
                      Create Your Character
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TypographyParagraph>
                      We recommend starting with D&D Beyond, a free online character builder that makes it easy to create and manage your character.
                    </TypographyParagraph>
                  </CardContent>
                  <CardFooter>
                    <Button asChild size="sm" className="w-full">
                      <Link href="https://www.dndbeyond.com" target="_blank">
                        Go to D&D Beyond <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="relative">
                <div className="absolute -top-[10px] -left-[10px] w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl z-10 font-quotes">
                  b
                </div>
                <Card className="lg:min-h-64 dark:hover:border-primary/60 dark:border-border dark:border-2 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-7 h-7 text-primary" />
                      Get Your Sheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TypographyParagraph>
                      You can also download a fillable PDF character sheet to keep track of your character!
                      Especially useful if you prefer pen and paper or want to print it out.
                    </TypographyParagraph>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="secondary" size="sm" className="w-full">
                      <Link href="/resources/5E_CharacterSheet_Fillable.pdf" target="_blank">
                        Download Sheet <Download className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-6xl mx-auto">
              <h2 className="tracking-wide text-3xl md:text-5xl font-bold mb-4 font-headings md:flex inline-block flex-none flex-row gap-2 justify-center items-center border-border border-b-4 w-fit mx-auto px-10 pb-3">
                <Library className="md:w-10 md:h-10 w-8 h-8 float-left" />
                The Complete Library
              </h2>
              <TypographyParagraph className="text-xl text-muted-foreground">
                Everything a D&D player or DM could need
              </TypographyParagraph>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 border-border hover:border-primary/80">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                <div className="absolute top-4 right-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-semibold">CORE RULEBOOK</span>
                  </div>
                  <CardTitle>Player&apos;s Handbook (2014)</CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="mb-4">
                    The essential guide for players. Contains all the basic rules, classes, races, spells, and equipment you need to play D&D 5th Edition.
                  </TypographyParagraph>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Classes & Races</Badge>
                    <Badge variant="secondary">Spells</Badge>
                    <Badge variant="secondary">Equipment</Badge>
                    <Badge variant="secondary">Rules</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href="/resources/DnD-5e-Players-Handbook.pdf" target="_blank">
                      <FileText className="w-4 h-4 mr-2" />
                      Open Player&apos;s Handbook
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 border-border hover:border-primary/80">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
                <div className="absolute top-4 right-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-semibold">DIGITAL TOOL</span>
                  </div>
                  <CardTitle>5e.tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="mb-4">
                    The ultimate online reference with searchable rules, spells, monsters, and items. Perfect for quick lookups during games!
                  </TypographyParagraph>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Searchable</Badge>
                    <Badge variant="secondary">Monsters</Badge>
                    <Badge variant="secondary">Spells</Badge>
                    <Badge variant="secondary">Items</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link href="https://5e.tools" target="_blank">
                      <Globe className="w-4 h-4 mr-2" />
                      Visit 5e.tools
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
              <Card className="text-center hover:shadow-lg transition-all hover:scale-[102%] duration-300 bg-gradient-to-br from-background to-muted/50 dark:border-border dark:border-2 border-transparent">
                <CardHeader>
                  <CardTitle>
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-headings text-xl mb-2">Character Sheet</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    Official fillable PDF
                  </TypographyParagraph>
                </CardContent>
                <CardFooter className="mx-auto">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/resources/5E_CharacterSheet_Fillable.pdf" target="_blank">
                      Download
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all hover:scale-[102%] duration-300 bg-gradient-to-br from-background to-muted/50 dark:border-border dark:border-2 border-transparent">
                <CardHeader>
                  <CardTitle>
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-headings text-xl mb-2">Battle Grid</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    For tactical combat
                  </TypographyParagraph>
                </CardContent>
                <CardFooter className="mx-auto">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/resources/Battle-Grid.pdf" target="_blank">
                      Download
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all hover:scale-[102%] duration-300 bg-gradient-to-br from-accent to-accent/80 dark:border-border dark:border-2 border-transparent text-accent-foreground">
                <CardHeader>
                  <CardTitle>
                    <Crown className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="font-headings text-xl mt-2">Kutay&apos;s DM Screen</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    Please it took so long
                  </TypographyParagraph>
                </CardContent>
                <CardFooter className="mx-auto">
                  <Button asChild size="sm" variant="default">
                    <Link href="/resources/dm-screen" target="_blank">
                      EXPLORE
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all hover:scale-[102%] duration-300 bg-gradient-to-br from-background to-muted/50 dark:border-border dark:border-2 border-transparent">
                <CardHeader>
                  <CardTitle>
                    <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-headings text-xl mb-2">D&D Beyond</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    Digital character tools
                  </TypographyParagraph>
                </CardContent>
                <CardFooter className="mx-auto">
                  <Button asChild size="sm" variant="outline">
                    <Link href="https://www.dndbeyond.com" target="_blank">
                      Visit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all hover:scale-[102%] duration-300 bg-gradient-to-br from-background to-muted/50 dark:border-border dark:border-2 border-transparent">
                <CardHeader>
                  <CardTitle>
                    <Crown className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="font-headings text-xl mt-2">Quick Reference</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    Essential rules and actions
                  </TypographyParagraph>
                </CardContent>
                <CardFooter className="mx-auto">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/resources/quick-reference">
                      Explore
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Character Examples Accordion */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-primary/30 rounded-full animate-pulse delay-200"></div>
              </div>
              <h2 className="tracking-wide text-3xl md:text-4xl font-bold mb-4 font-headings md:flex flex-none flex-row gap-2 justify-center items-center border-border border-b-4 w-fit mx-auto px-10 pb-3">
                <GiCurlyMask className="md:h-12 md:w-12 h-8 w-8 float-left" />
                Character Inspiration Gallery
              </h2>
              <TypographyParagraph className="font-quotes text-muted-foreground md:text-xl text-lg">
                Explore official pre-made level 3 characters to spark your creativity!
              </TypographyParagraph>
            </div>
            
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="fighters-paladins" className="border border-muted/50 rounded-xl px-6 py-2 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-titles-of-tables text-2xl">Warriors & Holy Champions</div>
                        <div className="text-base text-muted-foreground font-quotes">Fighters & Paladins</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Human Fighter 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Human Fighter</div>
                            <div className="text-base text-muted-foreground">Classic warrior</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/High Elf Fighter 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">High Elf Fighter</div>
                            <div className="text-base text-muted-foreground">Elegant warrior</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Human Paladin 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Human Paladin</div>
                            <div className="text-base text-muted-foreground">Divine warrior</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Half-orc Paladin 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Half-orc Paladin</div>
                            <div className="text-base text-muted-foreground">Redemption seeker</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="spellcasters" className="border border-muted/50 rounded-xl px-6 py-2 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-titles-of-tables text-2xl">Spellcasters & Mystics</div>
                        <div className="text-base text-muted-foreground font-quotes">Magic users</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/High Elf Wizard 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">High Elf Wizard</div>
                            <div className="text-base text-muted-foreground">Arcane scholar</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Dragonborn Sorcerer 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Dragonborn Sorcerer</div>
                            <div className="text-base text-muted-foreground">Innate magic</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Tiefling Warlock 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Tiefling Warlock</div>
                            <div className="text-base text-muted-foreground">Pact magic</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Half-elf Bard 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Half-elf Bard</div>
                            <div className="text-base text-muted-foreground">Jack of all trades</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="divine-nature" className="border border-muted/50 rounded-xl px-6 py-2 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-titles-of-tables text-2xl">Divine & Nature</div>
                        <div className="text-base text-muted-foreground font-quotes">Clerics, Druids & Rangers</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Human Cleric 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Human Cleric</div>
                            <div className="text-base text-muted-foreground">Divine healer</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Dwarf Cleric 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Dwarf Cleric</div>
                            <div className="text-base text-muted-foreground">Stalwart priest</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Human Druid 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Human Druid</div>
                            <div className="text-base text-muted-foreground">Nature guardian</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Wood Elf Ranger 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Wood Elf Ranger</div>
                            <div className="text-base text-muted-foreground">Forest tracker</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="rogues-scouts" className="border border-muted/50 rounded-xl px-6 py-2 bg-gradient-to-r from-slate-50/50 to-zinc-50/50 dark:from-slate-950/20 dark:to-zinc-950/20">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/30 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-titles-of-tables text-2xl">Rogues & Martial Artists</div>
                        <div className="text-sm text-muted-foreground font-quotes">Stealth & skill</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 gap-3 pt-4">
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Drow Rogue 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Drow Rogue</div>
                            <div className="text-base text-muted-foreground">Shadow assassin</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Halfling Rogue 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Halfling Rogue</div>
                            <div className="text-base text-muted-foreground">Lucky burglar</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Halfling Monk 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Halfling Monk</div>
                            <div className="text-base text-muted-foreground">Small but mighty</div>
                          </div>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start h-auto p-3">
                        <Link href="/resources/example-character-sheets/Human Barbarian 3.pdf" target="_blank">
                          <FileText className="w-8 h-8 mr-3" />
                          <div className="text-left">
                            <div className="text-lg font-tables">Human Barbarian</div>
                            <div className="text-base text-muted-foreground">Primal fury</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Motivational Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-red-50/50 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-red-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 backdrop-blur-sm">
              <div className="flex flex-col gap-6 justify-center items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary mt-1.5" />
                  </div>
                </div>
                <div>
                  <TypographyH2 className="text-center">
                    Remember: It&apos;s All About the Fun
                  </TypographyH2>
                  <div className="flex flex-col gap-4 mt-4 w-fit mx-auto">
                    <div className="text-base flex flex-row gap-2 items-center">
                      <Badge>New players:</Badge> Don&apos;t stress about knowing every rule!
                    </div>
                    <div className="text-base flex flex-row gap-2 items-center">
                      <Badge>Veterans:</Badge> Help newcomers feel welcome.
                    </div>
                    <div className="text-base flex flex-row gap-2 items-center">
                      <Badge>DMs:</Badge> Focus on memorable moments.
                    </div>
                    <div className="text-base flex flex-row gap-2 items-center">
                      <Badge>Everyone:</Badge> Collaborative storytelling is key!
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <TypographyParagraph className="text-lg font-medium text-primary font-quotes italic">
                      The real treasure was the friends we made along the way... and maybe some cool dice.
                    </TypographyParagraph>
                    <div className="flex justify-center gap-4 mt-8">
                      <Button asChild variant="outline">
                        <Link href="/about">
                          About Our Society <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/dms">
                          Meet Our DMs <Crown className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative CTA */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rotate-12">
            <D20Dice size="sm" />
          </div>
          <div className="absolute bottom-10 right-10 w-16 h-16 -rotate-12">
            <D20Dice size="sm" />
          </div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 rotate-45">
            <D20Dice size="sm" />
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-block p-4 rounded-full bg-primary-foreground/20 mb-6">
                <Sparkles className="w-8 h-8 text-primary-foreground mt-[1px]" />
              </div>
              <TypographyH2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
                Ready to Begin Your Epic Journey?
              </TypographyH2>
              <TypographyParagraph className="text-lg md:text-xl mb-8 opacity-90 text-primary-foreground max-w-2xl mx-auto">
                With these resources in your inventory, you&apos;re prepared for any adventure. 
                Join our society and let&apos;s create legendary stories together!
              </TypographyParagraph>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-8 py-6 group">
                <Link href="/sign-up" className="flex items-center gap-2">
                  <Users className="w-5 h-5 group-hover:animate-pulse" />
                  Join Our Society
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/parties" className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Find a Party
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-primary-foreground/80 text-sm">
              Questions? Check out our <Link href="/about" className="underline hover:text-primary-foreground">About page</Link> or browse our <Link href="/journal" className="underline hover:text-primary-foreground">Journal</Link> for our sessions.
            </div>
          </div>
        </div>
      </section>

      {/* Community & Social Links */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="flex flex-row gap-6 text-3xl md:text-4xl font-bold mb-4 font-headings justify-center">
                <GiRollingDiceCup className="w-10 h-10" />
                Join Our Community
              </h2>
              <TypographyParagraph className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with fellow adventurers across all our platforms!
              </TypographyParagraph>
            </div>
            
            <div className="flex flex-row flex-wrap justify-center gap-6 mb-8">
              {/* KCLSU Official Society Page */}
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-[102%] bg-gradient-to-br from-background to-blue-50/50 dark:to-blue-950/30 border-2 border-blue-200/50 dark:border-blue-800/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200 font-headings text-2xl">Official Society</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <TypographyParagraph className="text-sm mb-4 text-blue-700 dark:text-blue-300">
                    Join us officially through KCLSU
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="https://www.kclsu.org/groups/activities/join/26717/" target="_blank">
                      Join Now <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* GitHub Repository */}
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-[102%] bg-gradient-to-br from-background to-slate-50/50 dark:to-slate-950/30 border-2 border-slate-200/50 dark:border-slate-800/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Github className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200 font-headings text-2xl">Open Source</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <TypographyParagraph className="text-sm mb-4 text-slate-700 dark:text-slate-300">
                    Contribute to our website
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                    <Link href="https://github.com/mkutay/dndsoc" target="_blank">
                      View Code <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* WhatsApp */}
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-[102%] bg-gradient-to-br from-background to-green-50/50 dark:to-green-950/30 border-2 border-green-200/50 dark:border-green-800/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200 font-headings text-2xl">WhatsApp</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <TypographyParagraph className="text-sm mb-4 text-green-700 dark:text-green-300">
                    Quick updates & casual chats
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-green-300 dark:border-green-700" disabled>
                    Link Coming Soon
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Discord */}
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-[102%] bg-gradient-to-br from-background to-indigo-50/50 dark:to-indigo-950/30 border-2 border-indigo-200/50 dark:border-indigo-800/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DiscordLogoIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-indigo-800 dark:text-indigo-200 font-headings text-2xl">Discord</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <TypographyParagraph className="text-sm mb-4 text-indigo-700 dark:text-indigo-300">
                    Voice chats & event coordination
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-indigo-300 dark:border-indigo-700" disabled>
                    Link Coming Soon
                  </Button>
                </CardFooter>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-[102%] bg-gradient-to-br from-background to-pink-50/50 dark:to-pink-950/30 border-2 border-pink-200/50 dark:border-pink-800/50 max-w-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <InstagramLogoIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-pink-800 dark:text-pink-200 font-headings text-2xl">Instagram</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <TypographyParagraph className="text-sm mb-4 text-pink-700 dark:text-pink-300">
                    Session photos & character art
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full border-pink-300 dark:border-pink-700" disabled>
                    Link Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* D&D Terms & Jargon Glossary */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-primary-30 rounded-full animate-pulse delay-200"></div>
              </div>
              <h2 className="flex flex-row gap-4 text-3xl md:text-4xl font-bold mb-4 font-headings justify-center">
                <GiDiceSixFacesThree  />
                D&D Terms & Jargon
              </h2>
              <TypographyParagraph className="text-lg text-muted-foreground mb-8 font-quotes">
                Don&apos;t know your AC from your HP? No worries! Here&apos;s your survival guide to <i>D&D speak</i>.
              </TypographyParagraph>
            </div>
            
            {(() => {
              const glossaryTerms = {
                "Game Mechanics": [
                  {
                    term: "AC (Armor Class)",
                    definition: "How hard you are to hit in combat"
                  },
                  {
                    term: "HP (Hit Points)",
                    definition: "Your character's health/life force"
                  },
                  {
                    term: "d20, d6, d4",
                    definition: "Dice types (20-sided, 6-sided, 4-sided)"
                  },
                  {
                    term: "Saving Throw",
                    definition: "Roll to avoid bad effects (like dodging a trap)"
                  },
                  {
                    term: "Initiative",
                    definition: "Turn order in combat"
                  }
                ],
                "Common Phrases": [
                  {
                    term: "\"Natural 20\" / \"Nat 20\"",
                    definition: "Rolling a 20 on a d20 - the best possible roll!"
                  },
                  {
                    term: "\"Critical Fail\" / \"Nat 1\"",
                    definition: "Rolling a 1 on a d20 - things go very wrong"
                  },
                  {
                    term: "\"Roll for Initiative\"",
                    definition: "Combat is starting! Determine turn order"
                  },
                  {
                    term: "\"TPK\"",
                    definition: "Total Party Kill - when everyone dies (it happens!)"
                  },
                  {
                    term: "\"Session Zero\"",
                    definition: "Pre-game meeting to discuss rules & expectations"
                  }
                ],
                "Character Terms": [
                  {
                    term: "PC (Player Character)",
                    definition: "Your character that you control"
                  },
                  {
                    term: "NPC (Non-Player Character)",
                    definition: "Characters controlled by the DM"
                  },
                  {
                    term: "Backstory",
                    definition: "Your character's history before the adventure"
                  },
                  {
                    term: "Multiclass",
                    definition: "Having levels in multiple character classes"
                  }
                ],
                "Fun Slang": [
                  {
                    term: "\"Murder Hobo\"",
                    definition: "Player who solves everything with violence"
                  },
                  {
                    term: "\"Min-Maxing\"",
                    definition: "Optimizing character stats for maximum efficiency"
                  },
                  {
                    term: "\"Railroading\"",
                    definition: "When the DM forces players down one path"
                  },
                  {
                    term: "\"Metagaming\"",
                    definition: "Using out-of-character knowledge in-game"
                  }
                ]
              };

              const sectionIcons = {
                "Game Mechanics": FileText,
                "Common Phrases": MessageSquare,
                "Character Terms": Users,
                "Fun Slang": Sparkles
              };

              return (
                <div className="bg-gradient-to-br from-background via-primary/5 to-background rounded-3xl p-6 md:p-8 border-2 border-border">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(glossaryTerms).map(([sectionTitle, terms]) => {
                      const IconComponent: React.ElementType = Object.prototype.hasOwnProperty.call(sectionIcons, sectionTitle) 
                        ? sectionIcons[sectionTitle as keyof typeof sectionIcons] 
                        : FileText;
                      return (
                        <div key={sectionTitle} className="space-y-4">
                          <h3 className="text-2xl text-primary mb-4 flex items-center gap-2 font-headings">
                            <IconComponent className="w-5 h-5" />
                            {sectionTitle}
                          </h3>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                            {terms.map((item, index) => (
                              <div key={index} className="bg-transparent rounded-lg p-3 border-2 border-border">
                                <div className="text-lg text-foreground">{item.term}</div>
                                <div className="text-sm font-quotes text-muted-foreground">{item.definition}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
              
            <div className="mt-8 text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border-2 border-border max-w-prose mx-auto">
              <div className="text-foreground font-medium leading-7">
                <Badge>Pro Tip:</Badge> Don&apos;t worry about memorizing all these terms! 
                We are a welcoming community, and you can always ask for clarification during games.
                Everyone started as a beginner. 
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import {  Crown, Users, BookOpen, ArrowRight, Sparkles, MapPin, Calendar, Github } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { D20Dice } from "@/components/d20-3d";
import { TypographyH1, TypographyH3 } from "@/components/typography/headings";
import { TypographyParagraph, TypographyLead } from "@/components/typography/paragraph";
import { AnimatedDice } from "@/components/animated-dice";
import { FeaturesSection } from "@/components/home-features-section";
import { TypographyHr } from "@/components/typography/blockquote";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-6xl mx-auto">
            <div className="flex justify-center mb-6 animate-float">
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <AnimatedDice />
                <span className="text-sm md:text-base font-medium text-primary px-1 font-quotes">King&apos;s College London DnD Society</span>
                <AnimatedDice />
              </div>
            </div>
            
            <TypographyH1 className="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up">
              <span className="font-drop-caps font-normal">R</span>oll for <span className="font-drop-caps font-normal">I</span>nitiative
            </TypographyH1>
            
            <TypographyLead className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground animate-fade-in-up">
              Your digital companion for epic adventures with us. Manage characters, track your journeys, and connect with fellow adventurers.
            </TypographyLead>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-4 md:mb-6 animate-fade-in-up w-fit mx-auto">
              <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 group">
                <Link href="/sign-up" className="flex items-center gap-2">
                  Join the Adventure
                  <Sparkles className="w-4 md:w-5 h-4 md:h-5 group-hover:animate-spin" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
                <Link href="/journal" className="flex items-center gap-2">
                  Browse Our Journal
                  <BookOpen className="w-4 md:w-5 h-4 md:h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground animate-fade-in-up mb-6 md:mb-9">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 md:w-4 h-3 md:h-4" />
                <span>King&apos;s College London</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 md:w-4 h-3 md:h-4" />
                <span>Active Community</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                <span>Weekly Sessions</span>
              </div>
            </div>

            <div className="animate-fade-in-up">
              <div className="md:flex hidden justify-center">
                <D20Dice size="xl" />
              </div>
              <div className="flex md:hidden justify-center">
                <D20Dice size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Community Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-9 md:mb-12 font-headings md:border-b-4 border-b-2 border-secondary pb-3 px-12 w-fit mx-auto">
              For New & Seasoned Adventurers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 max-w-4xl mx-auto">
              <Card className="text-left hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
                    <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                    New to D&D?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="mb-4">
                    Well... Welcome to our society, adventurer! We&apos;ll help you create your first character, 
                    learn the rules, and join your first adventure. Don&apos;t worry if you&apos;re joining later 
                    in the year, we are always looking for new players!
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href="/parties" className="flex items-center gap-2">
                      View Our Parties <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="text-left hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
                    <Crown className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                    Veteran Player?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="mb-4">
                    Bring your expertise to our community! Share your knowledge, mentor newcomers, 
                    or help us run campaigns and events! We value your experience and
                    would love to have you as part of our society. Or, you could just join a campaign and have fun!
                  </TypographyParagraph>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href="/dms" className="flex items-center gap-2">
                      See Our DMs <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <TypographyHr className="mb-16 md:mb-20" />
            
            <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 lg:p-12 border border-primary/20 max-w-4xl mx-auto">
              <TypographyH3 className="text-2xl md:text-3xl font-bold mb-4">
                Open Source & Community Driven
              </TypographyH3>
              <TypographyParagraph className="text-base md:text-lg mb-6 max-w-2xl mx-auto">
                Built with love by society members, for society members. This platform is completely open source 
                and continuously improved by our society&apos;s nerds (that also includes me, the president).
              </TypographyParagraph>
              <Button asChild variant="outline" size="lg">
                <Link 
                  href="https://github.com/mkutay/dndsoc" 
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 md:w-5 h-4 md:h-5" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primary-foreground items-start flex flex-row justify-center">
            <span className="font-drop-caps text-4xl md:text-6xl font-normal">R</span>eady
            to
            <span className="font-drop-caps text-4xl md:text-6xl font-normal">B</span>egin?
          </h2>
          <TypographyParagraph className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
            Join the King&apos;s College London DnD Society and embark on legendary adventures. 
            Well... what are you waiting for? Roll for initiative!
          </TypographyParagraph>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
              <Link href="/sign-up" className="flex items-center gap-2">
                Create an Account
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/campaigns">
                Browse Campaigns
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

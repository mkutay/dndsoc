import { Crown, Users, BookOpen, ArrowRight, Sparkles, MapPin, Calendar, MessageSquare, Instagram, ExternalLink, Globe, DicesIcon, Star } from "lucide-react";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Link from "next/link";

import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { TypographyParagraph, TypographyLead } from "@/components/typography/paragraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyHr } from "@/components/typography/blockquote";
import { AnimatedDice } from "@/components/animated-dice";
import { Button } from "@/components/ui/button";
import { D20Dice } from "@/components/d20-3d";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about the King's College London Dungeons and Dragons Society, our mission, vision, and the people behind the magic.",
  openGraph: {
    title: "About Us",
    description: "Discover the mission, vision, and leadership of the King's College London Dungeons and Dragons Society.",
  },
}

export default function AboutPage() {
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
                <span className="text-sm md:text-base font-medium text-primary px-1 font-quotes">About Our Society</span>
                <AnimatedDice />
              </div>
            </div>
            
            <TypographyH1 className="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up">
              <span className="font-drop-caps font-normal">A</span>bout <span className="font-drop-caps font-normal">U</span>s
            </TypographyH1>
            
            <TypographyLead className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground animate-fade-in-up">
              Learn more about the King&apos;s College London DnD Society, our mission, and the people behind the magic.
            </TypographyLead>

            <div className="md:flex hidden justify-center">
              <D20Dice size="xl" />
            </div>
            <div className="flex md:hidden justify-center">
              <D20Dice size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Our Mission & Vision
            </TypographyH2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
              <Card className="hover:shadow-lg transition-all dark:hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                    <Crown className="w-6 md:w-7 h-6 md:h-7 text-primary" />
                    Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    To create an inclusive, welcoming, and creative community at King&apos;s College London where students of all
                    experience levels can discover the joy of the game Dungeons and Dragons, and find a place of 
                    comfort and belonging.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg dark:hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                    <Sparkles className="w-6 md:w-7 h-6 md:h-7 text-primary" />
                    Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    To be the heart of Dungeons and Dragons gaming at KCL,
                    where every member feels belonged to tell their story, whether as a player or as a dungeon master.
                  </TypographyParagraph>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Society Leadership Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-bg-background via-bg-muted/40 to-bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Committee & Leadership
            </TypographyH2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 md:mb-8 mb-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    President (Kutay)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Leading the society with passion and vision, our president oversees all operations and ensures our community thrives.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DicesIcon className="w-5 h-5 text-primary" />
                    Treasurer (Kai)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    The treasurer manages our society&apos;s finances, ensuring we can continue providing amazing experiences and resources for all members.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Events Officer (Maryam)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Organising exciting events and special sessions to keep our community engaged throughout the year. With other societies too!
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-primary" />
                    Social Media Officer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Keeping our community connected through social media, sharing highlights from our adventures.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Newsletter Officer (Mark)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Creating newsletters to keep our community informed about upcoming events, campaign updates, and society news. Through our website!
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Charity Officer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Organising charitable initiatives and fundraising events to give back to the community while having fun with our fellow society members.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Wellbeing Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Ensuring our society remains a safe, supportive space for all members, fostering an inclusive environment.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Dungeon Masters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-base">
                    Our dedicated DMs bring worlds to life, guiding players through epic adventures and ensuring everyone has an unforgettable experience at the table,
                    whether in-person or online. They are the architects of our campaigns and the keepers of our lore.
                  </TypographyParagraph>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex sm:flex-row flex-col gap-6 md:gap-8">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 md:p-6 w-full">
                <TypographyH3 className="text-3xl tracking-wider font-bold mb-3 text-blue-800 dark:text-blue-200">
                  <Star className="inline-block w-6 h-6 mr-2 mb-1" />
                  We Need Your Help
                </TypographyH3>
                <TypographyParagraph className="text-blue-800 dark:text-blue-200 mb-4">
                  As we strive to be one of the biggest and most vibrant societies at KCL, we need passionate members to help us grow! 
                  We&apos;re actively looking for volunteers to fill these exciting positions:
                </TypographyParagraph>
                <div className="grid md:grid-cols-2 gap-3 mb-4 text-lg">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Instagram className="w-4 h-4" />
                    <span className="font-medium">Social Media Officer</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Dungeon Masters</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Charity Officer</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Wellbeing Lead</span>
                  </div>
                </div>
                <TypographyParagraph className="text-blue-800 dark:text-blue-200 mb-0">
                  <span className="uppercase font-bold tracking-widest font-quotes text-xl mr-2">Especially our awesome DMs!</span>
                  We can never have too many talented storytellers ready to form epic parties.
                  Whether you&apos;re experienced or just starting out, we&apos;d love to have you on our forefront.
                </TypographyParagraph>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 md:p-6 sm:w-1/3 w-full">
                <TypographyParagraph className="text-xl text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Some leadership details may change as we prepare for the upcoming academic year.
                  We&apos;ll keep this page updated with any modifications to our team structure.
                </TypographyParagraph>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Play Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Where We Play
            </TypographyH2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    KCL Campuses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    Most of our sessions take place across King&apos;s College London campuses,
                    providing convenient access for all students.
                    The exact location will be communicated with you as the year approaches.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    Online Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    We also do occasional online sessions at individual parties&apos; discretions,
                    perfect for continuing adventures during holidays or when in-person sessions
                    are inconvenient.
                  </TypographyParagraph>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About This Website Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-bg-background via-bg-muted/40 to-bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              About This Platform
            </TypographyH2>
            
            <div className="flex sm:flex-row flex-col md:gap-12 gap-8 mb-12">
              <Card className="hover:shadow-lg transition-shadow sm:w-1/2 w-full">
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary text-lg" />
                    More Than Just a Tool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    This website serves as a digital companion to enhance your D&D experience. Obviously, it&apos;s <span className="font-bold font-quotes">not</span> a
                    replacement for the magic of sitting around a table with dice, character sheets, pen, and paper.
                    Instead, it&apos;s designed to help our community share stories, track adventures, connect with fellow players, and celebrate
                    the creativity that makes Dungeons and Dragons so special.
                  </TypographyParagraph>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow sm:w-1/2 w-full">
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary text-lg" />
                    Growing Together
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph>
                    As our society grows, so will this platform.
                    We&apos;re committed to making it a hub for our community, and we are always open to suggestions and improvements.
                    Having this website open source allows everyone to contribute. Even <span className="font-quotes text-2xl">you</span>, yes you, reading this right now!
                  </TypographyParagraph>
                  <TypographyParagraph>
                    For more information, check out our <Link href="https://github.com/mkutay/dndsoc" target="_blank" className="text-primary hover:text-primary/80 transition-all font-quotes">GitHub repo</Link>.
                  </TypographyParagraph>
                </CardContent>
              </Card>
            </div>
            
            {/* <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20 max-w-2xl mx-auto">
              <TypographyH3 className="text-2xl font-bold mb-4 text-center">
                Ready to Roll for Initiative in the Digital Realm?
              </TypographyH3>
              <TypographyParagraph className="text-center mb-6 text-base">
                Whether you're chronicling epic battles or simply browsing character galleries, this platform is your gateway to staying connected with our amazing community. Don't worry—we promise the only thing better than natural 20s on this site is rolling them at the actual table!
              </TypographyParagraph>
            </div> */}
          </div>
        </div>
      </section>

      {/* KCLSU & Connect Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
              Part of KCLSU
            </TypographyH2>
            
            <Card className="hover:shadow-lg transition-shadow mb-12 max-w-2xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <TypographyParagraph className="text-center text-lg mb-6">
                  We&apos;re proud to be an official society under the King&apos;s College London Students&apos; Union (KCLSU),
                  ensuring we meet the highest standards for student activities and providing you with a safe,
                  inclusive environment to explore the world of DnD.
                </TypographyParagraph>
                <div className="flex justify-center">
                  <Button asChild variant="outline" size="lg">
                    <Link href="https://kclsu.org" target="_blank" className="flex items-center gap-2">
                      Visit KCLSU
                      <ExternalLink className="w-4 h-4 mb-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <TypographyHr className="mb-12" />

            <TypographyH3 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Connect With Us
            </TypographyH3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-sm mb-4">
                    Join our WhatsApp group for quick updates and casual conversations.
                  </TypographyParagraph>
                  <Button variant="outline" size="sm" disabled>
                    Link Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <DiscordLogoIcon className="w-7 h-7" />
                    Discord
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-sm mb-4">
                    Our main hub for voice chats, event coordination, and community discussions.
                  </TypographyParagraph>
                  <Button variant="outline" size="sm" disabled>
                    Link Coming Soon
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Instagram className="w-6 h-6" />
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypographyParagraph className="text-sm mb-4">
                    Follow us for photos from sessions, character art, and society highlights.
                  </TypographyParagraph>
                  <Button variant="outline" size="sm" disabled>
                    Link Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <TypographyH2 className="font-headings text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-primary-foreground border-none">
            Ready to Join YOUR Adventure?
          </TypographyH2>
          <TypographyParagraph className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
            Whether you&apos;re a seasoned veteran or someone who&apos;s never touched a d20, there&apos;s a place for you in our society. Come be part of something magical!
          </TypographyParagraph>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
              <Link href="/sign-up" className="flex items-center gap-2">
                Join the Society
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/parties">
                Find a Party
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
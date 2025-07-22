"use client";

import { Sword, Crown, BookOpen, Trophy, Vote, LibraryBig, Calendar, HandCoins } from "lucide-react";

import { FeatureCard } from "@/components/feature-card";
import { TypographyParagraph } from "@/components/typography/paragraph";

export function FeaturesSection() {
  return (
    <section className="py-6 md:py-9 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-9 md:mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 font-headings md:border-b-4 border-b-2 border-secondary pb-3 px-12 w-fit mx-auto">
            Your Quest Awaits
          </h2>
          <TypographyParagraph className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the tools that we have enabled for you.
          </TypographyParagraph>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={BookOpen}
            title="Session Journal"
            description="Document your adventures, track important story beats, and preserve epic moments for posterity."
            href="/journal"
            delay={50}
          />
          <FeatureCard
            icon={Vote}
            title="Polling System"
            description="Engage with the society and roll on the future of the game with our integrated polling system."
            href="/polls"
            delay={100}
          />
          <FeatureCard
            icon={Trophy}
            title="Achievements"
            description="Earn and showcase achievements for your characters. We have them for DMs too! And maybe some secret ones..."
            href="/achievements"
            delay={150}
          />
          <FeatureCard
            icon={Sword}
            title="Character Management"
            description="Create, customize, and track your characters across multiple campaigns and parties."
            href="/characters"
            delay={200}
          />
          <FeatureCard
            icon={Crown}
            title="Party Organization"
            description="Form adventuring parties and group pictures to share your epic journeys with the community."
            href="/parties"
            delay={250}
          />
          <FeatureCard
            icon={BookOpen}
            title="Campaign Tracking"
            description="Follow epic storylines, track important events, and never miss a session with our campaign and journal pages."
            href="/campaigns"
            delay={300}
          />
          <FeatureCard
            icon={LibraryBig}
            title="Extensive Resource Library"
            description="Access a wealth of resources, including rulebooks, guides, and homebrew content to enhance your gaming experience."
            href="/resources"
            delay={350}
          />
          <FeatureCard
            icon={Calendar}
            title="When2DnD"
            description="Schedule your sessions with ease using our When2DnD integration, ensuring everyone is on the same page. (WIP)"
            href="/when2dnd"
            delay={400}
          />
          <FeatureCard
            icon={HandCoins}
            title="Trading System"
            description="Trade items, resources, and treasures with other players, from different parties. (Coming soon!)"
            href="#"
            delay={450}
          />
        </div>
      </div>
    </section>
  );
}

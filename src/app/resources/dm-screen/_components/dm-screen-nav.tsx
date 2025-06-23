"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Sparkles,
  Swords,
  Zap,
  TreeDeciduous,
  HeartCrack,
  Coins,
  ClipboardList,
  Dice5,
  Section,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const sections = [
  { id: "hero-section", title: "Overview", icon: Sparkles }, // Added a general overview section
  { id: "core-mechanics", title: "Core Mechanics", icon: Users },
  { id: "skills-abilities", title: "Skills & Abilities", icon: ClipboardList },
  { id: "combat-actions", title: "Actions in Combat", icon: Swords },
  { id: "conditions", title: "Conditions", icon: HeartCrack },
  { id: "equipment-economy", title: "Equipment & Economy", icon: Coins },
  { id: "environment-combat", title: "Environment & Combat", icon: TreeDeciduous },
  { id: "advanced-utility", title: "Advanced Utility", icon: Zap },
  { id: "advanced-encounters", title: "Advanced Encounters", icon: Dice5 },
] as const;

export type SectionIds = typeof sections[number]['id'];

const NavContent = () => {
  const [activeSection, setActiveSection] = useState("");
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            window.history.replaceState({}, "", `#${sectionId}`);
            setActiveSection(sectionId);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // Adjust as needed to trigger when section is roughly in the middle
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50"
        >
          <Section className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-4 flex flex-col gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              const element = document.getElementById(section.id);
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
              
              window.history.pushState(
                {},
                "",
                `#${section.id}`
              );
            }}
            className={`flex flex-row items-center gap-2 p-2 rounded-md transition-colors md:text-lg text-base
              ${
                activeSection === section.id
                  ? "bg-primary/20 text-primary font-medium border border-primary/40"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            {(() => {
              const Icon = section.icon;
              return <Icon className="w-5 h-5 md:w-7 md:h-7" />
            })()}
            <span>{section.title}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default NavContent;
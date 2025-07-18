import { type Metadata } from "next";

import HeroSection from "./_sections/hero-section";
import CoreMechanicsSection from "./_sections/core-mechanics-section";
import SkillsAbilitiesSection from "./_sections/skills-abilities-section";
import ActionsInCombatSection from "./_sections/actions-in-combat-section";
import ConditionsSection from "./_sections/conditions-section";
import EquipmentEconomySection from "./_sections/equipment-economy-section";
import EnvironmentCombatSection from "./_sections/environment-combat-section";
import AdvancedUtilitySection from "./_sections/advanced-utility-section";
import AdvancedEncountersSection from "./_sections/advanced-encounters-section";
import FooterCtaSection from "./_sections/footer-cta-section";

import DMScreenNav, { type SectionIds } from "./_components/dm-screen-nav";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Kutay's 5e DM Screen",
  description:
    "A comprehensive digital Dungeon Master screen for Dungeons & Dragons 5th Edition, providing quick reference rules, tables, and combat information.",
  openGraph: {
    title: "Kutay's 5e DM Screen",
    description: "Your essential digital D&D 5e DM Screen for fast rule lookups and game management.",
  },
};

export default function DMScreenPage() {
  return (
    <main>
      <DMScreenNav />

      <div className="pt-20 lg:pt-0">
        <HeroSection id={"hero-section" as SectionIds} />
        <CoreMechanicsSection id={"core-mechanics" as SectionIds} />
        <SkillsAbilitiesSection id={"skills-abilities" as SectionIds} />
        <ActionsInCombatSection id={"combat-actions" as SectionIds} />
        <ConditionsSection id={"conditions" as SectionIds} />
        <EquipmentEconomySection id={"equipment-economy" as SectionIds} />
        <EnvironmentCombatSection id={"environment-combat" as SectionIds} />
        <AdvancedUtilitySection id={"advanced-utility" as SectionIds} />
        <AdvancedEncountersSection id={"advanced-encounters" as SectionIds} />
        <FooterCtaSection id={"footer-cta" as SectionIds} />
      </div>
    </main>
  );
}

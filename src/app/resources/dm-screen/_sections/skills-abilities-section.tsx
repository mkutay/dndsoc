import {
  BookOpen,
  Sparkles,
  Swords,
  Shield,
  Move,
  Sun,
  ClipboardList,
} from "lucide-react";

import { TypographyH2 } from "@/components/typography/headings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsAbilitiesSectionProps {
  id: string;
}

const abilities = [
  {
    ability: "Strength",
    icon: Swords,
    skills: ["Athletics"],
    description: "Physical power, muscle, and endurance"
  },
  {
    ability: "Dexterity",
    icon: Move,
    skills: ["Acrobatics", "Sleight of Hand", "Stealth"],
    description: "Agility, reflexes, and balance"
  },
  {
    ability: "Constitution",
    icon: Shield,
    skills: [], // No skills directly tied to CON in 5e base, though saves are important
    description: "Health, stamina, and vital force"
  },
  {
    ability: "Intelligence",
    icon: BookOpen,
    skills: [
      "Arcana",
      "History",
      "Investigation",
      "Nature",
      "Religion",
    ],
    description: "Reasoning, memory, and analytical thinking"
  },
  {
    ability: "Wisdom",
    icon: Sun,
    skills: [
      "Animal Handling",
      "Insight",
      "Medicine",
      "Perception",
      "Survival",
    ],
    description: "Awareness, intuition, and common sense"
  },
  {
    ability: "Charisma",
    icon: Sparkles,
    skills: [
      "Deception",
      "Intimidation",
      "Performance",
      "Persuasion",
    ],
    description: "Force of personality, leadership, and confidence"
  },
];

const SkillsAbilitiesSection: React.FC<SkillsAbilitiesSectionProps> = ({
  id,
}) => {
  return (
    <section
      id={id}
      className="py-12 md:py-18 bg-linear-to-b from-background via-muted/40 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <TypographyH2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-headings border-b-2 md:border-b-4 border-secondary pb-3 px-12 w-fit mx-auto">
            Skills & Abilities
          </TypographyH2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {abilities.map((item) => (
              <Card
                key={item.ability}
                className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-primary`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    {(() => {
                      const Icon = item.icon;
                      return <Icon className="w-8 h-8" />;
                    })()}
                    {item.ability}
                  </CardTitle>
                  <p className="text-base font-quotes text-muted-foreground italic">
                    {item.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Associated Skills:
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {item.skills.length > 0 ? (
                        item.skills.map((skill) => <li key={skill}>{skill}</li>)
                      ) : (
                        <li className="text-muted-foreground italic">No associated skills</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills Quick Reference */}
          <Card className="md:mt-16 mt-12 md:px-6 md:py-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="md:w-8 md:h-8 w-7 h-7 mb-1.5" />
                Skill Check Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 font-quotes text-xl">Most Common Checks</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong className="tracking-wider">Perception:</strong> Noticing hidden objects/creatures</li>
                      <li><strong className="tracking-wider">Investigation:</strong> Searching for clues and information</li>
                      <li><strong className="tracking-wider">Insight:</strong> Reading people&apos;s intentions</li>
                      <li><strong className="tracking-wider">Persuasion:</strong> Convincing others</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-quotes text-xl mb-2">Quick Tips</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Proficiency bonus = +2 to +6 based on level</li>
                      <li>Passive score = 10 + ability modifier + proficiency</li>
                      <li>Advantage/disadvantage affects passive scores by ±5</li>
                      <li>Group checks: Half or more succeed = group succeeds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SkillsAbilitiesSection;
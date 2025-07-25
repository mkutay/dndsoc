"use client";

import { User, Gamepad2, Trophy, Award } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { PlayerEditSheet } from "../players/player-edit-sheet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographySmall, TypographyLarge } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/formatting";

export function ProfileLinksClient({
  username,
  name,
  dm,
  player,
}: {
  username: string;
  name: string;
  dm?: {
    imageUrl: string | null;
    level: number;
    achievementsCount: number;
    campaignsCount: number;
    about: string;
    id: string;
  };
  player: {
    imageUrl: string | null;
    level: number;
    achievementsCount: number;
    about: string;
    id: string;
  };
}) {
  const hasDM = dm !== undefined;
  const [selectedRole, setSelectedRole] = useState<"player" | "dm">(hasDM ? "dm" : "player");

  const profile = selectedRole === "dm" && dm ? { role: "dm" as const, ...dm } : { role: "player" as const, ...player };

  const setDM = () => {
    if (!hasDM) return;
    setSelectedRole("dm");
  };

  const setPlayer = () => {
    setSelectedRole("player");
  };

  const roleText = profile.role === "dm" ? "DM" : "Player";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={24} className="mb-[2px]" />
          Your Profile
        </CardTitle>
        <CardDescription>Your public profile as a {roleText}.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {profile.imageUrl ? (
            <Image
              src={profile.imageUrl}
              alt={`Profile image of ${name}`}
              width={128}
              height={128}
              className="w-28 h-28 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-border flex items-center justify-center">
              <User size={24} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <TypographyLarge className="text-xl">{name}</TypographyLarge>
            <TypographySmall className="text-muted-foreground">Level {profile.level}</TypographySmall>
            <p className="text-md mt-2">{truncateText(profile.about, 100)}</p>
          </div>
        </div>

        {profile.achievementsCount > 0 ? (
          <div className="flex items-center gap-2 px-4 rounded-lg mt-2">
            <Trophy size={20} className="text-amber-500" />
            <div className="flex sm:flex-row flex-col gap-2">
              <TypographySmall className="font-medium uppercase">
                {profile.achievementsCount} Achievement{profile.achievementsCount !== 1 ? "s" : ""}
              </TypographySmall>
              <TypographySmall className="text-muted-foreground">Earned as {roleText}</TypographySmall>
            </div>
          </div>
        ) : null}

        {profile.role === "dm" &&
        profile.campaignsCount &&
        Number.isInteger(profile.campaignsCount) &&
        profile.campaignsCount > 0 ? (
          <div className="flex items-center gap-2 px-4 rounded-lg">
            <Award size={20} className="text-green-500" />
            <div className="flex sm:flex-row flex-col gap-2">
              <TypographySmall className="font-medium uppercase">
                {profile.campaignsCount} Campaign{profile.campaignsCount !== 1 ? "s" : ""}
              </TypographySmall>
              <TypographySmall className="text-muted-foreground">Managed as DM</TypographySmall>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex sm:flex-row flex-col gap-2">
            {profile.role === "player" && dm ? (
              <Button variant="outline" className="sm:w-fit w-full flex flex-row items-center gap-1" onClick={setDM}>
                <Gamepad2 size={16} />
                View as DM
              </Button>
            ) : profile.role !== "player" ? (
              <Button
                variant="outline"
                className="sm:w-fit w-full flex flex-row items-center gap-1"
                onClick={setPlayer}
              >
                <User size={16} />
                View as Player
              </Button>
            ) : null}
            <Button asChild variant="default" className="w-full">
              <Link href={`/${profile.role + "s"}/${username}`} target="_blank">
                View {roleText} Profile
              </Link>
            </Button>
            {profile.role === "player" ? (
              <PlayerEditSheet player={{ about: profile.about, id: profile.id }} path="/my">
                <Button variant="outline" type="button" className="w-fit">
                  Edit
                </Button>
              </PlayerEditSheet>
            ) : (
              <Button asChild variant="outline" className="sm:w-fit w-full">
                <Link href={`/dms/${username}/edit`} target="_blank">
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

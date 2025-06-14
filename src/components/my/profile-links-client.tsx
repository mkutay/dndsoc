"use client";

import { User, Gamepad2, Trophy, Award } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographySmall, TypographyLarge } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";

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
  };
  player: {
    imageUrl: string | null;
    level: number;
    achievementsCount: number;
  };
}) {
  const hasDM = dm !== undefined;
  const [profile, setProfile] = useState<{
    role: "player" | "dm";
    imageUrl: string | null;
    level: number;
    achievementsCount: number;
    campaignsCount?: number;
  }>(hasDM ? {
    role: "dm",
    imageUrl: dm.imageUrl,
    level: dm.level,
    achievementsCount: dm.achievementsCount,
    campaignsCount: dm.campaignsCount,
  } : {
    role: "player",
    imageUrl: player.imageUrl,
    level: player.level,
    achievementsCount: player.achievementsCount,
  });

  const setDM = () => {
    if (!hasDM) return;
    setProfile({
      role: "dm",
      imageUrl: dm.imageUrl,
      level: dm.level,
      achievementsCount: dm.achievementsCount,
      campaignsCount: dm.campaignsCount,
    });
  };

  const setPlayer = () => {
    setProfile({
      role: "player",
      imageUrl: player.imageUrl,
      level: player.level,
      achievementsCount: player.achievementsCount,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={24} className="mb-[2px]" />
          Your Profile
        </CardTitle>
        <CardDescription>
          Your public profile as a {profile.role === "dm" ? "DM" : "Player"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {profile.imageUrl ? (
            <Image
              src={profile.imageUrl}
              alt={`Profile image of ${name}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center">
              <User size={24} className="text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <TypographyLarge className="font-normal">{name}</TypographyLarge>
            <TypographySmall className="text-muted-foreground">
              Level {profile.level}
            </TypographySmall>
          </div>
        </div>

        {profile.achievementsCount > 0 ? <div className="flex items-center gap-2 px-4 rounded-lg">
          <Trophy size={20} className="text-amber-500" />
          <div className="flex sm:flex-row flex-col gap-2">
            <TypographySmall className="font-medium uppercase">
              {profile.achievementsCount} Achievement{profile.achievementsCount !== 1 ? 's' : ''}
            </TypographySmall>
            <TypographySmall className="text-muted-foreground">
              Earned as {profile.role === "dm" ? "DM" : "Player"}
            </TypographySmall>
          </div>
        </div> : null}

        {profile.campaignsCount && Number.isInteger(profile.campaignsCount) && profile.campaignsCount > 0 ? <div className="flex items-center gap-2 px-4 rounded-lg">
          <Award size={20} className="text-green-500" />
          <div className="flex sm:flex-row flex-col gap-2">
            <TypographySmall className="font-medium uppercase">
              {profile.campaignsCount} Campaign{profile.campaignsCount !== 1 ? 's' : ''}
            </TypographySmall>
            <TypographySmall className="text-muted-foreground">
              Managed as DM
            </TypographySmall>
          </div>
        </div> : null}
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex sm:flex-row flex-col gap-2">
            {profile.role === "player" && dm ? <Button variant="outline" className="w-full flex flex-row items-center gap-1" onClick={setDM}>
              <Gamepad2 size={16} />
              View as DM
            </Button> : profile.role !== "player" ? <Button variant="outline" className="w-full flex flex-row items-center gap-1" onClick={setPlayer}>
              <User size={16} />
              View as Player
            </Button> : null}
            <Button asChild variant="default" className="w-full">
              <Link href={`/${profile.role + "s"}/${username}`} target="_blank">
                Go to Public Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
"use client";

import { User, Gamepad2, Trophy, ExternalLink, Glasses, Edit } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { PlayerEditSheet } from "../players/player-edit-sheet";
import { DMEditSheet } from "../dm-edit-sheet";
import { AdminEditSheet } from "../admin-edit-sheet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographySmall, TypographyLarge } from "@/components/typography/paragraph";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/utils/formatting";

export function ProfileLinksClient({
  username,
  name,
  dm,
  player,
  admin,
}: {
  username: string;
  name: string;
  dm?: {
    imageUrl: string | undefined;
    level: number;
    achievementsCount: number;
    about: string;
    id: string;
  };
  player: {
    imageUrl: string | undefined;
    level: number;
    achievementsCount: number;
    about: string;
    id: string;
  };
  admin?: {
    imageUrl: string | undefined;
    about: string;
    id: string;
  };
}) {
  const [selectedRole, setSelectedRole] = useState<"player" | "dm" | "admin">(
    admin !== undefined ? "admin" : dm !== undefined ? "dm" : "player",
  );

  const profile =
    selectedRole === "admin" && admin
      ? { role: "admin" as const, ...admin }
      : selectedRole === "dm" && dm
        ? { role: "dm" as const, ...dm }
        : { role: "player" as const, ...player };

  const setAdmin = () => {
    if (admin === undefined) return;
    setSelectedRole("admin");
  };

  const setDM = () => {
    if (dm === undefined) return;
    setSelectedRole("dm");
  };

  const setPlayer = () => {
    setSelectedRole("player");
  };

  const roleText = profile.role === "admin" ? "Admin" : profile.role === "dm" ? "DM" : "Player";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={24} className="mb-[2px]" />
          Your Profile ({roleText})
        </CardTitle>
        <CardDescription>Your public profile as a {roleText}.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-x-4">
          {profile.imageUrl ? (
            <Image
              src={profile.imageUrl}
              alt={`Profile image of ${name}`}
              width={128}
              height={128}
              className="w-28 h-28 rounded-full object-cover border-2 border-border float-start"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-border flex items-center justify-center float-start">
              <User size={24} className="text-muted-foreground" />
            </div>
          )}
          <TypographyLarge className="text-xl">{name}</TypographyLarge>
          {"level" in profile && (
            <TypographySmall className="text-muted-foreground">Level {profile.level}</TypographySmall>
          )}
          <p className="text-md mt-2">{truncateText(profile.about, 120)}</p>
        </div>

        {"achievementsCount" in profile && profile.achievementsCount > 0 ? (
          <div className="flex sm:justify-start justify-center items-center gap-2 px-4 rounded-lg mt-2">
            <Trophy size={20} className="text-amber-500" />
            <div className="flex sm:flex-row flex-col gap-2">
              <TypographySmall className="font-medium uppercase">
                {profile.achievementsCount} Achievement{profile.achievementsCount !== 1 ? "s" : ""}
              </TypographySmall>
              <TypographySmall className="text-muted-foreground">Earned as a {roleText}</TypographySmall>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex sm:flex-row flex-col gap-2 justify-end">
            {profile.role !== "admin" && admin ? (
              <Button variant="secondary" className="grow flex flex-row items-center gap-1" onClick={setAdmin}>
                <Glasses size={16} />
                View as Admin
              </Button>
            ) : null}
            {profile.role !== "dm" && dm ? (
              <Button variant="secondary" className="grow flex flex-row items-center gap-1" onClick={setDM}>
                <Gamepad2 size={16} />
                View as DM
              </Button>
            ) : null}
            {profile.role !== "player" ? (
              <Button variant="secondary" className="grow flex flex-row items-center gap-1" onClick={setPlayer}>
                <User size={16} />
                View as Player
              </Button>
            ) : null}
            <div className="flex flex-row gap-2">
              {profile.role === "player" ? (
                <PlayerEditSheet player={{ about: profile.about, id: profile.id }} path="/my">
                  <Button variant="outline" type="button" className="sm:w-fit grow">
                    <Edit size={16} className="mr-1.5" />
                    Edit
                  </Button>
                </PlayerEditSheet>
              ) : profile.role === "dm" ? (
                <DMEditSheet dm={{ about: profile.about, id: profile.id }} path="/my">
                  <Button variant="outline" type="button" className="sm:w-fit grow">
                    <Edit size={16} className="mr-1.5" />
                    Edit
                  </Button>
                </DMEditSheet>
              ) : (
                <AdminEditSheet admin={{ about: profile.about, id: profile.id }} path="/my">
                  <Button variant="outline" type="button" className="sm:w-fit grow">
                    <Edit size={16} className="mr-1.5" />
                    Edit
                  </Button>
                </AdminEditSheet>
              )}
              <Button asChild variant="default" size="icon">
                <Link href={`/${profile.role + "s"}/${username}`} target="_blank">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

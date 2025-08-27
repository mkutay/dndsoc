"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/styling";
import { TypographyLink } from "@/components/typography/paragraph";
import { removeAchievementSchema } from "@/config/achievements";
import { removeAchievement } from "@/server/achievements";
import { actionResultToResult } from "@/types/error-typing";
import { useToast } from "@/hooks/use-toast";
import type {
  ReceivedAchievementsCharacter,
  ReceivedAchievementsDM,
  ReceivedAchievementsPlayer,
} from "@/types/full-database.types";

export function RemoveAchievement({
  achievements,
  removalType,
  removalId,
  path,
}: {
  achievements: ReceivedAchievementsPlayer[] | ReceivedAchievementsDM[] | ReceivedAchievementsCharacter[];
  removalType: "player" | "character" | "dm";
  removalId: string;
  path: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof removeAchievementSchema>>({
    resolver: zodResolver(removeAchievementSchema),
    defaultValues: {
      removalType,
      removalId,
    },
  });

  const handleSubmit = (values: z.infer<typeof removeAchievementSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await removeAchievement(values, path));
      result.match(
        () => {
          toast({ title: "Achievement removed successfully!" });
          setOpen(false);
          form.reset();
        },
        (error) => toast({ title: "Failed to remove achievement", description: error.message, variant: "destructive" }),
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          disabled={pending}
          className="font-quotes w-fit h-full sm:text-lg text-base flex flex-row items-center gap-4 px-6 py-4 bg-card rounded-2xl shadow-md hover:bg-card/80 transition-all"
        >
          Remove Achievement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Achievement</DialogTitle>
          <DialogDescription>
            Select an achievement to remove from {removalType}. This will delete all records of this achievement for the
            selected {removalType}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="achievementId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {!field.value && "Select an achievement..."}
                          {field.value
                            ? (() => {
                                const achievement = achievements.find((a) => field.value === a.achievement_uuid);
                                return achievement ? (
                                  <span>
                                    <TypographyLink
                                      target="_blank"
                                      href={`/achievements/${achievement.achievements.shortened}`}
                                      variant="default"
                                    >
                                      {achievement.achievements.name}
                                    </TypographyLink>
                                  </span>
                                ) : null;
                              })()
                            : null}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[231px] p-0 pointer-events-auto">
                      <Command>
                        <CommandInput placeholder="Search a party..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No other achievement found.</CommandEmpty>
                          <CommandGroup>
                            {achievements.map((achievement) => (
                              <CommandItem
                                value={achievement.achievements.name}
                                key={achievement.achievements.id}
                                onSelect={() => {
                                  form.setValue("achievementId", achievement.achievements.id);
                                }}
                              >
                                <span>
                                  <TypographyLink
                                    target="_blank"
                                    href={`/achievements/${achievement.achievements.shortened}`}
                                    variant="default"
                                  >
                                    {achievement.achievements.name}
                                  </TypographyLink>
                                </span>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    achievement.achievements.id === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="w-full flex flex-row justify-end">
                <Button type="submit" variant="default" size="default" disabled={pending}>
                  Remove
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

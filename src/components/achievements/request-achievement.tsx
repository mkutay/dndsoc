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
import { type Tables } from "@/types/database.types";
import { cn } from "@/utils/styling";
import { TypographyLink } from "@/components/typography/paragraph";
import { requestAchievementSchema } from "@/config/achievements";
import { requestAchievement } from "@/server/achievements";
import { actionResultToResult } from "@/types/error-typing";
import { useToast } from "@/hooks/use-toast";

type Achievements = (Tables<"achievements"> & {
  requested: (
    | Tables<"achievement_requests_character">
    | Tables<"achievement_requests_dm">
    | Tables<"achievement_requests_player">
  )[];
})[];

export function RequestAchievement({
  achievements,
  receiverType,
  receiverId,
  path,
}: {
  achievements: Achievements;
  receiverType: "player" | "character" | "dm";
  receiverId: string;
  path: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof requestAchievementSchema>>({
    resolver: zodResolver(requestAchievementSchema),
    defaultValues: {
      receiverType,
      receiverId,
    },
  });

  const handleSubmit = (values: z.infer<typeof requestAchievementSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await requestAchievement(values, path));
      result.match(
        () => {
          toast({ title: "Achievement requested successfully!" });
          setOpen(false);
          form.reset();
        },
        (error) =>
          toast({ title: "Failed to request achievement", description: error.message, variant: "destructive" }),
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
          className="w-fit h-full text-lg flex flex-row items-center gap-4 px-6 py-4 font-quotes text-secondary-foreground bg-secondary rounded-2xl shadow-md hover:bg-secondary/80 transition-all"
        >
          Request Achievement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Achievement</DialogTitle>
          <DialogDescription>Select an achievement to request for your own character!</DialogDescription>
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
                                const achievement = achievements.find((a) => field.value === a.id);
                                return achievement ? (
                                  <span>
                                    <TypographyLink
                                      target="_blank"
                                      href={`/achievements/${achievement.shortened}`}
                                      variant="default"
                                    >
                                      {achievement.name}
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
                            {achievements
                              .filter(
                                (achievement) =>
                                  achievement.requested.length === 0 || achievement.requested[0].status === "approved",
                              )
                              .map((achievement) => (
                                <CommandItem
                                  value={achievement.name}
                                  key={achievement.id}
                                  onSelect={() => {
                                    form.setValue("achievementId", achievement.id);
                                  }}
                                >
                                  <span>
                                    <TypographyLink
                                      target="_blank"
                                      href={`/achievements/${achievement.shortened}`}
                                      variant="default"
                                    >
                                      {achievement.name}
                                    </TypographyLink>
                                  </span>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      achievement.id === field.value ? "opacity-100" : "opacity-0",
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
                  Request
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

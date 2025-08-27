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
import { giveAchievementSchema } from "@/config/achievements";
import { giveAchievement } from "@/server/achievements";
import { actionResultToResult } from "@/types/error-typing";
import { useToast } from "@/hooks/use-toast";

export function GiveAchievement({
  achievements,
  receiverType,
  receiverId,
  path,
}: {
  achievements: Tables<"achievements">[];
  receiverType: "player" | "character" | "dm";
  receiverId: string;
  path: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof giveAchievementSchema>>({
    resolver: zodResolver(giveAchievementSchema),
    defaultValues: {
      receiverType,
      receiverId,
    },
  });

  const handleSubmit = (values: z.infer<typeof giveAchievementSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await giveAchievement(values, path));
      result.match(
        () => {
          toast({ title: "Achievement given successfully!" });
          setOpen(false);
          form.reset();
        },
        (error) => toast({ title: "Failed to give achievement", description: error.message, variant: "destructive" }),
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
          Give Achievement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give Achievement</DialogTitle>
          <DialogDescription>
            Select an achievement to give to the {receiverType} and fill in the details.
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
                            {achievements.map((achievement) => (
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
                  Give
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

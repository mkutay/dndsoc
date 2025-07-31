"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RefreshCcw } from "lucide-react";
import { useState, useTransition } from "react";

import { Switch } from "../ui/switch";
import { NumberInput } from "@/components/ui/number-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import type { Tables } from "@/types/database.types";
import { editAchievementSchema } from "@/config/achievements";
import { editAchievement } from "@/server/achievements";
import { convertToShortened } from "@/utils/formatting";

export function EditAchievementSheet({
  achievement,
  children,
  path,
}: {
  achievement: Tables<"achievements">;
  children: React.ReactNode;
  path: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = useState(searchParams.get("edit") === "true");
  const router = useRouter();

  const setOpenSeachParams = (o: boolean) => {
    if (o) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("edit", "true");
      router.replace(pathname + "?" + params.toString());
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.replace(pathname + "?" + params.toString());
    }
    setOpen(o);
  };

  const form = useForm<z.infer<typeof editAchievementSchema>>({
    resolver: zodResolver(editAchievementSchema),
    defaultValues: {
      id: achievement.id,
      name: achievement.name,
      shortened: achievement.shortened,
      description: achievement.description,
      descriptionLong: achievement.description_long,
      points: achievement.points,
      difficulty: achievement.difficulty,
      type: achievement.type,
      isHidden: achievement.is_hidden,
    },
  });

  const onSubmit = async (values: z.infer<typeof editAchievementSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await editAchievement(values, path));

      result.match(
        () => {
          toast({
            title: "Update Successful",
          });
          setOpenSeachParams(false);
        },
        (error) =>
          toast({
            title: "Update Failed",
            description: "Please try again. " + error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpenSeachParams}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md w-full p-0">
        <ScrollArea className="h-full sm:px-6 px-3 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>Edit this achievement. This is visible to everyone.</SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="name"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Hardest Achievement Ever"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          form.setValue("shortened", convertToShortened(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortened"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shortened</FormLabel>
                    <FormControl>
                      <Input placeholder="shoort" {...field} />
                    </FormControl>
                    <FormDescription>This is the shortened version of the name, used in URLs.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="points"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the experience points awarded for completing this achievement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="No one can complete this." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the short description of the achievement. This is visible to everyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionLong"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description Long</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-40" placeholder="No one can complete this." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the long description of the achievement. This is visible to everyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row justify-between flex-wrap"
                      >
                        {["easy", "medium", "hard", "impossible"].map((difficulty) => (
                          <FormItem key={difficulty} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={difficulty} />
                            </FormControl>
                            <FormLabel className="font-quotes">
                              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This is the difficulty of the achievement. It can be easy, medium, hard, or legendary.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row justify-between flex-wrap"
                      >
                        {["player", "character", "dm"].map((type) => (
                          <FormItem key={type} className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value={type} />
                            </FormControl>
                            <FormLabel className="font-quotes">
                              {type === "dm" ? "DM" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This is the type of the achievement. Player achievements are for players, character achievements
                      are for characters, and DM achievements are for DMs.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isHidden"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={pending} />
                    </FormControl>
                    <div>
                      <FormLabel>Is Hidden</FormLabel>
                      <FormDescription>If checked, this achievement will not be visible to users.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <SheetFooter className="flex sm:flex-row sm:justify-between items-end w-full gap-2">
                <Button type="reset" variant="ghost" size="icon" disabled={pending} onClick={() => form.reset()}>
                  <RefreshCcw />
                </Button>
                <div className="flex flex-row gap-2 items-center sm:w-fit w-full">
                  <SheetClose asChild className="sm:w-fit w-full">
                    <Button variant="outline" disabled={pending}>
                      Close
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={pending} className="sm:w-fit w-full">
                    Submit
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

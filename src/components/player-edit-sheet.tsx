"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

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
import { playersEditSchema } from "@/config/players";
import { updatePlayer } from "@/server/players";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";

export function PlayerEditSheet({
  player,
  children,
  path,
}: {
  player: { about: string; id: string };
  children: React.ReactNode;
  path: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof playersEditSchema>>({
    resolver: zodResolver(playersEditSchema),
    defaultValues: {
      about: player.about,
      playerId: player.id,
    },
  });

  const onSubmit = (values: z.infer<typeof playersEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updatePlayer(values, path));

      result.match(
        () => {
          toast({
            title: "Update Successful",
            description: "Your profile has been updated.",
          });
          setOpen(false); // Close sheet only after successful update
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md sm:p-2 p-0 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>Edit your public player page. This is visible to everyone.</SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="image"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormDescription>Upload a new image for your profile.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea placeholder="I am awesome!" className="h-40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" disabled={isPending}>
                    Close
                  </Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

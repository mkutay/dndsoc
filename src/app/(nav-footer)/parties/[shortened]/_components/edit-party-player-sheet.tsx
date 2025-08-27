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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { partyPlayerEditSchema } from "@/config/parties";
import { updatePlayerParty } from "@/server/parties";

export function EditPartyPlayerSheet({
  party,
  children,
  path,
}: {
  party: { about: string; id: string };
  children: React.ReactNode;
  path: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof partyPlayerEditSchema>>({
    resolver: zodResolver(partyPlayerEditSchema),
    defaultValues: {
      about: party.about,
      partyId: party.id,
    },
  });

  const onSubmit = (values: z.infer<typeof partyPlayerEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updatePlayerParty(values, path));

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
                <SheetDescription>Edit your party&apos;s public page. This is visible to everyone.</SheetDescription>
              </SheetHeader>
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

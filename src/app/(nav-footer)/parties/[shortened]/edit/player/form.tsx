"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { partyPlayerEditSchema } from "@/config/parties";
import { updatePlayerParty } from "@/server/parties";

export function PlayerForm({ about, partyUuid }: { about: string; partyUuid: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof partyPlayerEditSchema>>({
    resolver: zodResolver(partyPlayerEditSchema),
    defaultValues: {
      about,
    },
  });

  const onSubmit = async (values: z.infer<typeof partyPlayerEditSchema>) => {
    setPending(true);
    const result = actionResultToResult(await updatePlayerParty(values, partyUuid));
    setPending(false);

    result.match(
      () =>
        toast({
          title: "Update Successful",
          description: "Your party has been updated.",
        }),
      (error) =>
        toast({
          title: "Update Failed",
          description: "Please try again. " + error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
        <FormField
          control={form.control}
          name="about"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="I am awesome!" {...field} />
              </FormControl>
              <FormDescription>This is your public about.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { playersEditSchema } from "@/config/player-edit-schema";
import { Player } from "@/types/full-database.types";
import { actionResultMatch } from "@/types/error-typing";
import { updatePlayer } from "@/server/players";

export function PlayerEditForm({ player }: { player: Player }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof playersEditSchema>>({
    resolver: zodResolver(playersEditSchema),
    defaultValues: {
      about: player.about,
    },
  });

  const onSubmit = async (values: z.infer<typeof playersEditSchema>) => {
    setPending(true);
    const result = await updatePlayer(values, player.id);
    setPending(false);

    actionResultMatch(
      result,
      () =>
        toast({
          title: "Update Successful",
          description: "Your profile has been updated.",
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

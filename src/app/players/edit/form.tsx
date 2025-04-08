"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { redirect } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updatePlayer } from "@/lib/players/update";
import { playersEditSchema } from "@/config/player-edit-schema";
import { Player } from "@/types/full-database.types";

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

    if (result.ok) {
      toast({
        title: "Update Successful",
        description: "Your profile has been updated.",
      });
      redirect("/players/" + player.users.username);
    } else {
      toast({
        title: "Update Failed",
        description: "Please try again. " + result.error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose">
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
              <FormDescription>
                This is your public about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>Submit</Button>
      </form>
    </Form>
  )
}
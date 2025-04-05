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
import { playersEditSchema } from "./schema";
import { Tables } from "@/types/database.types";

export function PlayerEditForm({ player, username }: { player: Tables<"players">, username: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof playersEditSchema>>({
    resolver: zodResolver(playersEditSchema),
    defaultValues: {
      about: player.about,
      originalAbout: player.about,
    },
  });
 
  const onSubmit = async (values: z.infer<typeof playersEditSchema>) => {
    setPending(true);
    const result = await updatePlayer(values, player.user_uuid);
    setPending(false);

    if (result.ok) {
      console.log("Update successful");
      toast({
        title: "Update Successful",
        description: "Your profile has been updated.",
      });
      redirect("/players/" + username);
    } else {
      // Handle error
      console.error(result.error.message);
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
        <input type="hidden" {...form.register("originalAbout")} />
        <Button type="submit" disabled={pending}>Submit</Button>
      </form>
    </Form>
  )
}
"use client";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addCharacterSchema } from "@/config/add-character-schema";
import { actionResultMatch } from "@/types/error-typing";
import { insertCharacter } from "@/server/characters";

export function AddCharacterForm({ playerUuid }: { playerUuid: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof addCharacterSchema>>({
    resolver: zodResolver(addCharacterSchema),
    defaultValues: {
      name: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof addCharacterSchema>) => {
    setPending(true);
    const result = await insertCharacter(values, playerUuid);
    setPending(false);

    actionResultMatch(
      result,
      (value) => toast({
        title: "Success: Character added.",
        description: "You can now edit the specifics of your character.",
        variant: "default",
      }) && redirect(`/characters/${value.shortened}/edit`),
      (error) => toast({
        title: "Error: Could not add character.",
        description: error.message,
        variant: "destructive",
      })
    )
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Giant Lizard The Junior" {...field} />
              </FormControl>
              <FormDescription>
                This is your character&apos;s name. You can&apos;t change this after submitting.
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
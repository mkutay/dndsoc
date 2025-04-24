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
import { actionResultMatch } from "@/types/error-typing";
import { createPartySchema } from "@/config/create-party-schema";
import Server from "@/server/server";

export function AddPartyForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof createPartySchema>) => {
    setPending(true);
    const result = await Server.Parties.Insert(values);
    setPending(false);

    actionResultMatch(
      result,
      (value) => toast({
        title: "Success: Party created.",
        description: "You can now edit the specifics of your party.",
        variant: "default",
      }) && redirect(`/parties/${value.shortened}/edit`),
      (error) => toast({
        title: "Error: Could not create party.",
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
                <Input placeholder="The Dragonslayers" {...field} />
              </FormControl>
              <FormDescription>
                This is your parties name. You can&apos;t change this after submitting.
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
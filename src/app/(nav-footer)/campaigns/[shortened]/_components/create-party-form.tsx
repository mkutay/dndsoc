"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createPartySchema } from "@/config/parties";
import { insertPartyWithCampaign } from "@/server/parties";
import { actionResultToResult } from "@/types/error-typing";

export function CreatePartyForm({ campaignUuid }: { campaignUuid: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createPartySchema>) => {
    setPending(true);
    const result = actionResultToResult(await insertPartyWithCampaign(values, campaignUuid));
    setPending(false);

    result.match(
      (value) => {
        toast({
          title: "Success: Party created.",
          description: "You can now edit the specifics of your party.",
          variant: "default",
        });

        router.push(`/parties/${value.shortened}?edit=true`);
      },
      (error) =>
        toast({
          title: "Error: Could not create party.",
          description: error.message,
          variant: "destructive",
        }),
    );
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
              <FormDescription>This is your parties name. You can&apos;t change this after submitting.</FormDescription>
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

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DMEditSchema } from "@/config/dms";
import { updateDM } from "@/server/dms";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";

export function DMEditForm({ dm }: { dm: { id: string; about: string } }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof DMEditSchema>>({
    resolver: zodResolver(DMEditSchema),
    defaultValues: {
      about: dm.about,
    },
  });

  const onSubmit = async (values: z.infer<typeof DMEditSchema>) => {
    setPending(true);
    const result = actionResultToResult(await updateDM(values, dm.id));
    setPending(false);

    result.match(
      () =>
        toast({
          title: "Update Successful",
          description: "Your DM profile has been updated.",
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
          name="avatar"
          disabled={pending}
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

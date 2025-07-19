"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { associatesSignUpFormSchema } from "@/config/auth-schemas";
import { actionResultMatch } from "@/types/error-typing";
import { associatesSignUpAction } from "@/server/auth/sign-up";
import { TypographyLink } from "@/components/typography/paragraph";
import { Textarea } from "@/components/ui/textarea";

export function SignUpForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof associatesSignUpFormSchema>>({
    resolver: zodResolver(associatesSignUpFormSchema),
    defaultValues: {
      email: "",
      name: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof associatesSignUpFormSchema>) => {
    setPending(true);
    const result = await associatesSignUpAction(values);
    setPending(false);

    actionResultMatch(
      result,
      () => {
        router.push(`/request-sent?email=${encodeURIComponent(values.email)}`);
      },
      (error) =>
        toast({
          title: "Sign Up Failed",
          description: "Please try again. " + error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row justify-between items-center">
                Email
                <TypographyLink className="text-xs font-quotes" variant="muted" href="/sign-up" tabIndex={-1}>
                  Have a KCL email?
                </TypographyLink>
              </FormLabel>
              <FormControl>
                <Input placeholder="hello@example.com" {...field} />
              </FormControl>
              {/* <FormDescription>This is your KCL email address.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="I am from... I like to play DnD because..." {...field} />
              </FormControl>
              <FormDescription>Any other information that will help us in your submission.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

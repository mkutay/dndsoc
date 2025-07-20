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
import { signUpFormSchema } from "@/config/auth-schemas";
import { signUpAction } from "@/server/auth/sign-up";
import { TypographyLink } from "@/components/typography/paragraph";
import { actionResultToResult } from "@/types/error-typing";

export function SignUpForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      knumber: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    setPending(true);
    const result = actionResultToResult(await signUpAction(values));
    setPending(false);

    result.match(
      () => {
        router.push(`/confirmation-sent?email=${encodeURIComponent(values.email)}`);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-4 space-y-3">
        <FormField
          control={form.control}
          name="username"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Awesome" {...field} />
              </FormControl>
              <FormDescription>You cannot change it later.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="knumber"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>K-Number</FormLabel>
              <FormControl>
                <Input placeholder="K12345678" {...field} />
              </FormControl>
              {/* <FormDescription>This is your K-Number.</FormDescription> */}
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
                <TypographyLink
                  className="text-xs font-quotes"
                  variant="muted"
                  href="/associates-sign-up"
                  tabIndex={-1}
                >
                  Don&apos;t have a KCL email?
                </TypographyLink>
              </FormLabel>
              <FormControl>
                <Input placeholder="first.second@kcl.ac.uk" {...field} />
              </FormControl>
              {/* <FormDescription>This is your KCL email address.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              {/* <FormDescription>Must be at least 6 characters long.</FormDescription> */}
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

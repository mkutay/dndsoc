"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInFormSchema } from "@/config/auth-schemas";
import { TypographyLink } from "@/components/typography/paragraph";
import { signInAction } from "@/server/auth/sign-in";
import { actionResultToResult } from "@/types/error-typing";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    setPending(true);
    const result = actionResultToResult(await signInAction(values));
    setPending(false);

    result.match(
      () => {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/my");
        }
      },
      (error) =>
        toast({
          title: "Sign In Failed",
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
          name="identifier"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifier</FormLabel>
              <FormControl>
                <Input placeholder="first.second@kcl.ac.uk/Awesome" {...field} />
              </FormControl>
              <FormDescription>Use your KCL email address or your username to sign in.</FormDescription>
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
              <FormLabel className="flex flex-row justify-between items-center">
                Password
                <TypographyLink className="text-xs font-quotes" variant="muted" href="/forgot-password" tabIndex={-1}>
                  Forgot your password?
                </TypographyLink>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              {/* <FormDescription>This is your password. It must be at least 6 characters long.</FormDescription> */}
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

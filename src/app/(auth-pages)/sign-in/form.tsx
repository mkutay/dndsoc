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
import { actionResultMatch } from "@/types/error-typing";
import { TypographyLink } from "@/components/typography/paragraph";
import { signInAction } from "@/server/auth/sign-in";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    setPending(true);
    const result = await signInAction(values);
    setPending(false);

    actionResultMatch(
      result,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="first.second@kcl.ac.uk" {...field} />
              </FormControl>
              <FormDescription>This is your KCL email address.</FormDescription>
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
                <TypographyLink className="text-xs" variant="muted" href="/forgot-password" tabIndex={-1}>
                  Forgot your password?
                </TypographyLink>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormDescription>This is your password. It must be at least 6 characters long.</FormDescription>
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

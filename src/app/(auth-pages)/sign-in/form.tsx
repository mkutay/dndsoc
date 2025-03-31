"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link";
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
import { signInAction } from "./action";
import { signInFormSchema } from "../schemas";

export function SignInForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

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
    if (result.ok) {
      console.log("Sign in successful");
      redirect("/protected");
    } else {
      // Handle error
      console.error(result.error.message);
      toast({
        title: "Sign In Failed",
        description: "Please try again. " + result.error.message,
        variant: "destructive",
      })
    }
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
              <FormDescription>
                This is your KCL email address.
              </FormDescription>
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
                <Link className="text-xs font-normal text-muted-foreground underline hover:text-muted-foreground/80 transition-colors" href="/forgot-password">
                  Forgot your password?
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your password. It must be at least 6 characters long.
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
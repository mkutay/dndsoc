"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { forgotPasswordFormSchema } from "@/config/auth-schemas";
import { useToast } from "@/hooks/use-toast";
import { actionResultMatch } from "@/types/error-typing";
import { forgotPasswordAction } from "@/server/auth/forgot-password";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof forgotPasswordFormSchema>) => {
    setPending(true);
    const result = await forgotPasswordAction(values);
    setPending(false);

    actionResultMatch(result,
      () => toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for further instructions.",
        variant: "default",
      }),
      (error) => toast({
        title: "Error Resetting Password",
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
        <Button type="submit" disabled={pending}>Submit</Button>
      </form>
    </Form>
  )
}
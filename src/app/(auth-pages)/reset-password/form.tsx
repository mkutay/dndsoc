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
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/config/auth-schemas";
import { actionResultMatch } from "@/types/error-typing";
import { resetPasswordAction } from "@/server/auth/reset-password";

export function ResetPasswordForm() {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
 
  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setPending(true);
    const result = await resetPasswordAction(values);
    setPending(false);

    actionResultMatch(result,
      () => toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      }),
      (error) => toast({
        title: "Error Updating Password",
        description: error.message,
        variant: "destructive",
      })
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your new password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your new password. It must be at least 6 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row justify-between items-center">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Type again to confirm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Type your new password again to confirm it.
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
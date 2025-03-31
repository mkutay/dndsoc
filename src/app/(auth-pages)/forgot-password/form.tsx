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
import { forgotPasswordAction } from "./action";
import { forgotPasswordFormSchema } from "../schemas";
import { useToast } from "@/hooks/use-toast";

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
    if (result.ok) {
      // Handle success
      console.log("Password reset email sent.");
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for further instructions.",
        variant: "default",
      });
    } else {
      // Handle error
      console.error(result.error);
      toast({
        title: "Error Resetting Password",
        description: result.error.message,
        variant: "destructive",
      });
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
        <Button type="submit" disabled={pending}>Submit</Button>
      </form>
    </Form>
  )
}
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { completeInviteSchema } from "@/config/auth-schemas";
import { completeInviteAction } from "@/server/auth/complete-invite";
import { actionResultToResult } from "@/types/error-typing";

export function CompleteInviteForm({ tokenHash }: { tokenHash: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof completeInviteSchema>>({
    resolver: zodResolver(completeInviteSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof completeInviteSchema>) => {
    setPending(true);
    const result = actionResultToResult(await completeInviteAction(values, tokenHash));
    setPending(false);

    result.match(
      () => {
        toast({
          title: "Creation Completed!",
          description: "Your account has been successfully created.",
          variant: "default",
        });
        setTimeout(() => {
          router.push("/my");
        }, 1200);
      },
      (error) =>
        toast({
          title: "Error Creating Account",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>You can&apos;t change it later.</FormDescription>
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
              <FormDescription>Must be at least 6 characters long.</FormDescription>
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

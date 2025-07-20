"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { userEditSchema } from "@/config/auth-schemas";
import { updateUser } from "@/server/users";
import { actionResultToResult } from "@/types/error-typing";

export function UserEditForm({
  user,
  onCancel,
  onSuccess,
}: {
  user: {
    auth_user_uuid: string;
    username: string;
    name: string;
  };
  onCancel?: () => void;
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof userEditSchema>) => {
    setPending(true);
    const result = actionResultToResult(await updateUser(values, user.auth_user_uuid));
    setPending(false);

    result.match(
      () => {
        toast({
          title: "Update Successful",
          description: "Your information has been updated. Refresh to see changes.",
        });
        onSuccess?.();
      },
      (error) =>
        toast({
          title: "Update Failed",
          description: "Please try again. " + error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit size={20} />
          Edit Account
        </CardTitle>
        <CardDescription>Update your account settings.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Kutay" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                Update Information
              </Button>
              {onCancel ? (
                <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

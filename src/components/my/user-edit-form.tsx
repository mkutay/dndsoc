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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { userEditSchema } from "@/config/user-edit-schema";
import { actionResultMatch } from "@/types/error-typing";
import { updateUser } from "@/server/users";
import { Edit } from "lucide-react";

export function UserEditForm({ 
  user,
  onCancel,
  onSuccess
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
      username: user.username,
      name: user.name,
    },
  });
 
  const onSubmit = async (values: z.infer<typeof userEditSchema>) => {
    setPending(true);
    const result = await updateUser(values, user.auth_user_uuid);
    setPending(false);

    actionResultMatch(
      result,
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
        })
    )
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit size={20} />
          Edit Profile
        </CardTitle>
        <CardDescription>
          Update your username and display name.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="awesome" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your username. It can only contain letters, numbers, and underscores.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>Update Information</Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
                  Cancel
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

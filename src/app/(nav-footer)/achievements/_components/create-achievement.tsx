"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { createAchievementSchema } from "@/config/achievements";
import { convertToShortened } from "@/utils/formatting";
import { createAchievement } from "@/server/achievements";

export function CreateAchievement({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createAchievementSchema>>({
    resolver: zodResolver(createAchievementSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createAchievementSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await createAchievement(values));
      setOpen(false);

      result.match(
        () => {
          toast({
            title: "Achievement created",
            variant: "default",
          });
          router.push(`/achievements/${convertToShortened(values.name)}?edit=true`);
        },
        (error) =>
          toast({
            title: "Could not create achievement",
            description: error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogDescription>You can create a new party to be a DM for!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The Dragonslayers" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your parties name. You can&apos;t change this after submitting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

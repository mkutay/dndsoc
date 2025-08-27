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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createPartySchema } from "@/config/parties";
import { insertParty } from "@/server/parties";
import { actionResultToResult } from "@/types/error-typing";

export function CreateParty() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createPartySchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await insertParty(values));
      setOpen(false);

      result.match(
        (value) => {
          toast({
            title: "Party created",
            description: "You can now edit the specifics of your party.",
            variant: "default",
          });
          router.push(`/parties/${value.shortened}?edit=true`);
        },
        (error) =>
          toast({
            title: "Could not create party",
            description: error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-52"
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">Create a New Party</Card>
        </Button>
      </DialogTrigger>
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

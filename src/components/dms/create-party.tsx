"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";

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
import { actionResultMatch } from "@/types/error-typing";
import { createPartySchema } from "@/config/create-party-schema";
import Server from "@/server/server";

export function CreateParty() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createPartySchema>) => {
    startTransition(async () => {
      const result = await Server.Parties.Insert.DM(values);

      actionResultMatch(
        result,
        (value) => {
          toast({
            title: "Success: Party created.",
            description: "You can now edit the specifics of your party.",
            variant: "default",
          });
          setOpen(false);
          redirect(`/parties/${value.shortened}/edit/dm`);
        },
        (error) => toast({
          title: "Error: Could not create party.",
          description: error.message,
          variant: "destructive",
        })
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          asChild
        >
          <Card className="text-3xl font-book-card-titles tracking-widest">
            Create a New Party
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogDescription>
            You can create a new party to be a DM for!
          </DialogDescription>
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
                    This is your parties name. You can&apos;t change this after
                    submitting.
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
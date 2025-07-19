"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createPollSchema } from "@/config/poll-schema";
import { createPoll } from "@/server/polls";
import { actionResultMatch } from "@/types/error-typing";
import { Input } from "@/components/ui/input";

export function CreatePoll() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof createPollSchema>>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createPollSchema>) => {
    setIsPending(true);
    const result = await createPoll(data);
    setIsPending(false);

    actionResultMatch(
      result,
      (shortened) => {
        toast({
          title: "Success: Poll created",
          description: "You can now share your poll.",
          variant: "default",
        });
        setOpen(false);
        redirect(`/polls/${shortened}/edit`);
      },
      (error) => {
        toast({
          title: "Error creating poll",
          description: error.message,
          variant: "destructive",
        });
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" type="button" className="w-fit mt-4">
          Create a New Poll
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Poll</DialogTitle>
          <DialogDescription>This will create a new poll that you can edit further.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="New Poll" {...field} />
                  </FormControl>
                  <FormDescription>This is the question or title of your poll.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="w-full flex flex-row justify-end">
                <Button type="submit" variant="default" size="default" disabled={isPending}>
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

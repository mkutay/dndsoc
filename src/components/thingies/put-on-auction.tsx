"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { NumberInput } from "../ui/number-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { addToAuctionSchema } from "@/config/auction";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { setUpForAuction } from "@/server/auction";
import { actionResultToResult } from "@/types/error-typing";

export function PutOnAuction({ thingyId, shortened }: { thingyId: string; shortened: string }) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof addToAuctionSchema>>({
    resolver: zodResolver(addToAuctionSchema),
    defaultValues: {
      thingyId,
      amount: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof addToAuctionSchema>) => {
    setPending(true);
    const result = actionResultToResult(await setUpForAuction(values));
    setPending(false);

    result.match(
      () => {
        toast({
          title: "Auction set up successfully",
          description: "Your thingy is now up for auction.",
        });
        router.push(`/auction/${shortened}`);
      },
      (error) => {
        toast({
          title: "Error setting up auction",
          description: error.message,
          variant: "destructive",
        });
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" disabled={pending}>
          Put Up on Auction
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will put your thingy up for auction and make it public to all users, if it is not already.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormField
              control={form.control}
              name="amount"
              disabled={pending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    If you have multiple of the same thingy, you can specify the amount here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useRouter } from "next/navigation";
import type { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { createTrade } from "@/server/auctions";
import { actionResultToResult } from "@/types/error-typing";
import { buyThingySchema } from "@/config/auction";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";

export function BuyThingySheet({
  auctionId,
  thingies,
  shortened,
}: {
  auctionId: string;
  thingies: Array<
    Tables<"thingy"> & {
      characters: Tables<"characters"> | null;
    }
  >;
  shortened: string;
}) {
  const { toast } = useToast();
  const [filter, setFilter] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const filteredThingies = thingies.filter(
    (thingy) =>
      thingy.name.toLowerCase().includes(filter.toLowerCase()) ||
      thingy.characters?.name?.toLowerCase().includes(filter.toLowerCase()),
  );

  const form = useForm<z.infer<typeof buyThingySchema>>({
    resolver: zodResolver(buyThingySchema),
    defaultValues: {
      auctionId,
      thingyId: "",
      amount: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof buyThingySchema>) => {
    setPending(true);
    const result = actionResultToResult(await createTrade(values, shortened));
    setPending(false);

    result.match(
      () => {
        toast({
          title: "Trade proposed!",
          description: "Your trade has been successfully proposed.",
        });
        router.refresh();
      },
      (error) => {
        toast({
          title: "Error creating trade",
          description: error.message,
          variant: "destructive",
        });
      },
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="w-fit">
          Buy!
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Trade!</SheetTitle>
          <SheetDescription>
            Select one of your items to trade and the amount you want to trade. This will make that thingy public if it
            is not already.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter">Filter Thingies</Label>
              <Input
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by name..."
              />
            </div>
            <ScrollArea className="h-72">
              <FormField
                control={form.control}
                name="thingyId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup className="grid gap-4" value={field.value} onValueChange={field.onChange}>
                        {filteredThingies.map((thingy) => (
                          <Label
                            key={thingy.id}
                            htmlFor={thingy.id}
                            className="flex items-center gap-4 rounded-md px-4 py-3 hover:bg-accent transition-colors"
                          >
                            <RadioGroupItem value={thingy.id} id={thingy.id} />
                            <div className="grid gap-1">
                              <div className="font-quotes">{thingy.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {thingy.characters?.name ? `Character: ${thingy.characters.name}` : "No character"}
                              </div>
                            </div>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>
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
                  <FormDescription>Specify the amount you want to trade for this item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending || !form.watch("thingyId")} className="w-full">
              {pending ? "Proposing..." : "Propose Trade"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

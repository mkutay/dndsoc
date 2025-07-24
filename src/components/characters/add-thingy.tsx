"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { actionResultToResult } from "@/types/error-typing";
import { addThingySchema, Thingy } from "@/config/thingy";
import { insertThingy } from "@/server/thingies";

export function AddThingy({ characterUuid }: { characterUuid: string }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof addThingySchema>>({
    resolver: zodResolver(addThingySchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      public: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (values: z.infer<typeof addThingySchema>) => {
    setPending(true);
    const result = actionResultToResult(await insertThingy(values, characterUuid));
    setPending(false);

    result.match(
      (value) => {
        toast({
          title: "Success: Thingy added.",
          description: "You can now edit the specifics of it.",
          variant: "default",
        });
        router.push(`/thingies/${value.shortened}`);
      },
      (error) =>
        toast({
          title: "Error: Could not add thingy.",
          description: error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="nothing"
          type="button"
          className="w-full h-full rounded-lg hover:bg-card/80 bg-card min-h-60"
          asChild
          disabled={pending}
        >
          <Card className="text-3xl font-book-card-titles tracking-widest cursor-pointer">Add Thingy</Card>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-2 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Add Thingy</SheetTitle>
                <SheetDescription>
                  You can add a thingy you own in the game to the system, to trade, to show off, etc.
                </SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="name"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="The amazing staff" {...field} />
                    </FormControl>
                    {/* <FormDescription>This is the name of the thingy.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A powerful staff that can cast fireball." {...field} />
                    </FormControl>
                    <FormDescription>
                      Be as descriptive as possible in your description of the item. Include any and all details that
                      might be relevant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Is public?</FormLabel>
                      <FormDescription>
                        If you make this public, other people can see that you have this thingy.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`tags`}
                render={() => (
                  <FormItem className="space-y-1">
                    <FormLabel>Thingy Type</FormLabel>
                    <FormControl>
                      <div className="flex flex-row flex-wrap gap-1 w-full">
                        {fields.map((field, index) => (
                          <FormField
                            control={form.control}
                            key={field.id}
                            name={`tags.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="nothing"
                                    size="badge"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                    disabled={pending}
                                    asChild
                                  >
                                    <Badge
                                      variant="nothing"
                                      className="text-sm border-transparent bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                      {field.value.value}
                                    </Badge>
                                  </Button>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                size="badge"
                                variant="nothing"
                                className="w-[50px] rounded-full"
                                asChild
                                disabled={pending}
                              >
                                <Badge>
                                  <PlusIcon size={18} />
                                </Badge>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search types..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No types left/found.</CommandEmpty>
                                <CommandGroup>
                                  {Thingy.filter((t) => !fields.some((field) => field.value === t)).map((thingy) => (
                                    <CommandItem
                                      value={thingy}
                                      key={thingy}
                                      onSelect={() => {
                                        setComboBoxOpen(false);
                                        append({ value: thingy });
                                      }}
                                    >
                                      {thingy}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is the type of the thingy. You can add multiple types to the same thingy. Click on the badge
                      to remove it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button type="submit" disabled={pending}>
                  Submit
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

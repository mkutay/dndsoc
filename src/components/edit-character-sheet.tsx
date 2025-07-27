"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { MinusIcon, PlusIcon, RefreshCcw } from "lucide-react";
import { useState, useTransition } from "react";

import { usePathname, useRouter } from "next/navigation";
import { NumberInput } from "./ui/number-input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { actionResultToResult } from "@/types/error-typing";
import { characterEditSchema } from "@/config/character-schema";
import { updateCharacter } from "@/server/characters";
import { cn } from "@/utils/styling";

export function EditCharacterSheet({
  character,
  children,
  path,
  edit,
}: {
  character: {
    races: {
      name: string;
    }[];
    classes: {
      name: string;
    }[];
    about: string;
    level: number;
    id: string;
  };
  children: React.ReactNode;
  path: string;
  edit?: boolean;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(edit);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const setOpenSeachParams = (o: boolean) => {
    if (edit) router.replace(pathname);
    setOpen(o);
  };

  const classes = character.classes.map((cls) => ({ value: cls.name }));

  const form = useForm<z.infer<typeof characterEditSchema>>({
    resolver: zodResolver(characterEditSchema),
    defaultValues: {
      about: character.about,
      level: character.level,
      race: character.races[0] ? character.races[0].name : "",
      classes: classes.length ? classes : [{ value: "" }],
      characterId: character.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classes",
  });

  const onSubmit = (values: z.infer<typeof characterEditSchema>) => {
    startTransition(async () => {
      const result = actionResultToResult(await updateCharacter(values, path));

      result.match(
        () => {
          toast({
            title: "Update Successful",
            description: "Your profile has been updated.",
          });
          setOpenSeachParams(false);
        },
        (error) =>
          toast({
            title: "Update Failed",
            description: "Please try again. " + error.message,
            variant: "destructive",
          }),
      );
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpenSeachParams}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-md sm:p-2 p-0 py-6">
        <ScrollArea className="h-full px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              <SheetHeader>
                <SheetTitle>Edit</SheetTitle>
                <SheetDescription>Edit your public player page. This is visible to everyone.</SheetDescription>
              </SheetHeader>
              <FormField
                control={form.control}
                name="avatar"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormDescription>Upload a new image for your character.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea placeholder="I am awesome!" className="h-48" {...field} />
                    </FormControl>
                    <FormDescription>This is your public about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <NumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>This is your character&apos;s level.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="race"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race</FormLabel>
                    <FormControl>
                      <Input placeholder="Human" {...field} />
                    </FormControl>
                    <FormDescription>This is your character&apos;s race.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`classes.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 ? "hidden" : "flex")}>Classes</FormLabel>
                        <FormControl>
                          <div className="relative w-full items-center">
                            <Input
                              {...field}
                              placeholder="Fighter"
                              value={field.value.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange({ value });
                              }}
                              disabled={isPending}
                              className="w-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full shrink-0"
                              onClick={() => {
                                remove(index);
                              }}
                              disabled={fields.length <= 1 || isPending}
                            >
                              <MinusIcon size={14} />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className={cn(index !== fields.length - 1 ? "hidden" : "flex")}>
                          These are your character&apos;s classes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 space-x-1 items-center"
                  onClick={() => {
                    append({ value: "" });
                  }}
                  disabled={isPending}
                >
                  <PlusIcon size="18px" />
                  <span>Add Class</span>
                </Button>
              </div>
              <SheetFooter className="flex sm:flex-row sm:justify-between items-end w-full gap-2">
                <Button type="reset" variant="ghost" size="icon" disabled={isPending} onClick={() => form.reset()}>
                  <RefreshCcw />
                </Button>
                <div className="flex flex-row gap-2 items-center sm:w-fit w-full">
                  <SheetClose asChild className="sm:w-fit w-full">
                    <Button variant="outline" disabled={isPending}>
                      Close
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={isPending} className="sm:w-fit w-full">
                    Submit
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

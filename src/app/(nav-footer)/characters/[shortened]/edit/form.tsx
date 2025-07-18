"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { MinusIcon, PlusIcon, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { characterEditSchema } from "@/config/character-schema";
import { cn } from "@/utils/styling";
import { actionResultMatch } from "@/types/error-typing";
import { updateCharacter } from "@/server/characters";

export function CharacterEditForm({
  character,
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
    shortened: string;
  };
}) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const classes = character.classes.map((cls) => ({ value: cls.name }));

  const form = useForm<z.infer<typeof characterEditSchema>>({
    resolver: zodResolver(characterEditSchema),
    defaultValues: {
      about: character.about,
      level: character.level,
      race: character.races[0] ? character.races[0].name : "",
      classes: classes.length ? classes : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "classes",
  });

  const onSubmit = async (values: z.infer<typeof characterEditSchema>) => {
    setPending(true);
    const result = await updateCharacter(values, character.shortened);
    setPending(false);

    actionResultMatch(
      result,
      () =>
        toast({
          title: "Update Successful",
          description: "Your profile has been updated.",
        }),
      (error) =>
        toast({
          title: "Update Failed",
          description: "Please try again. " + error.message,
          variant: "destructive",
        }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
        <FormField
          control={form.control}
          name="about"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="I am awesome!" {...field} />
              </FormControl>
              <FormDescription>This is your public about.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          disabled={pending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow empty input or valid numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      field.onChange(value === "" ? "" : Number(value));
                    }
                  }}
                  value={field.value}
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
          disabled={pending}
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
        <div>
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
                        disabled={pending}
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
                        disabled={fields.length <= 1 || pending}
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
            disabled={pending}
          >
            <PlusIcon size="18px" />
            <span>Add Class</span>
          </Button>
        </div>
        <div className="flex flex-row gap-2">
          <Button type="submit" disabled={pending}>
            Submit
          </Button>
          <Button type="reset" variant="ghost" size="icon" disabled={pending} onClick={() => form.reset()}>
            <RefreshCcw />
          </Button>
        </div>
      </form>
    </Form>
  );
}

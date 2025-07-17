"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { enterCodeFormSchema } from "@/config/when2dnd";

export function EnterCodeForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof enterCodeFormSchema>>({
    resolver: zodResolver(enterCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof enterCodeFormSchema>) => {
    router.push(`/when2dnd/${values.code}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2 w-full">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="abcd-efgh-jklm-nopq" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enter</Button>
      </form>
    </Form>
  );
}

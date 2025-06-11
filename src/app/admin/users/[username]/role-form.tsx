"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

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
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/database.types";
import { adminRoleEditSchema } from "@/config/admin-schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { rolesLabel } from "@/types/full-database.types";
import { actionResultMatch } from "@/types/error-typing";
import { updateRole } from "@/server/roles";

export function AdminRoleEditForm({ role }: { role: Tables<"roles"> }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof adminRoleEditSchema>>({
    resolver: zodResolver(adminRoleEditSchema),
    defaultValues: {
      role: role.role
    },
  });
 
  const onSubmit = async (values: z.infer<typeof adminRoleEditSchema>) => {
    setPending(true);
    const result = await updateRole(values, role.auth_user_uuid);
    setPending(false);

    actionResultMatch(result,
      () => toast({
        title: "Update Successful",
        description: "Role has been updated.",
      }),
      (error) => toast({
        title: "Update Failed",
        description: "Please try again. " + error.message,
        variant: "destructive",
      })
    )
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-prose mt-6">
        <FormField
          control={form.control}
          name="role"
          disabled={pending}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Role</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[250px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={pending || field.value === 'admin'}
                    >
                      {field.value
                        ? rolesLabel.find(
                            (role) => role.value === field.value
                          )?.label
                        : "Select role"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search role..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        {rolesLabel.map((role) => {
                          return (
                            <CommandItem
                              value={role.label}
                              key={role.value}
                              onSelect={() => {
                                form.setValue("role", role.value as z.infer<typeof adminRoleEditSchema>["role"]);
                              }}
                              disabled={pending || role.value === 'admin'}
                            >
                              {role.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  role.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The user&apos;s role in the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending || role.role === 'admin'}>Update</Button>
      </form>
    </Form>
  )
}
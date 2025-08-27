"use client";

import { z } from "zod";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useForm, type Resolver, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "./use-toast";
import { actionResultToResult, type ActionResult } from "@/types/error-typing";

export const useBetterForm = <S extends z.ZodObject, T, E>(
  schema: S,
  defaultValues: z.infer<S>,
  action: (values: z.infer<S>, pathname: string) => Promise<ActionResult<T, E>>,
  onSuccess: (result: T) => void,
  onError: (error: E) => void,
) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<S>, unknown, z.infer<S>>({
    // cast resolver and defaultValues to match expected types
    resolver: zodResolver(schema) as Resolver<z.infer<S>, unknown, z.infer<S>>,
    defaultValues: defaultValues as DefaultValues<z.infer<S>>,
  });

  const onSubmit = (values: z.infer<S>) => {
    startTransition(async () => {
      const result = actionResultToResult(await action(values, pathname));

      result.match(onSuccess, onError);
    });
  };

  return { form, onSubmit, isPending, open, setOpen, toast };
};

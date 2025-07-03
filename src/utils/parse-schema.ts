import { err, ok, Result } from "neverthrow";
import { z } from "zod";

type SchemaValidationError = {
  message: string;
  code: "INVALID_VALUES";
};

export const parseSchema = <O extends object>(
  schema: z.ZodSchema<O>,
  values: O,
): Result<void, SchemaValidationError> => {
  const validation = schema.safeParse(values);
  return validation.success
    ? ok()
    : err({
        message: "Invalid values for schema: " + validation.error.message,
        code: "INVALID_VALUES",
      });
};

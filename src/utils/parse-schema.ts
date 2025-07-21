import { err, ok, Result } from "neverthrow";
import { z } from "zod";

type SchemaValidationError = {
  message: string;
  code: "INVALID_VALUES";
};

export const parseSchema = <O>(schema: z.ZodSchema<O>, values: O): Result<O, SchemaValidationError> => {
  const validation = schema.safeParse(values);
  return validation.success
    ? ok(values)
    : err({
        message: "Invalid values for schema: " + validation.error.message,
        code: "INVALID_VALUES",
      });
};

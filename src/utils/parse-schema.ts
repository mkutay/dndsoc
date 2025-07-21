import { err, ok, Result } from "neverthrow";
import { Data, Effect } from "effect";
import { z } from "zod";

type SchemaValidationError = {
  message: string;
  code: "INVALID_VALUES";
};

export const parseSchema = <O extends object>(schema: z.ZodSchema<O>, values: O): Result<O, SchemaValidationError> => {
  const validation = schema.safeParse(values);
  return validation.success
    ? ok(values)
    : err({
        message: "Invalid values for schema: " + validation.error.message,
        code: "INVALID_VALUES",
      });
};

class SchemaValidationErrorEffect extends Data.TaggedError("SchemaValidationError")<{
  message: string;
}> {}

export const parseSchemaEffect = <O>(
  schema: z.ZodSchema<O>,
  values: O,
): Effect.Effect<O, SchemaValidationErrorEffect> => {
  const validation = schema.safeParse(values);

  return validation.success
    ? Effect.succeed(values)
    : Effect.fail(
        new SchemaValidationErrorEffect({ message: "Invalid values for schema: " + validation.error.message }),
      );
};

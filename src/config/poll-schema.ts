import { z } from "zod";

export const createPollSchema = z.object({
  question: z.string().min(1, "Question is required.").max(200, "Question must be 200 characters or less."),
});

export const editPollSchema = createPollSchema.extend({
  expiresAt: z.date().nullable(),
  shortened: z
    .string()
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
      "Shortened value must start and end with letters or numbers, and can contain underscores and dashes.",
    )
    .optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text is required.").max(250, "Option text must be 250 characters or less."),
        id: z.string().uuid().optional(),
      }),
    )
    .min(2, "At least two options are required."),
});

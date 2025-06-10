import { z } from "zod";

export const createPollSchema = z.object({
  question: z.string().min(1, "Question is required."),
});

export const editPollSchema = createPollSchema.extend({
  expiresAt: z.date().nullable(),
  shortened: z.string().optional(),
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required."),
    id: z.string().uuid().optional(),
  })).min(2, "At least two options are required."),
});
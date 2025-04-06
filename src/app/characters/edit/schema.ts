import { z } from "zod";

export const characterEditSchema = z.object({
  about: z.string().max(200, "About must be 200 characters or less."),
  level: z.number().int().min(1, "Level must be at least 1.").max(20, "Level must be at most 20."),
  race: z.string(),
  classes: z.array(z.object({
    value: z.string().min(1, "Class is required."),
  })).min(1, "At least one class is required."),
});
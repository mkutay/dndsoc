import { z } from "zod";

export const playersEditSchema = z.object({
  about: z.string().max(200, "About must be 200 characters or less."),
});

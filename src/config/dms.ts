import { z } from "zod";

export const DMEditSchema = z.object({
  about: z.string().max(1000, "About must be 1000 characters or less."),
});

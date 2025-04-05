import { z } from "zod";

export const playersEditSchema = z.object({
  about: z.string().max(200, "About must be 200 characters or less."),
  originalAbout: z.string().optional(),
}).refine(data => data.about !== data.originalAbout, {
  message: "Please make changes before submitting.",
  path: ["about"]
});

import { z } from "zod";

export const playersEditSchema = z.object({
  about: z.string().min(1, "About is required"),
  originalAbout: z.string().optional(),
}).refine(data => data.about !== data.originalAbout, {
  message: "Please make changes before submitting.",
  path: ["about"]
});

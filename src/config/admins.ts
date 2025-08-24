import { z } from "zod";

import { imageSchema } from "./avatar-upload-schema";

export const adminEditSchema = z.object({
  about: z.string().max(1000, "About must be 1000 characters or less."),
  avatar: imageSchema.optional(),
  adminId: z.uuid(),
});

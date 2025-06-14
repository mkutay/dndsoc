import { z } from "zod";

export const userEditSchema = z.object({
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  name: z.string().min(2).max(60),
});

import { z } from "zod";

export const adminRoleEditSchema = z.object({
  role: z.enum(["admin", "player", "dm"]),
});

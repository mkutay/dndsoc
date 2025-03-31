import { z } from "zod";

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
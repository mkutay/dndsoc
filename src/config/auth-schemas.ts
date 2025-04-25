import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const signUpFormSchema = z.object({
  knumber: z.string().min(9).max(9).startsWith("K", "K-number must start with 'K'."),
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
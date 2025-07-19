import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .max(100, "Password must be at most 100 characters long.");

export const usernameSchema = z
  .string()
  .min(1, "Username must be at least one character long.")
  .max(20, "Username must be at most 20 characters long.")
  .regex(
    /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
    "Username must start and end with letters or numbers, and can contain underscores and dashes.",
  );

export const kNumberSchema = z
  .string()
  .length(9, "K-number must be have 8 digits and start with 'K'.")
  .startsWith("K", "K-number must start with 'K'.");

const nameSchema = z
  .string()
  .min(1, "Name must be at least one character long.")
  .max(60, "Name must be at most 60 characters long.");

export const emailSchema = z
  .string()
  .email("Email must be a valid email address.")
  .max(100, "Email must be at most 100 characters long.");

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export const signInFormSchema = z.object({
  identifier: z.union([kNumberSchema, emailSchema, usernameSchema]),
  password: passwordSchema,
});

export const signUpFormSchema = z.object({
  knumber: kNumberSchema,
  username: usernameSchema,
  email: emailSchema.refine(
    // For testing purposes:
    (email) => email.endsWith("@kcl.ac.uk") || email.endsWith("@mkutay.dev"),
    "Email must end with '@kcl.ac.uk'.",
  ),
  password: passwordSchema,
});

export const associatesSignUpFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  notes: z.string().max(1000, "Notes section must not exceed 1000 characters.").optional(),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });

export const userEditSchema = z.object({
  name: nameSchema,
});

export const completeInviteSchema = z.object({
  password: passwordSchema,
  username: usernameSchema,
});

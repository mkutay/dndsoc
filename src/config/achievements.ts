import z from "zod";
import { Constants } from "@/types/database.types";

export const giveAchievementSchema = z.object({
  achievementId: z.uuid({ error: "An achievement must be selected." }),
  receiverId: z.uuid(),
  receiverType: z.enum(["player", "character", "dm"], {
    error: "Receiver type must be either player, character, or dm.",
  }),
});

export const removeAchievementSchema = z.object({
  achievementId: z.uuid({ error: "An achievement must be selected." }),
  removalId: z.uuid(),
  removalType: z.enum(["player", "character", "dm"], {
    error: "Receiver type must be either player, character, or dm.",
  }),
});

export const editAchievementSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, { message: "Achievement name is required." }),
  shortened: z.string().min(1, { message: "Achievement shortened is required." }),
  description: z.string().min(1, { message: "Achievement description is required." }),
  descriptionLong: z.string(),
  points: z.number().min(0, { message: "Points must be a positive number." }),
  difficulty: z.enum(Constants.public.Enums.difficulty),
  type: z.enum(Constants.public.Enums.achievement_type),
  isHidden: z.boolean(),
});

export const createAchievementSchema = z.object({
  name: z.string().min(1, { message: "Achievement name is required." }),
});

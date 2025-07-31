import z from "zod";

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

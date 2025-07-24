import z from "zod";

export const addToAuctionSchema = z.object({
  thingyId: z.uuid(),
  amount: z.number().min(1),
});

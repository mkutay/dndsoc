import { z } from "zod";

export const journalAllEditSchema = z.object({
  excerpt: z.string().min(1, "Excerpt is required."),
  date: z.date({
    required_error: "Date is required."
  }),
  title: z.string().min(1, "Title is required."),
  shortened: z.string().optional(),
  entries: z.array(z.object({
    partyId: z.string().min(1, "Party ID is required."),
    text: z.string().min(1, "Entry text is required."),
  })).min(1, "At least one entry is required.")
});

export const journalPartyEntryEditSchema = z.object({
  text: z.string().min(1, "Entry text is required.")
});

export const journalCreateSchema = z.object({
  title: z.string().min(1, "Title is required."),
  campaignId: z.string({
    required_error: "Campaign is required.",
  }).uuid(),
});
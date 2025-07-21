import { z } from "zod";

const titleSchema = z.string().min(1, "Title is required.").max(100, "Title must be 100 characters or less.");

const entryTextSchema = z
  .string()
  .min(1, "Entry text is required.")
  .max(2000, "Entry text must be 2000 characters or less.");

export const journalAllEditSchema = z.object({
  excerpt: titleSchema,
  date: z.date({
    error: (issue) => (issue.input === undefined ? "Date is required." : "Invalid date format."),
  }),
  title: z.string().min(1, "Title is required.").max(100, "Title must be 100 characters or less."),
  shortened: z
    .string()
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/,
      "Shortened value must start and end with letters or numbers, and can contain underscores and dashes.",
    )
    .optional(),
  entries: z
    .array(
      z.object({
        partyId: z.string().min(1, "Party ID is required."),
        text: entryTextSchema,
      }),
    )
    .nonempty("At least one entry is required."),
});

export const journalPartyEntryEditSchema = z.object({
  text: entryTextSchema,
});

export const journalCreateSchema = z.object({
  title: titleSchema,
  campaignId: z.uuid("Campaign is required."),
});

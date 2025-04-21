import { z } from "zod";

export const partyPlayerEditSchema = z.object({
  about: z.string().max(200, "About must be 200 characters or less."),
});

export const partyDMEditSchema = z.object({
  about: z.string().max(200, "About must be 200 characters or less."),
  level: z.number().min(1, "Level must be at least 1.").max(20, "Level must be at most 20."),
  name: z.string().max(50, "Name must be 50 characters or less.").min(1, "Name must be at least 1 character."),
  characters: z.array(z.object({
    id: z.string().min(1, "Character is required."),
  })).min(1, "At least one character is required.").refine(
    (characters) => new Set(characters.map(character => character.id)).size === characters.length,
    "Characters must be unique."
  ),
  campaigns: z.array(z.object({
    id: z.string().min(1, "Campaign is required."),
  })).min(1, "At least one campaign is required.").refine(
    (campaigns) => new Set(campaigns.map(campaign => campaign.id)).size === campaigns.length,
    "Campaigns must be unique."
  ),
  dms: z.array(z.object({
    id: z.string().min(1, "DM is required."),
  })).min(1, "At least one DM is required.").refine(
    (dms) => new Set(dms.map(dm => dm.id)).size === dms.length,
    "DMs must be unique."
  ),
  selectedCharacter: z.string().optional(), // For the combobox
  selectedCampaign: z.string().optional(), // For the combobox
  selectedDM: z.string().optional(), // For the combobox
});